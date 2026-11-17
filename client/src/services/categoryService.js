import { request } from './api.js';

// GET /api/categories → [{ _id, name, snippetCount, ... }]
export const getCategories = () => request('/categories');