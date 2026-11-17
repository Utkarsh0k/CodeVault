import { useEffect, useState } from 'react';
import { getLanguageLabel, LANGUAGES, DIFFICULTIES } from '../../utils/constants.js';

function Field({ label, children }) {
  return (
    <div className="field">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : '—');

// Phase 9: Metadata panel with view mode and inline edit form.
// Props: snippet, categories, onUpdateMetadata(data)
export default function MetadataPanel({
  snippet,
  categories = [],
  onUpdateMetadata,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Controlled form state
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [difficulty, setDifficulty] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [description, setDescription] = useState('');

  // When selected snippet changes, reset to view mode and sync field values
  useEffect(() => {
    setIsEditing(false);
    setError('');
    if (snippet) {
      setTitle(snippet.title || '');
      setCategoryId(snippet.categoryId || '');
      setLanguage(snippet.language || 'javascript');
      setDifficulty(snippet.difficulty || '');
      setTimeComplexity(snippet.timeComplexity || '');
      setTagsString(snippet.tags ? snippet.tags.join(', ') : '');
      setDescription(snippet.description || '');
    }
  }, [snippet?._id]);

  const handleStartEdit = () => {
    if (!snippet) return;
    setTitle(snippet.title || '');
    setCategoryId(snippet.categoryId || '');
    setLanguage(snippet.language || 'javascript');
    setDifficulty(snippet.difficulty || '');
    setTimeComplexity(snippet.timeComplexity || '');
    setTagsString(snippet.tags ? snippet.tags.join(', ') : '');
    setDescription(snippet.description || '');
    setError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return setError('Title is required');
    }
    if (trimmedTitle.length > 100) {
      return setError('Title must be at most 100 characters');
    }

    const tagsArray = tagsString
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    setSaving(true);
    setError('');

    try {
      await onUpdateMetadata({
        title: trimmedTitle,
        categoryId,
        language,
        difficulty,
        timeComplexity: timeComplexity.trim(),
        tags: tagsArray,
        description: description.trim(),
      });
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!snippet) {
    return (
      <aside className="meta-panel">
        <h2 className="panel-title">Details</h2>
        <p className="muted pad">Select a snippet to see its details.</p>
      </aside>
    );
  }

  const currentCategoryName =
    categories.find((c) => c._id === snippet.categoryId)?.name || 'Unknown';

  return (
    <aside className="meta-panel">
      <div className="panel-header">
        <h2 className="panel-title">Details</h2>
        {!isEditing && (
          <button
            className="btn btn-sm"
            onClick={handleStartEdit}
            title="Edit snippet metadata"
          >
            ✎ Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form className="pad" onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label" htmlFor="meta-title">
              Title
            </label>
            <input
              id="meta-title"
              className="text-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="meta-category">
              Category
            </label>
            <select
              id="meta-category"
              className="select-input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="meta-language">
              Language
            </label>
            <select
              id="meta-language"
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
            <label className="form-label" htmlFor="meta-difficulty">
              Difficulty
            </label>
            <select
              id="meta-difficulty"
              className="select-input"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">— None —</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="meta-time">
              Time Complexity
            </label>
            <input
              id="meta-time"
              className="text-input"
              value={timeComplexity}
              onChange={(e) => setTimeComplexity(e.target.value)}
              placeholder="e.g. O(log n)"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="meta-tags">
              Tags <span className="muted">(comma-separated)</span>
            </label>
            <input
              id="meta-tags"
              className="text-input"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="dsa, binary-search, array"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="meta-desc">
              Description
            </label>
            <textarea
              id="meta-desc"
              className="text-input meta-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short explanation or notes"
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="modal-actions" style={{ marginTop: '12px', marginBottom: '16px' }}>
            <button
              type="button"
              className="btn"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Details'}
            </button>
          </div>
        </form>
      ) : (
        <dl className="pad">
          <Field label="Title">{snippet.title}</Field>
          <Field label="Category">{currentCategoryName}</Field>
          <Field label="Description">{snippet.description || '—'}</Field>
          <Field label="Language">{getLanguageLabel(snippet.language)}</Field>
          <Field label="Difficulty">{snippet.difficulty || '—'}</Field>
          <Field label="Time Complexity">{snippet.timeComplexity || '—'}</Field>
          <Field label="Tags">
            {!snippet.tags || snippet.tags.length === 0
              ? '—'
              : snippet.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
          </Field>
          <Field label="Created">{formatDate(snippet.createdAt)}</Field>
          <Field label="Updated">{formatDate(snippet.updatedAt)}</Field>
        </dl>
      )}
    </aside>
  );
}
