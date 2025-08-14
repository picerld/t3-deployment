import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    await prisma.role.create({
        data: {
            name: "admin",
        },
    });

    await prisma.role.create({
        data: {
            name: "user",
        },
    });
    
    await prisma.user.create({
        data: {
            username: "admin",
            name: "Admin",
            password: bcrypt.hashSync("admin", 10),
            role: {
                connect: { id: 1 },
            }
        }
    });

    console.log("Seed completed");
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());
