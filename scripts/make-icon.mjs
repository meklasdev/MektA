import fs from "node:fs/promises";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const svg = await fs.readFile(new URL("../mekta-logo.svg", import.meta.url));
const pngs = await Promise.all([16, 32, 48, 64, 128, 256].map((size) => sharp(svg).resize(size, size).png().toBuffer()));
const ico = await pngToIco(pngs);
await fs.writeFile(new URL("../build/icon.ico", import.meta.url), ico);
console.log("Generated build/icon.ico");
