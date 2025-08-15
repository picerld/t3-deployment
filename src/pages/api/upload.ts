import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ multiples: false, uploadDir: path.join(process.cwd(), "public/uploads"), keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });

    const file = files?.file as formidable.File | undefined;
    const filename = path.basename(file?.filepath as string);
    res.status(200).json({ url: `/uploads/${filename}` });
  });
}
