// Single place where the frontend talks to the backend.
// Every service file (categoryService, snippetService...) uses request().

const BASE_URL = '/api';

export async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (netErr) {
    // Gracefully catch server downtime or offline network
    throw new Error(
      'Unable to connect to the CodeVault server. Please ensure the backend is running.'
    );
  }

  // Some responses have no body (like 204 or empty responses), don't crash if JSON parsing fails
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Our backend sends { message: "..." } on errors
    throw new Error(data?.message || `Server error (${response.status})`);
  }

  return data;
}

export const getHealth = () => request('/health');
