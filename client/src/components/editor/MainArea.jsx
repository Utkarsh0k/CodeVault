import { useEffect } from 'react';
import EmptyState from '../common/EmptyState.jsx';
import { getLanguageLabel } from '../../utils/constants.js';

// Phase 7: Editable code area with Save (and unsaved warning indicator) and Delete.
// Phase 8 replaces the <textarea> with Monaco Editor.
export default function MainArea({
  snippet,
  codeDraft,
  onCodeChange,
  isDirty,
  onSave,
  saving,
  onDelete,
}) {
  // Support Ctrl+S / Cmd+S shortcut to save changes quickly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isDirty && !saving) {
          onSave();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty, saving, onSave]);

  if (!snippet) {
    return (
      <main className="main-area">
        <EmptyState
          title="No snippet selected"
          message="Pick a snippet from the list to view it, or create a new one."
        />
      </main>
    );
  }

  return (
    <main className="main-area">
      <div className="main-header">
        <h1 className="snippet-title">{snippet.title}</h1>
        <span className="badge">{getLanguageLabel(snippet.language)}</span>
        {snippet.favorite && <span className="star" title="Favorite">★</span>}

        <div className="main-header-actions">
          {isDirty && (
            <span className="muted small" title="Unsaved changes">
              <span className="unsaved-dot" /> Unsaved
            </span>
          )}
          <button
            className="btn btn-primary btn-sm"
            onClick={onSave}
            disabled={!isDirty || saving}
            title="Save code changes (Ctrl+S)"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={onDelete}
            title="Delete this snippet"
          >
            Delete
          </button>
        </div>
      </div>

      <textarea
        className="code-editor-textarea"
        value={codeDraft}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="// Write or paste your code here..."
        spellCheck="false"
      />
    </main>
  );
}
