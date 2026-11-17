import EmptyState from '../common/EmptyState.jsx';
import { getLanguageLabel } from '../../utils/constants.js';

// Temporary: shows code in a <pre>. Phase 8 replaces this with Monaco Editor.
export default function MainArea({ snippet }) {
  if (!snippet) {
    return (
      <main className="main-area">
        <EmptyState
          title="No snippet selected"
          message="Pick a snippet from the list to view it."
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
      </div>
      <pre className="code-preview">
        {snippet.code || '(This snippet has no code yet.)'}
      </pre>
    </main>
  );
}