import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', validateObjectId, updateCategory);
router.delete('/:id', validateObjectId, deleteCategory);

export default router;