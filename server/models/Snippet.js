import mongoose from 'mongoose';
import { LANGUAGES, DIFFICULTIES, DEFAULT_GNOTE_WIDTH } from '../utils/constants.js';

// A GNote is embedded inside a snippet, so it has a schema but no model.
// _id: false because we use our own string "id" (generated in the controller).
const gNoteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: {
      type: String,
      required: [true, 'Note text is required'],
      trim: true,
      maxlength: [500, 'Note text must be at most 500 characters'],
    },
    x: { type: Number, required: [true, 'Note x position is required'] },
    y: { type: Number, required: [true, 'Note y position is required'] },
    width: { type: Number, default: DEFAULT_GNOTE_WIDTH, min: [80, 'Note width must be at least 80'] },
  },
  { _id: false, timestamps: true } // timestamps gives each note createdAt/updatedAt
);

const snippetSchema = new mongoose.Schema(
  {
    // Stores the category's _id. This is how a snippet "belongs to" a category.
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title must be at most 100 characters'],
    },
    language: {
      type: String,
      enum: { values: LANGUAGES, message: 'Language "{VALUE}" is not supported' },
      default: 'javascript',
    },
    code: { type: String, default: '' }, // empty code is allowed
    tags: [{ type: String, trim: true, lowercase: true }],
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description must be at most 500 characters'],
    },
    difficulty: {
      type: String,
      enum: { values: [...DIFFICULTIES, ''], message: 'Difficulty must be Easy, Medium or Hard' },
      default: '', // empty means "not set"
    },
    timeComplexity: { type: String, default: '', trim: true, maxlength: 50 },
    favorite: { type: Boolean, default: false },
    gNotes: [gNoteSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Snippet', snippetSchema);