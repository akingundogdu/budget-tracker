import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [192, 512];
const inputFile = path.join(__dirname, '../src/assets/logo.png');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate icons for each size
    for (const size of sizes) {
      await sharp(inputFile)
        .resize(size, size)
        .toFile(path.join(outputDir, `pwa-${size}x${size}.png`));
      
      console.log(`Generated ${size}x${size} icon`);
    }

    // Generate favicon.ico
    await sharp(inputFile)
      .resize(32, 32)
      .toFile(path.join(outputDir, 'favicon.ico'));
    
    // Generate apple-touch-icon
    await sharp(inputFile)
      .resize(180, 180)
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));

    console.log('PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 