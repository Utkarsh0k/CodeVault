import { request } from './api.js';

// filters example: { categoryId: '...', favorite: 'true' }
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