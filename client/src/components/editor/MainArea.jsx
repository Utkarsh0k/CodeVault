import { useRef, useState } from 'react';
import EmptyState from '../common/EmptyState.jsx';
import CodeEditor from './CodeEditor.jsx';
import GNotesOverlay from './GNotesOverlay.jsx';
import { getLanguageLabel, getMonacoLanguage } from '../../utils/constants.js';

function getDifficultyClass(difficulty) {
  if (!difficulty) return '';
  const d = difficulty.toLowerCase();
  if (d === 'easy') return 'badge-diff-easy';
  if (d === 'medium') return 'badge-diff-medium';
  if (d === 'hard') return 'badge-diff-hard';
  return '';
}

// Phase 14: Main area with refined header, badges, and controls.
export default function MainArea({
  snippet,
  codeDraft,
  onCodeChange,
  isDirty,
  onSave,
  saving,
  onDelete,
  onToggleFavorite,
  onAddGNote,
  onUpdateGNote,
  onDeleteGNote,
}) {
  const [gNotesVisible, setGNotesVisible] = useState(true);
  const containerRef = useRef(null);

  if (!snippet) {
    return (
      <main className="main-area">
        <EmptyState
          icon="⟨/⟩"
          title="No snippet selected"
          message="Pick a snippet from the list to view it, or create a new one."
        />
      </main>
    );
  }

  const monacoLanguage = getMonacoLanguage(snippet.language);
  const notesCount = snippet.gNotes?.length || 0;
  const diffClass = getDifficultyClass(snippet.difficulty);

  return (
    <main className="main-area">
      <div className="main-header">
        <div className="main-header-left">
          <h1 className="snippet-title" title={snippet.title}>
            {snippet.title}
          </h1>

          <span className="badge badge-lang">{getLanguageLabel(snippet.language)}</span>

          {snippet.difficulty && (
            <span className={`badge-diff ${diffClass}`}>{snippet.difficulty}</span>
          )}

          <button
            type="button"
            className={`favorite-btn ${snippet.favorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(snippet._id)}
            title={snippet.favorite ? 'Remove from favorites' : 'Mark as favorite'}
            aria-label={snippet.favorite ? 'Remove from favorites' : 'Mark as favorite'}
          >
            {snippet.favorite ? '★' : '☆'}
          </button>
        </div>

        <div className="main-header-actions">
          {isDirty && (
            <span className="muted small unsaved-indicator" title="Unsaved changes">
              <span className="unsaved-dot" /> Unsaved
            </span>
          )}

          <button
            type="button"
            className="btn btn-sm"
            onClick={onAddGNote}
            title="Attach a new visual note over the code"
          >
            + Note
          </button>

          <button
            type="button"
            className={`btn btn-sm ${gNotesVisible ? 'btn-active-toggle' : ''}`}
            onClick={() => setGNotesVisible((v) => !v)}
            title="Toggle visual notes visibility"
          >
            Notes: {gNotesVisible ? `ON (${notesCount})` : 'OFF'}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onSave}
            disabled={!isDirty || saving}
            title="Save code changes (Ctrl+S)"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onDelete}
            title="Delete this snippet"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="editor-container" ref={containerRef}>
        <CodeEditor
          code={codeDraft}
          language={monacoLanguage}
          onChange={onCodeChange}
          onSave={isDirty && !saving ? onSave : undefined}
        />

        {gNotesVisible && (
          <GNotesOverlay
            gNotes={snippet.gNotes || []}
            containerRef={containerRef}
            onUpdateNote={onUpdateGNote}
            onDeleteNote={onDeleteGNote}
          />
        )}
      </div>
    </main>
  );
}
