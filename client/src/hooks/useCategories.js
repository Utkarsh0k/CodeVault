import { useCallback, useEffect, useState } from 'react';
import * as categoryService from '../services/categoryService.js';

// Owns the categories list. Components get the list plus functions to change it.
// onError is called for load failures. Create/rename/delete throw instead, so
// the dialog that triggered them can show the message next to its form.
export default function useCategories(onError) {
  const [categories, setCategories] = useState([]);

  const refresh = useCallback(async () => {
    try {
      setCategories(await categoryService.getCategories());
    } catch (err) {
      onError(err.message);
    }
  }, [onError]);

  // Load once when the page first appears.
  useEffect(() => {
    refresh();
  }, [refresh]);

  // After every change we re-fetch, so snippet counts stay accurate.
  const addCategory = async (name) => {
    const created = await categoryService.createCategory(name);
    await refresh();
    return created;
  };

  const renameCategory = async (id, name) => {
    await categoryService.renameCategory(id, name);
    await refresh();
  };

  const removeCategory = async (id) => {
    const result = await categoryService.deleteCategory(id);
    await refresh();
    return result;
  };

  return { categories, refresh, addCategory, renameCategory, removeCategory };
}