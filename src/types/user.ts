export type User = {
    id: string;
    name?: string | null;
    username?: string;
    password?: string;
    roleId?: number;
    role?: {
        id?: number;
        name: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}