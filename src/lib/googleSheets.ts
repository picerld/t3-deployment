import path from "path";
import { google } from 'googleapis';

const KEYFILEPATH = path.join(process.cwd(), "inventory-segaris-35febbb284a5.json");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

export const sheets = google.sheets({ version: "v4", auth });
