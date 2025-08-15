import { itemCategoryIdSchema, itemColor, itemConditionSchema, itemHistorySchema, itemLocationIdSchema, itemMerkSchema, itemNameSchema, itemOwnerTypeSchema, itemPic, itemQuantitySchema, itemSerialNumber } from "@/schemas/item";
import z from "zod";

export const itemFormSchema = z.object({
    id: z.string().optional(),
    name: itemNameSchema,
    merk: itemMerkSchema,
    categoryId: itemCategoryIdSchema,
    quantity: itemQuantitySchema,
    userId: itemPic,
    color: itemColor,
    ownerType: itemOwnerTypeSchema,
    locationId: itemLocationIdSchema,
    serialNumber: itemSerialNumber,
    condition: itemConditionSchema,
    photo: z.union([z.instanceof(File), z.string()]).optional(),
    history: itemHistorySchema,
});

export type ItemFormSchema = z.infer<typeof itemFormSchema>;
