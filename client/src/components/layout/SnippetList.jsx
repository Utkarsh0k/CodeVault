import EmptyState from '../common/EmptyState.jsx';
import { getLanguageLabel } from '../../utils/constants.js';

// Props: snippets, selectedId, onSelect(id), loading, onNewSnippet, categoriesCount.
export default function SnippetList({
  snippets,
  selectedId,
  onSelect,
  loading,
  onNewSnippet,
  categoriesCount = 0,
}) {
  return (
    <section className="snippet-list">
      <div className="panel-header">
        <h2 className="panel-title">Snippets ({snippets.length})</h2>
        <button
          className="btn btn-sm"
          title="Create new snippet"
          onClick={onNewSnippet}
          disabled={categoriesCount === 0}
        >
          + New
        </button>
      </div>

      {loading && snippets.length === 0 && <p className="muted pad">Loading...</p>}

      {!loading && snippets.length === 0 && (
        <EmptyState
          message="No snippets in this view."
          action={
            categoriesCount > 0 ? (
              <button className="btn btn-primary btn-sm" onClick={onNewSnippet}>
                + Create Snippet
              </button>
            ) : null
          }
        />
      )}

      <ul className="plain-list">
        {snippets.map((snippet) => {
          const meta = [getLanguageLabel(snippet.language), snippet.difficulty]
            .filter(Boolean)
            .join(' · ');
          return (
            <li key={snippet._id}>
              <button
                className={`snippet-item ${snippet._id === selectedId ? 'active' : ''}`}
                onClick={() => onSelect(snippet._id)}
              >
                <span className="snippet-item-title">
                  {snippet.title}
                  {snippet.favorite && <span className="star" title="Favorite"> ★</span>}
                </span>
                <span className="muted small">{meta}</span>
                {snippet.timeComplexity && (
                  <span className="muted small">{snippet.timeComplexity}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
