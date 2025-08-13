import React from "react";

type ItemRow = {
  no: number;
  name: string;
  merk?: string | null;
  quantity: number;
  createdAt: string;
  remarks?: string | null;
};

export function ItemsReportTemplate(props: {
  fromDateDisplay: string;
  periodDisplay: string;
  rows: ItemRow[];
  logoUrl?: string;
}) {
  const { fromDateDisplay, periodDisplay, rows, logoUrl } = props;

  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <title>Laporan Barang Masuk - SMKN 11 Bandung</title>
        <style>{`
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; position: relative; }
          .header img { width: 80px; position: absolute; left: 20px; top: 50px; }
          .header p { font-size: 11px; }
          .header h5, .header h3, .header p { margin: 2px 0; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table, .table th, .table td { border: 1px solid black; }
          .table th, .table td { padding: 8px; text-align: left; font-size: 13px; }
        `}</style>
      </head>
      <body>
        <div className="header">
          {logoUrl ? <img src={logoUrl} alt="Logo Jawa Barat" /> : null}
          <h5>PEMERINTAH DAERAH PROVINSI JAWA BARAT</h5>
          <h5>DINAS PENDIDIKAN</h5>
          <h5>CABANG DINAS PENDIDIKAN WILAYAH VII</h5>
          <h3>SMK NEGERI 11 KOTA BANDUNG</h3>
          <p>
            Jl. Budhi Cilember No. 23 Bandung, 40175 Telp/Fax: (022) 6653424
          </p>
          <p>http://smkn11bdg.sch.id | Email: smkn11bdg@gmail.com</p>
        </div>

        <h4 style={{ textAlign: "center", marginTop: 10 }}>
          LAPORAN DATA BARANG MASUK
        </h4>

        <table style={{ width: "100%", outline: "none" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%" }}>Kepada Yth</td>
              <td>: Kepala Sekolah</td>
            </tr>
            <tr>
              <td>Dari</td>
              <td>: Sarana</td>
            </tr>
            <tr>
              <td>Tanggal</td>
              <td>: {fromDateDisplay}</td>
            </tr>
          </tbody>
        </table>

        <p>
          Disampaikan dengan hormat, kami dari Unit Kerja Sarana SMKN 11 Bandung
          menyampaikan laporan barang untuk periode {periodDisplay}.
        </p>
        <p>
          Dengan ini kami sampaikan laporan data barang masuk sebagai berikut:
        </p>

        <table className="table">
          <thead>
            <tr>
              <td style={{ textAlign: "center" }}>No</td>
              <td style={{ textAlign: "center" }}>JENIS BARANG</td>
              <td style={{ textAlign: "center" }}>JUMLAH</td>
              <td style={{ textAlign: "center" }}>TANGGAL</td>
              <td style={{ textAlign: "center" }}>KETERANGAN</td>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.no}>
                <td style={{ textAlign: "center" }}>{r.no}</td>
                <td style={{ textAlign: "center" }}>
                  {r.name}
                  {r.merk ? ` (${r.merk})` : ""}
                </td>
                <td style={{ textAlign: "center" }}>{r.quantity}</td>
                <td style={{ textAlign: "center" }}>{r.createdAt}</td>
                <td style={{ textAlign: "center" }}>{r.remarks ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </body>
    </html>
  );
}
