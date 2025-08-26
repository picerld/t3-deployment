import { type Category } from "./category";
import { type Location } from "./location";
import { type User } from "./user";

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
    photo?: string;
    history?: string;
    detail?: string;
    category?: Category;
    location: Location;
    user?: User;
    createdAt: Date;
    updatedAt: Date;
}