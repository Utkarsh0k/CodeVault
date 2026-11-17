import EmptyState from '../common/EmptyState.jsx';
import { getLanguageLabel } from '../../utils/constants.js';

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
        isFiltered ? (
          <EmptyState
            title="No snippets match"
            message="No snippets match your search or filter criteria."
            action={
              <button className="btn btn-sm" onClick={onResetFilters}>
                Clear Search & Filters
              </button>
            }
          />
        ) : (
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
        )
      )}

      <ul className="plain-list">
        {snippets.map((snippet) => {
          const meta = [getLanguageLabel(snippet.language), snippet.difficulty]
            .filter(Boolean)
            .join(' · ');
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
                  <span className="snippet-item-title">{snippet.title}</span>
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
                <span className="muted small">{meta}</span>
                {snippet.timeComplexity && (
                  <span className="muted small">{snippet.timeComplexity}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
