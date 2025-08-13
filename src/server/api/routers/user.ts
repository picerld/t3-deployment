import { userFormSchema } from "@/features/users/create/forms/user";
import bcrypt from "bcrypt";
import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
      });

      return {
        data,
        page,
        perPage,
        totalItems,
        lastPage,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  getCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.count();
  }),

  create: publicProcedure.input(userFormSchema)
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);

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
});