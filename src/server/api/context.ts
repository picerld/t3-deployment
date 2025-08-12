import { prisma } from "@/lib/prisma";
import { type NextApiRequest, type NextApiResponse } from "next";

export async function createContext({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  const token = req.cookies?.["auth.token"];
  let user = null;

  if (token) {
    user = await prisma.user.findFirst({
      where: { token, tokenExpiresAt: { gt: new Date() } },
    });
  }

  return {
    req,
    res,
    user,
    db: prisma,
  };
}
