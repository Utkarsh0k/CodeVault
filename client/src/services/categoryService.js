import { request } from './api.js';

// GET /api/categories → [{ _id, name, snippetCount, ... }]
export const getCategories = () => request('/categories');

// POST /api/categories
export const createCategory = (name) =>
  request('/categories', { method: 'POST', body: JSON.stringify({ name }) });

// PUT /api/categories/:id
export const renameCategory = (id, name) =>
  request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify({ name }) });

// DELETE /api/categories/:id → { message, id, deletedSnippets }
export const deleteCategory = (id) =>
  request(`/categories/${id}`, { method: 'DELETE' });