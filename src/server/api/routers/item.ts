import { itemFormSchema } from "@/features/item/create/forms/item";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import z from "zod";
import puppeteer from "puppeteer";
import { unparse } from "papaparse";
import { sheets } from "@/lib/googleSheets";

const SHEET_ID = "1ZRIoydJIHfiCg23mfrzwS4pC3d5s_qOR5KAVNGxZ57k";

export const itemRouter = createTRPCRouter({
    getPaginated: publicProcedure
    .input(
        z.object({
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(10),
        search: z.string().optional().default(""),
        category: z.string().optional().default(""),
        owner: z.string().optional().default(""),
        condition: z.string().optional().default(""),
        })
    )
    .query(async ({ ctx, input }) => {
        const start = performance.now();
        const { page, perPage, search, category, owner, condition } = input;

    const where: import("@prisma/client").Prisma.ItemWhereInput = {
    ...(search
        ? {
            name: {
            contains: search,
            mode: "insensitive" as const,
            },
        }
        : {}),
    ...(category
        ? {
            category: {
            name: {
                equals: category,
                mode: "insensitive",
            },
            },
        }
        : {}),
    ...(owner
        ? {
            ownerType: {
                equals: owner as "SEGARIS" | "IMN",
            },
        }
        : {}),
    ...(condition
        ? {
            condition: {
                equals: condition as "BAIK" | "RUSAK" | "PERBAIKAN",
            },
        }
        : {}),
    };

        const [totalItems, data] = await ctx.db.$transaction([
            ctx.db.item.count({ where }),
            ctx.db.item.findMany({
                skip: (page - 1) * perPage,
                take: perPage,
                where,
                orderBy: { updatedAt: "desc" },
                include: {
                category: { select: { id: true, name: true } },
                user: {
                    select: {
                    id: true,
                    name: true,
                    username: true,
                    role: { select: { name: true } },
                    },
                },
                location: { select: { id: true, name: true } },
                },
            }),
        ]);

        const end = performance.now();
        console.log(`Query took ${end - start} ms`);

        return {
            data,
            meta: {
                currentPage: page,
                lastPage: Math.ceil(totalItems / perPage),
                perPage,
                totalItems,
            },
        };
    }),

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.item.findMany({
            orderBy: { updatedAt: "desc" }
        });
    }),

    getTodayCount: publicProcedure.query(({ ctx }) => {
        return ctx.db.item.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        });
    }),

    getCount: publicProcedure.query(({ ctx }) => {
        return ctx.db.item.count();
    }),

    getById: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
        return ctx.db.item.findUnique({ where: { id: input.id } });
    }),

    create: publicProcedure.input(itemFormSchema)
        .mutation(async ({ ctx, input }) => {
            const createdItem = await ctx.db.item.create({ data: {
                name: input.name,
                merk: input.merk,
                quantity: input.quantity,
                color: input.color,
                ownerType: input.ownerType,
                serialNumber: input.serialNumber,
                condition: input.condition,
                history: input.history,
                category: { connect: { id: input.categoryId } },
                user: { connect: { id: input.userId } },
                location: { connect: { id: input.locationId } },
            },
            include: {
                category: true,
                user: true,
                location: true,
            },
        });

        // NOTE: REMOVE IF WANT TO USE GOOGLE SHEET

        // try {
        //     await sheets.spreadsheets.values.append({
        //         spreadsheetId: SHEET_ID,
        //         range: "Sheet1",
        //         valueInputOption: "RAW",
        //         requestBody: {
        //             values: [[
        //                 createdItem.name,
        //                 createdItem.merk,
        //                 createdItem.quantity,
        //                 createdItem.color,
        //                 createdItem.ownerType,
        //                 createdItem.serialNumber,
        //                 createdItem.condition,
        //                 createdItem.history,
        //                 createdItem.category.name,
        //                 createdItem.location.name,
        //                 createdItem.user.name,
        //             ]],
        //         },
        //     }).catch((error) => {
        //         console.error("Failed to write to Google Sheet:", error);
        //     });

        //     console.log("SPREADSHEET DI TRIGGER!");
        // } catch (error) {
        //     console.error("Failed to write to Google Sheet:", error);
        // }

        return createdItem;
    }),

    // TODO: HANDLE UPDATE SPREADSHEET
    update: publicProcedure.input(itemFormSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.item.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                    merk: input.merk,
                    quantity: input.quantity,
                    color: input.color,
                    ownerType: input.ownerType,
                    serialNumber: input.serialNumber,
                    condition: input.condition,
                    history: input.history,
                    category: { connect: { id: input.categoryId } },
                    user: { connect: { id: input.userId } },
                    location: { connect: { id: input.locationId } },
                },
            });
        }),

    delete: publicProcedure.input(z.object({ id: z.string() }))
        .mutation(({ ctx, input }) => {
            return ctx.db.item.delete({ where: { id: input.id } });
    }),

    exportCsv: publicProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { startDate, endDate } = input;

      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);

      const items = await ctx.db.item.findMany({
        where: {
            ...(startDate && {
                updatedAt: {
                    gte: new Date(startDate),
                    lte: endDateObj,
                },
            }),
        },
        include: {
          category: { select: { id: true, name: true } },
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              role: { select: { name: true } },
            },
          },
          location: { select: { id: true, name: true } },
        },
      });

      const formattedItems = items.map((item) => ({
        name: item.name,
        merk: item.merk,
        quantity: item.quantity.toString(),
        color: item.color,
        ownerType: item.ownerType,
        serialNumber: item.serialNumber,
        condition: item.condition,
        history: item.history,
        category: item.category.name,
        user: item.user.name,
        location: item.location.name,
        createdAt: new Date(item.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }),
    }));
    
    let csv = unparse(formattedItems, { header: false, delimiter: ";" });

    const customHeaders = [
        "Nama Barang",
        "Merk",
        "Kuantiti",
        "Warna",
        "Kepemilikan",
        "Serial Number",
        "Kondisi",
        "Riwayat",
        "Kategori",
        "Penanggung Jawab",
        "Ruangan",
        "Tercatat",
    ].join(";");

        csv = customHeaders + "\n" + csv;

        const fileName = `Laporan Pencatatan Barang - ${new Date(endDate).toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
        })}`;

        return { csv, fileName };
    }),

    exportPDF: publicProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { startDate, endDate } = input;

      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);

      const items = await ctx.db.item.findMany({
        where: {
            ...(startDate && {
                updatedAt: {
                    gte: new Date(startDate),
                    lte: endDateObj,
                },
            }),
        },
      });

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Laporan Barang Masuk - SMKN 11 Bandung</title>
<style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; position: relative; }
    .header img { width: 80px; position: absolute; left: 20px; top: 20px; }
    .header p { font-size: 11px; margin: 2px 0; }
    h3, h5 { margin: 2px 0; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .table, .table th, .table td { border: 1px solid black; }
    .table th, .table td { padding: 8px; text-align: center; font-size: 13px; }
</style>
</head>
<body>
<div class="header">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Coat_of_arms_of_West_Java.svg/1200px-Coat_of_arms_of_West_Java.svg.png" alt="Logo Jawa Barat">
    <h5>PEMERINTAH DAERAH PROVINSI JAWA BARAT</h5>
    <h5>DINAS PENDIDIKAN</h5>
    <h5>CABANG DINAS PENDIDIKAN WILAYAH VII</h5>
    <h3>SMK NEGERI 11 KOTA BANDUNG</h3>
    <p>Jl. Budhi Cilember No. 23 Bandung, 40175 Telp/Fax: (022) 6653424</p>
    <p>http://smkn11bdg.sch.id | Email: smkn11bdg@gmail.com</p>
</div>

<h4 style="text-align: center; margin-top: 10px;">LAPORAN DATA BARANG MASUK</h4>

<table style="width: 100%;">
    <tbody>
        <tr>
            <td style="width: 50%;">Kepada Yth</td>
            <td>: Kepala Sekolah</td>
        </tr>
        <tr>
            <td>Dari</td>
            <td>: Sarana</td>
        </tr>
        <tr>
            <td>Tanggal</td>
            <td>: ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</td>
        </tr>
    </tbody>
</table>

<p>Disampaikan dengan hormat, kami dari Unit Kerja Sarana SMKN 11 Bandung menyampaikan laporan barang untuk periode
    ${new Date(endDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}.
</p>

<p>Dengan ini kami sampaikan laporan data barang masuk sebagai berikut:</p>

<table class="table">
<thead>
    <tr>
        <th>No</th>
        <th>JENIS BARANG</th>
        <th>JUMLAH</th>
        <th>TANGGAL</th>
        <th>KETERANGAN</th>
    </tr>
</thead>
<tbody>
    ${
      items
        ? items
            ?.map(
              (item, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td>${item.name}</td>
            <td>${item.quantity ?? "-"}</td>
            <td>${new Date(item.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</td>
            <td></td>
        </tr>`
            )
            .join("")
        : `<tr><td colspan="5">Tidak ada data</td></tr>`
    }
</tbody>
</table>
</body>
</html>
`;

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", bottom: "20mm" },
      });

      const base64PDF = Buffer.from(pdfBuffer).toString("base64");

      await browser.close();

      const fileName = `Laporan Pencatatan Barang - ${new Date(endDate).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })}`;

      return {
        fileName: `${fileName}.pdf`,
        fileData: base64PDF,
      };
    }),
});