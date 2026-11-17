import { useCallback, useEffect, useState } from 'react';
import * as snippetService from '../services/snippetService.js';

// Manages the snippet list based on the active filters.
// Provides CRUD operations that keep the list synchronized.
export default function useSnippets(filters, onError) {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stringify filter object so the hook only re-fetches when query values actually change
  const filterKey = JSON.stringify(filters);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await snippetService.getSnippets(JSON.parse(filterKey));
      setSnippets(data);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterKey, onError]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addSnippet = async (data) => {
    const created = await snippetService.createSnippet(data);
    await refresh();
    return created;
  };

  const editSnippet = async (id, data) => {
    const updated = await snippetService.updateSnippet(id, data);
    await refresh();
    return updated;
  };

  const removeSnippet = async (id) => {
    const result = await snippetService.deleteSnippet(id);
    await refresh();
    return result;
  };

  return {
    snippets,
    loading,
    refresh,
    addSnippet,
    editSnippet,
    removeSnippet,
  };
}
