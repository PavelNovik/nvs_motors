// Готовит все изображения сайта в public/:
// 1) scripts/images.json — фоны с Unsplash → public/images/<name>.webp и <name>-sm.webp;
// 2) raw/ig/*.jpg — кадры из Instagram @nvsmotorss (обложки рилсов 360×640) → public/images/work/<id>.webp:
//    чёрные поля сверху/снизу обрезаются (trim), кадр приводится к 3:4;
// 3) public/logo.svg → og-image.jpg (1200×630) и apple-touch-icon.png.
// Запуск: npm run images. Свои фото — просто положите WebP в public/images.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { gallery } from '../src/config.js'

const pub = path.resolve('public')
const out = path.join(pub, 'images')
fs.mkdirSync(path.join(out, 'work'), { recursive: true })

async function download(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

const list = JSON.parse(fs.readFileSync(path.resolve('scripts/images.json'), 'utf8'))
for (const [name, img] of Object.entries(list)) {
  const buf = await download(`${img.src}?w=${img.width}&q=90&fm=jpg${img.params ? `&${img.params}` : ''}`)
  const meta = await sharp(buf).metadata()
  const full = Math.min(img.width, meta.width)
  await sharp(buf).resize({ width: full }).webp({ quality: 76 }).toFile(path.join(out, `${name}.webp`))
  await sharp(buf).resize({ width: Math.round(full / 2) }).webp({ quality: 72 }).toFile(path.join(out, `${name}-sm.webp`))
  console.log(`  ${name}  ${meta.width}×${meta.height}`)
}

for (const g of gallery) {
  const src = path.resolve('raw/ig', `${g.file}.jpg`)
  const trimmed = await sharp(src).trim({ background: '#000000', threshold: 30 }).toBuffer()
  await sharp(trimmed)
    .resize(480, 640, { fit: 'cover', position: g.position ?? 'centre' })
    .modulate({ saturation: 1.08 })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 80 })
    .toFile(path.join(out, 'work', `${g.id}.webp`))
  console.log(`  work/${g.id}`)
}

// OG-картинка: фон + затемнение + логотип
const bg = await sharp(path.join(out, 'bg-desktop.webp')).resize(1200, 630, { fit: 'cover' }).toBuffer()
const shade = Buffer.from(
  '<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".92"/><stop offset=".6" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>'
)
const logo = await sharp(path.join(pub, 'logo.svg'), { density: 200 }).resize(640).png().toBuffer()
await sharp(bg)
  .composite([{ input: shade }, { input: logo, left: 70, top: 140 }])
  .jpeg({ quality: 84 })
  .toFile(path.join(pub, 'og-image.jpg'))
await sharp({ create: { width: 180, height: 180, channels: 3, background: '#0b0b0c' } })
  .composite([{ input: await sharp(path.join(pub, 'favicon.svg'), { density: 400 }).resize(140).png().toBuffer(), left: 20, top: 20 }])
  .png()
  .toFile(path.join(pub, 'apple-touch-icon.png'))
console.log('  og-image.jpg, apple-touch-icon.png')
