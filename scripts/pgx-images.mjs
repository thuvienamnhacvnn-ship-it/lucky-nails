// Zusätzliche echte Studiofotos (DSC-nhe-chinh) -> public/img/pgx-*.webp. Chạy: node scripts/pgx-images.mjs
import sharp from "sharp";
const SRC = "D:/Work/Lucky Nail/DSC-nhe-chinh/DSC_";
const OUT = "D:/Projects/lucky-nails/public/img/pgx-";
const L = [["fassade", "0765", 1000], ["fassade-wide", "0769", 1600], ["eingang", "0773", 1000], ["detail-hand", "0749", 1500], ["detail-schale", "0748", 1500], ["raum", "0778", 1500], ["arbeit-wide", "0714", 1500], ["pedi-portrait2", "0734", 1000]];
for (const [n, d, w] of L) {
  const i = await sharp(`${SRC}${d}.JPG`).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${OUT}${n}.webp`);
  console.log(n, i.width, i.height, Math.round(i.size / 1024) + "KB");
}
