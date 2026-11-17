import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import categoryRoutes from './routes/categoryRoutes.js';
import snippetRoutes from './routes/snippetRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check. readyState 1 means "connected" in Mongoose.
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    app: 'CodeVault',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

app.use('/api/categories', categoryRoutes);
app.use('/api/snippets', snippetRoutes);
// These two must stay LAST: they catch whatever no route handled.
app.use('/api', notFound);
app.use(errorHandler);

export default app;