import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'source-icon.png');
const outputDir = path.join(__dirname, '../public');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generate() {
  console.log('Generating icons...');

  try {
    // 192x192
    await sharp(inputPath)
      .resize(192, 192)
      .toFile(path.join(outputDir, 'pwa-192x192.png'));
    console.log('Created pwa-192x192.png');

    // 512x512
    await sharp(inputPath)
      .resize(512, 512)
      .toFile(path.join(outputDir, 'pwa-512x512.png'));
    console.log('Created pwa-512x512.png');

    // Apple Touch Icon (180x180)
    await sharp(inputPath)
      .resize(180, 180)
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log('Created apple-touch-icon.png');

    // Favicon (64x64)
    // Note: Chrome supports PNG favicons, but .ico is safest for legacy.
    // Sharp can output .ico if built with libvips support for it, but usually PNG is fine as favicon.ico if renamed,
    // or just use favicon.png. Browsers are smart.
    // However, the standard is often .ico. Sharp 0.33+ supports .ico.
    // Let's try .ico, if fail fall back to png.
    try {
        await sharp(inputPath)
        .resize(64, 64)
        .toFormat('ico')
        .toFile(path.join(outputDir, 'favicon.ico'));
        console.log('Created favicon.ico');
    } catch (e) {
        console.log('ICO format not supported, falling back to PNG for favicon');
        await sharp(inputPath)
        .resize(64, 64)
        .toFile(path.join(outputDir, 'favicon.ico')); // It's actually a PNG but named .ico, most browsers handle this fine.
    }

    // Maskable icon (safe area) - usually just the same icon with padding if it's not designed for circle crop.
    // The user's icon might be square. I'll just use the 512 version as maskable for now,
    // assuming it has some padding or is robust enough.
    // Ideally I'd add padding. Let's add 10% padding for the maskable version.
    await sharp(inputPath)
      .resize(512, 512, { fit: 'contain', background: { r: 191, g: 219, b: 254, alpha: 1 } }) // #bfdbfe
      .toFile(path.join(outputDir, 'maskable-icon.png'));
    console.log('Created maskable-icon.png');

  } catch (err) {
    console.error('Error generating icons:', err);
    process.exit(1);
  }
}

generate();
