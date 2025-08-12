import { z } from "zod";
import { passwordSchema, usernameSchema } from "@/schemas/auth";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import cookie from "cookie";
import bcrypt from 'bcrypt';

export const authRouter = createTRPCRouter({
  authMe: publicProcedure.query(({ ctx }) => {
    try {
      console.log("user:", ctx.user);
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return ctx.user;
    } catch (error) {
      console.log(error)
    }
  }),

  login: publicProcedure
    .input(z.object({ username: usernameSchema, password: passwordSchema }))
    .mutation(async ({ input, ctx }) => {
      console.log("Login called with", input);
      const { username, password } = input;

      const user = await ctx.db.user.findFirst({
        where: { username },
      });

      console.log("user:", user);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

      await ctx.db.user.update({
        where: { id: user.id },
        data: { token: token, tokenExpiresAt: expiresAt },
      });
      
      ctx.res.setHeader(
        "Set-Cookie",
        cookie.serialize("auth.token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        })
      );

      const { password: _, ...userWithoutPassword } = user;

      return {
        token,
        user: userWithoutPassword,
      };
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    console.log("user logout:", ctx.db.user);

    if (!ctx.db.user) throw new TRPCError({ code: "UNAUTHORIZED" });

    ctx.db.user.update({
      where: { id: ctx.user?.id },
      data: { token: null, tokenExpiresAt: null },
    })

    ctx.res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth.token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      })
    );

    return { success: true };
  }),
});
