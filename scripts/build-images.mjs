// Nén ảnh nguồn (ảnh gốc 8 MB) -> WebP trong public/img. Chạy: npm run images
// Đổi/bổ sung ảnh: sửa danh sách JOBS rồi chạy lại (xem README).
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const WORK = "D:/Work/Lucky Nail";
const DSC = `${WORK}/DSC-nhe-chinh`;
const TPL = "_w-agent/mau/template-chatgpt/assets";
const OUT = "public/img";

// [nguồn, tên ra, cạnh dài tối đa, quality, crop phân số {l,t,w,h} (tuỳ chọn)]
const JOBS = [
  // Logo + favicon
  [`${TPL}/logo.png`, "logo.webp", 480, 88],
  // Studio / dịch vụ (ảnh thật)
  [`${DSC}/DSC_0741.JPG`, "welcome.webp", 1400, 76],
  [`${DSC}/DSC_0736.JPG`, "studio-1.webp", 1800, 76],
  [`${DSC}/DSC_0737.JPG`, "studio-2.webp", 1400, 74],
  [`${DSC}/DSC_0738.JPG`, "studio-3.webp", 1400, 74],
  [`${DSC}/DSC_0715.JPG`, "studio-4.webp", 1400, 74],
  [`${DSC}/DSC_0735.JPG`, "pedicure.webp", 1200, 76],
  [`${DSC}/DSC_0733.JPG`, "pedicure-2.webp", 1000, 74],
  [`${DSC}/DSC_0748.JPG`, "manicure.webp", 1200, 76],
  [`${DSC}/DSC_0720.JPG`, "modellage.webp", 1200, 76],
  [`${DSC}/DSC_0743.JPG`, "products.webp", 1400, 76],
  [`${DSC}/DSC_0745.JPG`, "orchid.webp", 1000, 76],
  [`${DSC}/DSC_0751.JPG`, "hygiene.webp", 1400, 76],
  [`${DSC}/DSC_0742.JPG`, "products-2.webp", 1000, 74],
  // Gutschein
  [`${WORK}/Gutschein/Gold-210x75/Gutschein_Gold_VORNE_210x75_600dpi.jpg`, "gutschein-vorne.webp", 1600, 82],
  [`${WORK}/Gutschein/Gold-210x75/Gutschein_Gold_HINTEN_210x75_600dpi.jpg`, "gutschein-hinten.webp", 1600, 82],
  // Ảnh thật móng khách (WhatsApp 25-26/10) — cắt dải xám
  [`${WORK}/WhatsApp Image 2026-10-25 at 12.48.27.jpeg`, "real-01.webp", 1100, 78],
  [`${WORK}/WhatsApp Image 2026-10-25 at 12.48.28 (1).jpeg`, "real-02.webp", 1100, 78],
  [`${WORK}/WhatsApp Image 2026-10-25 at 12.48.28 (3).jpeg`, "real-03.webp", 1100, 78],
  [`${WORK}/WhatsApp Image 2026-10-25 at 12.48.28 (4).jpeg`, "real-04.webp", 1100, 78],
  [`${WORK}/WhatsApp Image 2026-10-25 at 12.48.28 (5).jpeg`, "real-05.webp", 1100, 78],
  [`${WORK}/WhatsApp Image 2026-10-25 at 12.48.28 (6).jpeg`, "real-06.webp", 1100, 78],
  [`${WORK}/WhatsApp Image 2026-10-25 at 12.48.28 (7).jpeg`, "real-07.webp", 1100, 78, { l: 0, t: 0.16, w: 1, h: 0.67 }],
  [`${WORK}/WhatsApp Image 2026-10-25 at 12.48.28.jpeg`, "real-08.webp", 1100, 78],
  [`${WORK}/WhatsApp Image 2026-10-25 at 12.48.29.jpeg`, "real-09.webp", 1100, 78, { l: 0, t: 0.17, w: 1, h: 0.65 }],
  [`${WORK}/New folder/WhatsApp Image 2026-10-26 at 21.18.43.jpeg`, "real-10.webp", 1100, 78],
  // Ảnh minh hoạ AI (6 kiểu) — cắt vệt chữ góc trên
  ...[1, 2, 3, 4, 5, 6].map((n) => [`${TPL}/gallery-${n}.jpg`, `design-${n}.webp`, 900, 80, { l: 0, t: 0.1, w: 1, h: 0.9 }]),
];

fs.mkdirSync(OUT, { recursive: true });
for (const [src, name, max, q, crop] of JOBS) {
  let img = sharp(src, { failOn: "none" }).rotate();
  if (crop) {
    const m = await sharp(src).rotate().metadata();
    img = sharp(await sharp(src).rotate().extract({
      left: Math.round(crop.l * m.width), top: Math.round(crop.t * m.height),
      width: Math.round(crop.w * m.width), height: Math.round(crop.h * m.height),
    }).toBuffer());
  }
  await img.resize({ width: max, height: max, fit: "inside", withoutEnlargement: true }).webp({ quality: q }).toFile(path.join(OUT, name));
}

// 6 móng: xoay đứng thẳng (file gốc nghiêng ~28,7 độ), cắt sát, WebP trong suốt
for (let n = 1; n <= 6; n++) {
  const buf = await sharp(`${TPL}/nail-${n}.png`).rotate(28.7, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).trim().toBuffer();
  await sharp(buf).resize({ height: 480, withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 95 }).toFile(`${OUT}/nail-${n}.webp`);
}

// favicon + OG
fs.mkdirSync("src/app", { recursive: true });
await sharp(`${TPL}/logo.png`).resize(256, 256).png().toFile("src/app/icon.png");
await sharp(`${TPL}/logo.png`).resize(180, 180).png().toFile("src/app/apple-icon.png");
await sharp(`${TPL}/logo.png`).resize(560, 560).extend({ top: 35, bottom: 35, left: 320, right: 320, background: "#1C0D0C" }).jpeg({ quality: 86 }).toFile("public/og.jpg");
console.log("Bilder fertig:", fs.readdirSync(OUT).length, "Dateien");
