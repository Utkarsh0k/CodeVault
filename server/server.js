import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';

// Load the .env that lives in the project root (one level above /server),
// no matter which folder the command was started from.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CodeVault server running on http://localhost:${PORT}`);
});