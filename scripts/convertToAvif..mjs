import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let successCount = 0;
let errorCount = 0;
let skippedCount = 0;

async function convertToAvif(inputPath, outputPath) {
  try {
    if (fs.existsSync(outputPath)) {
      const inputStat = fs.statSync(inputPath);
      const outputStat = fs.statSync(outputPath);
      if (outputStat.mtime > inputStat.mtime) {
        console.log(`Skipping: ${inputPath} (already up to date)`);
        skippedCount++;
        return;
      }
    }

    await sharp(inputPath)
      .avif({ quality: 50 })
      .toFile(outputPath);
    console.log(`Converted: ${inputPath} -> ${outputPath}`);
    successCount++;
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
    errorCount++;
  }
}

async function processDirectory(inputDir, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      await processDirectory(inputPath, path.join(outputDir, file));
    } else if (stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(file)) {
      const outputPath = path.join(outputDir, `${path.parse(file).name}.avif`);
      await convertToAvif(inputPath, outputPath);
    }
  }
}

async function main() {
  const startTime = Date.now();

  const projectRoot = process.cwd();
  await processDirectory(path.join(projectRoot, 'src', 'data_files', 'images'), path.join(projectRoot, 'src', 'images'));
  await processDirectory(path.join(projectRoot, 'src', 'data_files', 'images', 'blogs'), path.join(projectRoot, 'src', 'images', 'blogs'));

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  console.log('Conversion complete!');
  console.log(`Successfully converted: ${successCount} images`);
  console.log(`Skipped (already up to date): ${skippedCount} images`);
  console.log(`Failed conversions: ${errorCount} images`);
  console.log(`Total time: ${duration.toFixed(2)} seconds`);
}

main().catch(error => {
  console.error('An error occurred during the conversion process:', error);
  process.exit(1);
});