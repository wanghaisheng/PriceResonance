const fs = require('fs');
const path = require('path');

// Define the source and destination directories
const sourceDir = path.join(__dirname, 'html');
const destDir = path.join(__dirname, '.vercel/output/static');

// Function to copy files from source to destination
function copyFiles(source, destination) {
  fs.readdir(source, (err, files) => {
    if (err) {
      console.error('Error reading source directory:', err);
      return;
    }
    
    files.forEach(file => {
      const srcFile = path.join(source, file);
      const destFile = path.join(destination, file);
      
      fs.stat(srcFile, (err, stats) => {
        if (err) {
          console.error('Error stating file:', err);
          return;
        }
        
        if (stats.isFile()) {
          // Copy file
          fs.copyFile(srcFile, destFile, (err) => {
            if (err) {
              console.error('Error copying file:', err);
            } else {
              console.log(`File copied: ${srcFile} -> ${destFile}`);
            }
          });
        } else if (stats.isDirectory()) {
          // Recursively copy directory
          fs.mkdir(destFile, { recursive: true }, (err) => {
            if (err) {
              console.error('Error creating directory:', err);
              return;
            }
            copyFiles(srcFile, destFile);
          });
        }
      });
    });
  });
}

// Ensure the destination directory exists
fs.mkdir(destDir, { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating destination directory:', err);
    return;
  }
  
  // Start copying files
  copyFiles(sourceDir, destDir);
});
