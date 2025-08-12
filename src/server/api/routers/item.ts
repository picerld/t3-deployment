import { itemFormSchema } from "@/features/item/create/forms/item";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import z from "zod";

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
                orderBy: { id: "desc" },
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
        return ctx.db.item.findMany();
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
        .mutation(({ ctx, input }) => {
            return ctx.db.item.create({ data: {
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
            } 
        });
    }),
});