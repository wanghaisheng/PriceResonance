import { promises as fs } from 'fs';
import path from 'path';

// Define the source and destination directories
const sourceDir = path.join(process.cwd(), 'html');
const destDir = path.join(process.cwd(), '.vercel/output/static');

// Function to copy files from source to destination
async function copyFiles(source, destination) {
  try {
    const files = await fs.readdir(source);

    for (const file of files) {
      const srcFile = path.join(source, file);
      const destFile = path.join(destination, file);
      const stats = await fs.stat(srcFile);

      if (stats.isFile()) {
        // Copy file
        await fs.copyFile(srcFile, destFile);
        console.log(`File copied: ${srcFile} -> ${destFile}`);
      } else if (stats.isDirectory()) {
        // Recursively copy directory
        await fs.mkdir(destFile, { recursive: true });
        await copyFiles(srcFile, destFile);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Ensure the destination directory exists
async function setup() {
  try {
    await fs.mkdir(destDir, { recursive: true });
    // Start copying files
    await copyFiles(sourceDir, destDir);
  } catch (err) {
    console.error('Error creating destination directory:', err);
  }
}

setup();
