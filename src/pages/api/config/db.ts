import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = process.env.DATABASE_URL || "";

  const sanitizedUrl = url.replace(/:\/\/(.*?):(.*?)@/, "://$1:****@");

  res.status(200).json({ url: sanitizedUrl });
}
