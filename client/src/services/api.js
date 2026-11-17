// Single place where the frontend talks to the backend.
// Every service file (categoryService, snippetService...) will use request().

const BASE_URL = '/api';

export async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  // Some responses have no body, so don't crash if JSON parsing fails.
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Our backend will always send { message: "..." } on errors.
    throw new Error(data?.message || 'Something went wrong. Please try again.');
  }

  return data;
}

export const getHealth = () => request('/health');