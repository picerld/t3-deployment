import { userFormSchema } from "@/features/users/create/forms/user";
import bcrypt from "bcrypt";
import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
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

        const where: import("@prisma/client").Prisma.UserWhereInput = search
        ? {
            name: {
                contains: search,
                mode: "insensitive" as const,
            },
            }
        : {};

        const totalItems = await ctx.db.user.count({ where });
        const lastPage = Math.ceil(totalItems / perPage);

        const data = await ctx.db.user.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        where,
        orderBy: { id: "desc" },
        include: { role: true },
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
    return ctx.db.user.findMany();
  }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.db.user.findUnique({ where: { id: input.id } });
  }),

  getCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.count();
  }),

  getUserWithoutAccount: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.count({
      where: {
        username: null
      },
    });
  }),

  create: publicProcedure.input(userFormSchema)
    .mutation(async ({ ctx, input }) => {

      let hashedPassword = "";

      if (input.password) {
        hashedPassword = await bcrypt.hash(input.password, 10);
      }

      return ctx.db.user.create({
        data: {
          name: input.name,
          username: input.username,
          password: hashedPassword,
          role: {
            connect: { id: input.roleId },
          }
        }
      });
    }),

    delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
        try {
        return await ctx.db.user.delete({
            where: { id: input.id },
        });
        } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2003"
        ) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Tidak dapat menghapus penanggung jawab!",
            });
        }
            throw error;
        }
    }),

    update: publicProcedure.input(userFormSchema)
    .mutation(async ({ ctx, input }) => {
        const hashedPassword = await bcrypt.hash(input.password ?? "", 10);
        return ctx.db.user.update({
            where: { id: input.id },
            data: {
                name: input.name,
                username: input.username,
                password: hashedPassword,
                role: {
                    connect: { id: input.roleId },
                }
            }
        });
    }),
});