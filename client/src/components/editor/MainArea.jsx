import EmptyState from '../common/EmptyState.jsx';
import CodeEditor from './CodeEditor.jsx';
import { getLanguageLabel, getMonacoLanguage } from '../../utils/constants.js';

// Phase 11: Main area with interactive Favorite toggle button, Monaco Editor, and actions.
export default function MainArea({
  snippet,
  codeDraft,
  onCodeChange,
  isDirty,
  onSave,
  saving,
  onDelete,
  onToggleFavorite,
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
        
        <button
          type="button"
          className={`favorite-btn ${snippet.favorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(snippet._id)}
          title={snippet.favorite ? 'Remove from favorites' : 'Mark as favorite'}
          aria-label={snippet.favorite ? 'Remove from favorites' : 'Mark as favorite'}
        >
          {snippet.favorite ? '★' : '☆'}
        </button>

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
