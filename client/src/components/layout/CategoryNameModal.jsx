import { useState } from 'react';
import Modal from '../common/Modal.jsx';

const MAX_LENGTH = 50; // same limit as the server's Category schema

// One form used for both "New category" and "Rename category".
// Props: title, initialName, submitLabel, onSubmit(name) (async), onClose.
// State owned: the typed name, an error message, and a "saving" flag.
export default function CategoryNameModal({
  title,
  initialName = '',
  submitLabel,
  onSubmit,
  onClose,
}) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    const trimmed = name.trim();

    if (!trimmed) return setError('Category name is required');
    if (trimmed.length > MAX_LENGTH) {
      return setError(`Category name must be at most ${MAX_LENGTH} characters`);
    }
    if (trimmed === initialName) return onClose(); // rename with no change

    setSaving(true);
    setError('');
    try {
      await onSubmit(trimmed); // parent closes the dialog on success
    } catch (err) {
      setError(err.message); // e.g. "That name already exists"
      setSaving(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <input
          className="text-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onFocus={(event) => event.target.select()}
          placeholder="Category name"
          aria-label="Category name"
          autoFocus
        />
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}