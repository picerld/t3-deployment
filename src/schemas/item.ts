import z from "zod";

export const itemNameSchema = z
    .string()
    .min(3, { message: "Nama barang minimal 3 karakter" })
    .max(100, { message: "Nama barang maksimal 100 karakter" });

export const itemMerkSchema = z
    .string()
    .min(2, { message: "Merk minimal 2 karakter" })
    .max(100, { message: "Merk maksimal 100 karakter" });

export const itemCategoryIdSchema = z.coerce.number({
    message: "Pilih kategori!",
});

export const itemQuantitySchema = z
    .number()
    .min(1, { message: "Kuantiti minimal 1!" });

export const itemPic = z.string({
    message: "Pilih user!",
});

export const itemColor = z.string({
    message: "Warna barang harus diisi!",
});

export const itemOwnerTypeSchema = z.enum(["IMN", "SEGARIS"], {
    message: "Pilih tipe pemilik barang!",
});

export const itemLocationIdSchema = z.coerce.number({
    message: "Pilih ruangan!",
});

export const itemSerialNumber = z.string({
    message: "Nomor seri harus diisi!",
});

export const itemConditionSchema = z.enum(["BAIK", "RUSAK", "PERBAIKAN"], {
    message: "Pilih kondisi barang!",
});

export const itemHistorySchema = z
    .string()
    .min(3, { message: "History minimal 3 karakter" })

export const itemDetailSchema = z.
    string()
    .optional();