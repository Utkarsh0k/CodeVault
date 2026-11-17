import crypto from 'crypto';
import mongoose from 'mongoose';
import Snippet from '../models/Snippet.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// Fields a client is allowed to set on a snippet. Anything else in the body
// (like _id or gNotes) is ignored, so a request can't overwrite them by accident.
const EDITABLE_FIELDS = [
  'categoryId', 'title', 'language', 'code', 'tags',
  'description', 'difficulty', 'timeComplexity', 'favorite',
];

function pickEditableFields(body) {
  const picked = {};
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) picked[field] = body[field];
  }
  return picked;
}

// Turns "a(b)" into "a\(b\)" so user input can't break the regex.
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Checks a categoryId exists. Returns an error message, or null if fine.
async function checkCategory(categoryId) {
  if (!mongoose.isValidObjectId(categoryId)) return 'Invalid category ID';
  const exists = await Category.exists({ _id: categoryId });
  return exists ? null : 'Category not found';
}

// ---------- SNIPPETS ----------

// GET /api/snippets?q=&categoryId=&language=&difficulty=&favorite=true
export const getSnippets = asyncHandler(async (req, res) => {
  const { q, categoryId, language, difficulty, favorite } = req.query;
  const filter = {};

  if (categoryId) {
    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    filter.categoryId = categoryId;
  }
  if (language) filter.language = String(language);
  if (difficulty) filter.difficulty = String(difficulty);
  if (favorite === 'true') filter.favorite = true;

  if (q && String(q).trim()) {
    const pattern = new RegExp(escapeRegex(String(q).trim()), 'i'); // 'i' = ignore case
    filter.$or = [
      { title: pattern },
      { description: pattern },
      { tags: pattern },
      { language: pattern },
    ];
  }

  const snippets = await Snippet.find(filter)
    .select('-code -gNotes') // light list: no code, no notes
    .sort({ updatedAt: -1 });

  res.json(snippets);
});

// GET /api/snippets/:id
export const getSnippetById = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);
  if (!snippet) return res.status(404).json({ message: 'Snippet not found' });
  res.json(snippet);
});

// POST /api/snippets
export const createSnippet = asyncHandler(async (req, res) => {
  const data = pickEditableFields(req.body);

  const categoryError = await checkCategory(data.categoryId);
  if (categoryError) return res.status(400).json({ message: categoryError });

  const snippet = await Snippet.create(data);
  res.status(201).json(snippet);
});

// PUT /api/snippets/:id
export const updateSnippet = asyncHandler(async (req, res) => {
  const data = pickEditableFields(req.body);

  if (data.categoryId !== undefined) {
    const categoryError = await checkCategory(data.categoryId);
    if (categoryError) return res.status(400).json({ message: categoryError });
  }

  const snippet = await Snippet.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!snippet) return res.status(404).json({ message: 'Snippet not found' });
  res.json(snippet);
});

// PATCH /api/snippets/:id/favorite   (flips true <-> false)
export const toggleFavorite = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);
  if (!snippet) return res.status(404).json({ message: 'Snippet not found' });

  snippet.favorite = !snippet.favorite;
  await snippet.save();
  res.json({ _id: snippet._id, favorite: snippet.favorite });
});

// DELETE /api/snippets/:id
export const deleteSnippet = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findByIdAndDelete(req.params.id);
  if (!snippet) return res.status(404).json({ message: 'Snippet not found' });
  res.json({ message: 'Snippet deleted', id: snippet._id });
});

// ---------- GNOTES (embedded in the snippet) ----------

// POST /api/snippets/:id/gnotes   body: { text, x, y, width? }
export const addGNote = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);
  if (!snippet) return res.status(404).json({ message: 'Snippet not found' });

  const { text, x, y, width } = req.body;
  if (typeof x !== 'number' || typeof y !== 'number') {
    return res.status(400).json({ message: 'Note x and y must be numbers' });
  }

  const note = { id: crypto.randomUUID(), text, x, y };
  if (width !== undefined) note.width = width;

  snippet.gNotes.push(note);
  await snippet.save(); // schema validation (empty text, etc.) runs here

  res.status(201).json(snippet.gNotes[snippet.gNotes.length - 1]);
});

// PATCH /api/snippets/:id/gnotes/:noteId   body: any of { text, x, y, width }
export const updateGNote = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);
  if (!snippet) return res.status(404).json({ message: 'Snippet not found' });

  const note = snippet.gNotes.find((n) => n.id === req.params.noteId);
  if (!note) return res.status(404).json({ message: 'Note not found' });

  for (const field of ['text', 'x', 'y', 'width']) {
    if (req.body[field] === undefined) continue;
    if (field !== 'text' && typeof req.body[field] !== 'number') {
      return res.status(400).json({ message: `Note ${field} must be a number` });
    }
    note[field] = req.body[field];
  }

  await snippet.save();
  res.json(note);
});

// DELETE /api/snippets/:id/gnotes/:noteId
export const deleteGNote = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);
  if (!snippet) return res.status(404).json({ message: 'Snippet not found' });

  const index = snippet.gNotes.findIndex((n) => n.id === req.params.noteId);
  if (index === -1) return res.status(404).json({ message: 'Note not found' });

  snippet.gNotes.splice(index, 1);
  await snippet.save();
  res.json({ message: 'Note deleted', id: req.params.noteId });
});