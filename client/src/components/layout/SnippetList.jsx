import EmptyState from '../common/EmptyState.jsx';
import { getLanguageLabel } from '../../utils/constants.js';

// Props: snippets (light list items), selectedId, onSelect(id), loading.
export default function SnippetList({ snippets, selectedId, onSelect, loading }) {
  return (
    <section className="snippet-list">
      <h2 className="panel-title">Snippets ({snippets.length})</h2>

      {loading && snippets.length === 0 && <p className="muted pad">Loading...</p>}
      {!loading && snippets.length === 0 && (
        <EmptyState message="No snippets in this category." />
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