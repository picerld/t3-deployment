import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: NextApiRequest, uploadDir: string) {
  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  try {
    const { files } = await parseForm(req, uploadDir);
    const file = files.file && (Array.isArray(files.file) ? files.file[0] : files.file);

    if (!file || !("filepath" in file)) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = path.basename(file.filepath);
    const fileUrl = `/uploads/${fileName}`;

    return res.status(200).json({ url: fileUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
}
