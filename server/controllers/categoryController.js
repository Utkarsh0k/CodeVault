import Category from '../models/Category.js';
import Snippet from '../models/Snippet.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// GET /api/categories
// Each category also gets snippetCount, so the sidebar can show "DSA (7)".
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()
    .collation({ locale: 'en' }) // alphabetical order ignoring case
    .sort({ name: 1 })
    .lean(); // plain objects, so we can add a field

  // One query counts snippets for all categories at once.
  const counts = await Snippet.aggregate([
    { $group: { _id: '$categoryId', count: { $sum: 1 } } },
  ]);
  const countById = new Map(counts.map((c) => [String(c._id), c.count]));

  const result = categories.map((category) => ({
    ...category,
    snippetCount: countById.get(String(category._id)) || 0,
  }));

  res.json(result);
});

// POST /api/categories   body: { name }
export const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const category = await Category.create({ name });
  res.status(201).json({ ...category.toObject(), snippetCount: 0 });
});

// PUT /api/categories/:id   body: { name }
export const updateCategory = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true, runValidators: true } // return the updated document; apply schema rules
  );

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json(category);
});

// DELETE /api/categories/:id
// Also deletes every snippet in the category (the UI asks for confirmation first).
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const result = await Snippet.deleteMany({ categoryId: category._id });
  res.json({
    message: 'Category deleted',
    id: category._id,
    deletedSnippets: result.deletedCount,
  });
});
