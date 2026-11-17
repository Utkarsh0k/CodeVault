import { useEffect, useState } from 'react';
import TopBar from '../components/layout/TopBar.jsx';
import CategorySidebar from '../components/layout/CategorySidebar.jsx';
import SnippetList from '../components/layout/SnippetList.jsx';
import MetadataPanel from '../components/layout/MetadataPanel.jsx';
import MainArea from '../components/editor/MainArea.jsx';
import ErrorBanner from '../components/common/ErrorBanner.jsx';
import { getCategories } from '../services/categoryService.js';
import { getSnippets, getSnippet } from '../services/snippetService.js';

// Translates the selected sidebar view into the filters the API understands.
function filtersForView(view) {
  if (view === 'all') return {};
  if (view === 'favorites') return { favorite: 'true' };
  return { categoryId: view }; // anything else is a category _id
}

export default function Workspace() {
  const [categories, setCategories] = useState([]);
  const [selectedView, setSelectedView] = useState('all');
  const [snippets, setSnippets] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedSnippetId, setSelectedSnippetId] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [error, setError] = useState('');

  // Load categories once, when the page first appears.
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);

  // Reload the snippet list whenever the selected view changes.
  useEffect(() => {
    let ignore = false; // set to true if this effect is replaced before finishing
    setLoadingList(true);

    getSnippets(filtersForView(selectedView))
      .then((data) => {
        if (!ignore) setSnippets(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoadingList(false);
      });

    return () => {
      ignore = true;
    };
  }, [selectedView]);

  // Load the full snippet (code + notes) whenever the selection changes.
  useEffect(() => {
    if (!selectedSnippetId) {
      setSelectedSnippet(null);
      return;
    }
    let ignore = false;

    getSnippet(selectedSnippetId)
      .then((data) => {
        if (!ignore) setSelectedSnippet(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, [selectedSnippetId]);

  // Changing view also clears the selection, so the main area never shows
  // a snippet that isn't in the visible list.
  const handleSelectView = (view) => {
    setSelectedView(view);
    setSelectedSnippetId(null);
  };

  return (
    <div className="app-shell">
      <TopBar />
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
      <div className="workspace">
        <CategorySidebar
          categories={categories}
          selectedView={selectedView}
          onSelectView={handleSelectView}
        />
        <SnippetList
          snippets={snippets}
          selectedId={selectedSnippetId}
          onSelect={setSelectedSnippetId}
          loading={loadingList}
        />
        <MainArea snippet={selectedSnippet} />
        <MetadataPanel snippet={selectedSnippet} />
      </div>
    </div>
  );
}