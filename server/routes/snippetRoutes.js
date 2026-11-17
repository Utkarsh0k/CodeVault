import { Router } from 'express';
import {
  getSnippets,
  getSnippetById,
  createSnippet,
  updateSnippet,
  toggleFavorite,
  deleteSnippet,
  addGNote,
  updateGNote,
  deleteGNote,
} from '../controllers/snippetController.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = Router();

router.get('/', getSnippets);
router.post('/', createSnippet);
router.get('/:id', validateObjectId, getSnippetById);
router.put('/:id', validateObjectId, updateSnippet);
router.patch('/:id/favorite', validateObjectId, toggleFavorite);
router.delete('/:id', validateObjectId, deleteSnippet);

// GNotes
router.post('/:id/gnotes', validateObjectId, addGNote);
router.patch('/:id/gnotes/:noteId', validateObjectId, updateGNote);
router.delete('/:id/gnotes/:noteId', validateObjectId, deleteGNote);

export default router;