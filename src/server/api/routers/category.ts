import { categoryFormSchema } from "@/features/category/create/forms/category";
import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const categoryRouter = createTRPCRouter({
    getPaginated: publicProcedure
    .input(
        z.object({
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(10),
        search: z.string().optional().default(""),
        })
    )
    .query(async ({ ctx, input }) => {
        const { page, perPage, search } = input;

        const where: import("@prisma/client").Prisma.CategoryWhereInput = search
        ? {
            name: {
                contains: search,
                mode: "insensitive" as const,
            },
            }
        : {};

        const totalItems = await ctx.db.category.count({ where });
        const lastPage = Math.ceil(totalItems / perPage);

        const data = await ctx.db.category.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        where,
        orderBy: { id: "desc" },
        });

        return {
        data,
        meta: {
            currentPage: page,
            lastPage,
            perPage,
            totalItems,
            },
        };
    }),

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.category.findMany();
    }),

    getCount: publicProcedure.query(({ ctx }) => {
        return ctx.db.category.count();
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ ctx, input }) => {
        return ctx.db.category.findUnique({ where: { id: input.id } });
    }),

    create: publicProcedure.input(categoryFormSchema)
        .mutation(({ ctx, input }) => {
            return ctx.db.category.create({ data: 
                { name: input.name, description: input.description } 
            });
    }),

    delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
        try {
        return await ctx.db.category.delete({
            where: { id: input.id },
        });
        } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2003"
        ) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Tidak dapat menghapus kategori karena terdapat item di dalamnya!",
            });
        }
            throw error;
        }
    }),

    update: publicProcedure.input(categoryFormSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.category.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                    description: input.description,
                },
            });
    }),
});