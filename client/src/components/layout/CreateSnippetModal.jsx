import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { LANGUAGES } from '../../utils/constants.js';

// Modal dialog for creating a new snippet.
// Props: categories, defaultCategoryId, onClose, onSubmit(data).
export default function CreateSnippetModal({
  categories,
  defaultCategoryId,
  onClose,
  onSubmit,
}) {
  const initialCategory =
    categories.find((c) => c._id === defaultCategoryId)?._id ||
    categories[0]?._id ||
    '';

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(initialCategory);
  const [language, setLanguage] = useState('javascript');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return setError('Snippet title is required');
    }
    if (trimmedTitle.length > 100) {
      return setError('Title must be at most 100 characters');
    }
    if (!categoryId) {
      return setError('Please select a category (create one first if needed)');
    }

    setSaving(true);
    setError('');

    try {
      await onSubmit({
        title: trimmedTitle,
        categoryId,
        language,
        description: description.trim(),
        code: '',
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal title="Create New Snippet" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="snippet-title">
            Title
          </label>
          <input
            id="snippet-title"
            className="text-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Binary Search, JWT Middleware"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="snippet-category">
            Category
          </label>
          <select
            id="snippet-category"
            className="select-input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.length === 0 ? (
              <option value="">No categories available</option>
            ) : (
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="snippet-language">
            Language
          </label>
          <select
            id="snippet-language"
            className="select-input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="snippet-desc">
            Description <span className="muted">(optional)</span>
          </label>
          <input
            id="snippet-desc"
            className="text-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief explanation of this snippet"
          />
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || categories.length === 0}
          >
            {saving ? 'Creating...' : 'Create Snippet'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
