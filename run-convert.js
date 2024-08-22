import { fileURLToPath } from 'url';
import path from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptPath = path.join(__dirname, 'scripts', 'convertToAvif.mjs');

const child = spawn('node', [scriptPath], { stdio: 'inherit' });

child.on('exit', (code) => {
  process.exit(code);
});