import EmptyState from '../common/EmptyState.jsx';
import CodeEditor from './CodeEditor.jsx';
import { getLanguageLabel, getMonacoLanguage } from '../../utils/constants.js';

// Phase 8: Main area with Monaco Editor integration.
// Supports syntax highlighting, VS Code dark theme, and Ctrl+S saving.
export default function MainArea({
  snippet,
  codeDraft,
  onCodeChange,
  isDirty,
  onSave,
  saving,
  onDelete,
}) {
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

  const monacoLanguage = getMonacoLanguage(snippet.language);

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

      <div className="editor-container">
        <CodeEditor
          code={codeDraft}
          language={monacoLanguage}
          onChange={onCodeChange}
          onSave={isDirty && !saving ? onSave : undefined}
        />
      </div>
    </main>
  );
}
