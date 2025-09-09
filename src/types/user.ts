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
    token?: string | null;
    tokenExpiresAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}