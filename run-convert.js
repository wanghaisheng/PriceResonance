const path = require('path');
const { spawn } = require('child_process');

const scriptPath = path.join(__dirname, 'scripts', 'convertToAvif.js');

const child = spawn('node', [scriptPath], { stdio: 'inherit' });

child.on('exit', (code) => {
  process.exit(code);
});