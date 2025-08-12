import { itemCategoryIdSchema, itemColor, itemConditionSchema, itemHistorySchema, itemLocationIdSchema, itemMerkSchema, itemNameSchema, itemOwnerTypeSchema, itemPic, itemQuantitySchema, itemSerialNumber } from "@/schemas/item";
import z from "zod";

export const itemFormSchema = z.object({
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
    history: itemHistorySchema,
});

export type ItemFormSchema = z.infer<typeof itemFormSchema>;
