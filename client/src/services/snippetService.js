import { request } from './api.js';

// filters example: { categoryId: '...', favorite: 'true', q: '...', language: '...', difficulty: '...' }
// Empty values are skipped, so only real filters reach the URL.
export function getSnippets(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, value);
    }
  });
  const query = params.toString();
  return request(`/snippets${query ? `?${query}` : ''}`);
}

// GET /api/snippets/:id → the full snippet (with code and gNotes)
export const getSnippet = (id) => request(`/snippets/${id}`);

// POST /api/snippets
export const createSnippet = (data) =>
  request('/snippets', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// PUT /api/snippets/:id
export const updateSnippet = (id, data) =>
  request(`/snippets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// PATCH /api/snippets/:id/favorite → toggles favorite status { _id, favorite }
export const toggleFavorite = (id) =>
  request(`/snippets/${id}/favorite`, {
    method: 'PATCH',
  });

// DELETE /api/snippets/:id
export const deleteSnippet = (id) =>
  request(`/snippets/${id}`, {
    method: 'DELETE',
  });

// ---------- GNOTES (embedded in snippet) ----------

// POST /api/snippets/:id/gnotes
export const addGNote = (snippetId, noteData) =>
  request(`/snippets/${snippetId}/gnotes`, {
    method: 'POST',
    body: JSON.stringify(noteData),
  });

// PATCH /api/snippets/:id/gnotes/:noteId
export const updateGNote = (snippetId, noteId, updates) =>
  request(`/snippets/${snippetId}/gnotes/${noteId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });

// DELETE /api/snippets/:id/gnotes/:noteId
export const deleteGNote = (snippetId, noteId) =>
  request(`/snippets/${snippetId}/gnotes/${noteId}`, {
    method: 'DELETE',
  });
