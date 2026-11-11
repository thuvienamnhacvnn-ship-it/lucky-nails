// Nén ảnh DSC-nhe-chinh -> public/img/pg-*.webp (trang con). Chạy: node scripts/pg-images.mjs
import sharp from "sharp";
const SRC = "D:/Work/Lucky Nail/DSC-nhe-chinh/DSC_";
const OUT = "D:/Projects/lucky-nails/public/img/pg-";
// [name, dsc, width, extract {left,top,width,height} as fractions or null]
const L = [
  ["studio-hero", "0761", 1200],
  ["studio-wide", "0716", 1800],
  ["pedi-wide", "0735", 1500],
  ["pedi-portrait", "0733", 1000],
  ["regal-portrait", "0742", 1000],
  ["produkte-wide", "0743", 1500],
  ["team-wide", "0725", 1500],
  ["hygiene-wide", "0751", 1500],
  ["modellage-wide", "0719", 1500],
  ["manicure-wide", "0754", 1500],
  ["lounge-portrait", "0717", 1000],
  ["lamps-portrait", "0709", 1000],
  ["orchid-portrait", "0745", 1000],
  ["marble-portrait", "0762", 1000],
  ["counter-portrait", "0727", 1000],
  ["scissors-wide", "0753", 1500],
  ["work-portrait", "0756", 1000],
  ["row-portrait", "0711", 1000],
  ["regal2-portrait", "0744", 1000],
];
for (const [n, d, w] of L) {
  const i = await sharp(`${SRC}${d}.JPG`).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${OUT}${n}.webp`);
  console.log(n, i.width, i.height, Math.round(i.size / 1024) + "KB");
}
