import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Middleware: functions that run on every request before the routes.
app.use(cors());
app.use(express.json()); // parses JSON request bodies into req.body

// Health check. readyState 1 means "connected" in Mongoose.
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    app: 'CodeVault',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

export default app;