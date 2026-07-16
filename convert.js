import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
  'memories 1.jpeg',
  'memories 2.jpeg',
  'memories 3.jpeg',
  'memories 4.jpeg',
  'memories 5.jpeg'
];

const dir = path.join(process.cwd(), 'public', 'images');

(async () => {
  for (const img of images) {
    const inputPath = path.join(dir, img);
    const outputName = img.replace('.jpeg', '.webp').replace(/ /g, '_');
    const outputPath = path.join(dir, outputName);
    
    if (fs.existsSync(inputPath)) {
      console.log(`Converting ${img} to ${outputName}...`);
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Successfully created ${outputName}`);
    } else {
      console.error(`File not found: ${inputPath}`);
    }
  }
})();
