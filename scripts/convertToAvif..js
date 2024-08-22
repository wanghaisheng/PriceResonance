const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

let successCount = 0;
let errorCount = 0;
let skippedCount = 0;

// Function to convert a single image to AVIF
async function convertToAvif(inputPath, outputPath) {
  try {
    // Check if output file exists and is newer than input file
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
      .avif({ quality: 50 }) // Adjust quality as needed (0-100)
      .toFile(outputPath);
    console.log(`Converted: ${inputPath} -> ${outputPath}`);
    successCount++;
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
    errorCount++;
  }
}

// Function to process all images in a directory
async function processDirectory(inputDir, outputDir) {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      await processDirectory(inputPath, path.join(outputDir, file));
    } else if (stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(file)) {
      // Convert image files
      const outputPath = path.join(outputDir, `${path.parse(file).name}.avif`);
      await convertToAvif(inputPath, outputPath);
    }
  }
}

// Main function
async function main() {
  const startTime = Date.now();

  await processDirectory('src/data_files/images', 'src/images');
  await processDirectory('src/data_files/images/blogs', 'src/images/blogs');

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000; // Convert to seconds

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