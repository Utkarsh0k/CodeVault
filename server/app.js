import express from 'express';
import cors from 'cors';

const app = express();

// Middleware: functions that run on every request before the routes.
app.use(cors());
app.use(express.json()); // parses JSON request bodies into req.body

// Temporary route to verify the setup. Routers will be added in Phase 3.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'CodeVault' });
});

export default app;