import { useEffect, useState } from 'react';
import { getHealth } from './services/api.js';

// Temporary page that checks the frontend ↔ backend connection.
// It will be replaced by the real Workspace in Phase 5.
export default function App() {
  const [status, setStatus] = useState('Checking server...');

  useEffect(() => {
    getHealth()
      .then((data) => setStatus(`Server says: ${data.status} (${data.app})`))
      .catch((error) => setStatus(`Cannot reach server: ${error.message}`));
  }, []);

  return (
    <div className="setup-screen">
      <h1>CodeVault</h1>
      <p>{status}</p>
    </div>
  );
}