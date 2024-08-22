const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to convert a single image to AVIF
async function convertToAvif(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .avif({ quality: 50 }) // Adjust quality as needed (0-100)
      .toFile(outputPath);
    console.log(`Converted: ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
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

  await processDirectory('src/data_files/images', 'src/images');
  await processDirectory('src/data_files/images/blogs', 'src/images/blogs');

  console.log('Conversion complete!');
}

main().catch(console.error);