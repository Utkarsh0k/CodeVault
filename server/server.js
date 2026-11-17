import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';
import app from './app.js';
import { connectDB } from './config/db.js';

// Load the .env that lives in the project root (one level above /server),
// no matter which folder the command was started from.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Optional workaround: some networks (college Wi-Fi, mobile hotspots) refuse
// the SRV DNS lookup that "mongodb+srv://" needs. If DNS_SERVERS is set in
// .env, Node uses those DNS servers instead of the system default.
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(',').map((s) => s.trim()));
}

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`CodeVault server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // Log a short message only, never the full URI (it contains your password).
    console.error('Failed to start server:', error.message);
    process.exit(1); // stop the process with an error code
  }
}

startServer();