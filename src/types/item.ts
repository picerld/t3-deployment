import { Category } from "./category";
import { Location } from "./location";
import { User } from "./user";

export type Item = {
    id: string;
    name: string;
    merk: string;
    categoryId: number;
    quantity: number;
    userId: string;
    color: string;
    ownerType: string;
    locationId: number;
    serialNumber: string;
    condition: string;
    history?: string;
    category?: Category;
    location: Location;
    user?: User;
    createdAt: Date;
    updatedAt: Date;
}