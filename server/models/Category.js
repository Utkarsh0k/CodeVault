import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'], // also fails for "   " because of trim
      trim: true, // removes spaces at both ends before validating and saving
      maxlength: [50, 'Category name must be at most 50 characters'],
    },
  },
  { timestamps: true }
);

// Unique name, ignoring case ("dsa" and "DSA" count as the same).
// strength: 2 in the collation means case-insensitive comparison.
categorySchema.index(
  { name: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);

export default mongoose.model('Category', categorySchema);