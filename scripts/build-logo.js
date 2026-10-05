// Логотип и фавиконки из исходников клиента (raw/brand):
// - logo-source.webp — лого на тёмно-красном фоне: фон убирается заливкой от краёв (тёмные «красные» пиксели
//   → прозрачность с мягким краем, чтобы сохранить свечение), результат → public/logo.webp / logo-sm.webp / logo.png;
// - shield-source.png — щит на чёрном: чёрные углы вокруг щита → прозрачные, → favicon-*.png, apple-touch-icon.png.
// Запуск: node scripts/build-logo.js
import path from 'node:path'
import sharp from 'sharp'

const pub = path.resolve('public')

// Заливка от краёв по пикселям, для которых isBg() = true; alphaOf() задаёт прозрачность залитого пикселя
async function cutBackground(file, isBg, alphaOf) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const seen = new Uint8Array(w * h)
  const stack = []
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const p = y * w + x
    if (seen[p]) return
    const i = p * 4
    if (!isBg(data[i], data[i + 1], data[i + 2])) return
    seen[p] = 1
    stack.push(p)
  }
  for (let x = 0; x < w; x++) push(x, 0), push(x, h - 1)
  for (let y = 0; y < h; y++) push(0, y), push(w - 1, y)
  while (stack.length) {
    const p = stack.pop()
    const i = p * 4
    data[i + 3] = alphaOf(data[i], data[i + 1], data[i + 2])
    const x = p % w
    const y = (p - x) / w
    push(x + 1, y), push(x - 1, y), push(x, y + 1), push(x, y - 1)
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer()
}

const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)))

// Лого: фон — тёмно-красный (G и B почти 0). Самые тёмные пиксели — полностью прозрачные,
// более яркие красные (свечение, блики силуэта) — частично видимые.
const logo = await cutBackground(
  'raw/brand/logo-source.webp',
  (r, g, b) => g < 45 && b < 45 && r < 170,
  (r) => clamp(((r - 75) / 95) * 255)
)
const logoTrim = await sharp(logo).trim({ threshold: 1 }).toBuffer()
await sharp(logoTrim).resize({ width: 900 }).webp({ quality: 90, alphaQuality: 90 }).toFile(path.join(pub, 'logo.webp'))
await sharp(logoTrim).resize({ width: 360 }).webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(pub, 'logo-sm.webp'))
await sharp(logoTrim).resize({ width: 600 }).png({ compressionLevel: 9 }).toFile(path.join(pub, 'logo.png'))
const lm = await sharp(path.join(pub, 'logo.webp')).metadata()
console.log(`  logo.webp ${lm.width}×${lm.height}`)

// Щит: чёрные поля вокруг → прозрачные (внутренность щита отделена золотой рамкой и не заливается)
const shield = await cutBackground(
  'raw/brand/shield-source.png',
  (r, g, b) => r < 40 && g < 40 && b < 40,
  () => 0
)
const shieldTrim = await sharp(shield).trim({ threshold: 1 }).toBuffer()
const square = async (size, pad = 0) => {
  const inner = await sharp(shieldTrim).resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: inner, left: pad, top: pad }])
}
await (await square(32)).png().toFile(path.join(pub, 'favicon-32.png'))
await (await square(192, 4)).png().toFile(path.join(pub, 'favicon-192.png'))
await (await square(512, 8)).png().toFile(path.join(pub, 'favicon-512.png'))
// apple-touch-icon — iOS не любит прозрачность: щит на чёрном
const touch = await sharp(shieldTrim).resize(148, 148, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer()
await sharp({ create: { width: 180, height: 180, channels: 3, background: '#0b0b0c' } })
  .composite([{ input: touch, left: 16, top: 16 }])
  .png()
  .toFile(path.join(pub, 'apple-touch-icon.png'))
console.log('  favicon-32/192/512.png, apple-touch-icon.png')
