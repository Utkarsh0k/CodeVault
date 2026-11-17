import EmptyState from '../common/EmptyState.jsx';
import { getLanguageLabel } from '../../utils/constants.js';

function getDifficultyClass(difficulty) {
  if (!difficulty) return '';
  const d = difficulty.toLowerCase();
  if (d === 'easy') return 'badge-diff-easy';
  if (d === 'medium') return 'badge-diff-medium';
  if (d === 'hard') return 'badge-diff-hard';
  return '';
}

// Props: snippets, selectedId, onSelect(id), loading, onNewSnippet, categoriesCount, isFiltered, onResetFilters, onToggleFavorite
export default function SnippetList({
  snippets,
  selectedId,
  onSelect,
  loading,
  onNewSnippet,
  categoriesCount = 0,
  isFiltered = false,
  onResetFilters,
  onToggleFavorite,
}) {
  return (
    <section className="snippet-list">
      <div className="panel-header">
        <h2 className="panel-title">Snippets ({snippets.length})</h2>
        <button
          type="button"
          className="btn btn-sm btn-primary-outline"
          title="Create new snippet"
          onClick={onNewSnippet}
          disabled={categoriesCount === 0}
        >
          + New
        </button>
      </div>

      {loading && snippets.length === 0 && (
        <div className="pad muted small loader-text">Loading snippets...</div>
      )}

      {!loading && snippets.length === 0 && (
        isFiltered ? (
          <EmptyState
            icon="🔍"
            title="No snippets match"
            message="No snippets match your current search query or filter criteria."
            action={
              <button
                type="button"
                className="btn btn-sm"
                onClick={onResetFilters}
              >
                Clear Search & Filters
              </button>
            }
          />
        ) : (
          <EmptyState
            icon="📄"
            title="No snippets yet"
            message="No snippets in this category. Click below to add your first snippet."
            action={
              categoriesCount > 0 ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onNewSnippet}
                >
                  + Create Snippet
                </button>
              ) : null
            }
          />
        )
      )}

      <ul className="plain-list">
        {snippets.map((snippet) => {
          const diffClass = getDifficultyClass(snippet.difficulty);

          return (
            <li key={snippet._id}>
              <div
                className={`snippet-item ${snippet._id === selectedId ? 'active' : ''}`}
                onClick={() => onSelect(snippet._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(snippet._id);
                  }
                }}
              >
                <div className="snippet-item-header">
                  <span className="snippet-item-title" title={snippet.title}>
                    {snippet.title}
                  </span>
                  <button
                    type="button"
                    className={`snippet-star-btn ${snippet.favorite ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(snippet._id);
                    }}
                    title={snippet.favorite ? 'Remove from favorites' : 'Mark as favorite'}
                    aria-label={snippet.favorite ? 'Remove from favorites' : 'Mark as favorite'}
                  >
                    {snippet.favorite ? '★' : '☆'}
                  </button>
                </div>

                <div className="snippet-item-meta">
                  <span className="muted small">
                    {getLanguageLabel(snippet.language)}
                  </span>

                  {snippet.difficulty && (
                    <span className={`badge-diff ${diffClass}`}>
                      {snippet.difficulty}
                    </span>
                  )}

                  {snippet.timeComplexity && (
                    <span className="muted small snippet-complexity" title="Time Complexity">
                      {snippet.timeComplexity}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
