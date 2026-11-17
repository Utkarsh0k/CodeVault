import { useEffect, useState } from 'react';
import TopBar from '../components/layout/TopBar.jsx';
import CategorySidebar from '../components/layout/CategorySidebar.jsx';
import SnippetList from '../components/layout/SnippetList.jsx';
import MetadataPanel from '../components/layout/MetadataPanel.jsx';
import MainArea from '../components/editor/MainArea.jsx';
import ErrorBanner from '../components/common/ErrorBanner.jsx';
import useCategories from '../hooks/useCategories.js';
import { getSnippets, getSnippet } from '../services/snippetService.js';

// Translates the selected sidebar view into the filters the API understands.
function filtersForView(view) {
  if (view === 'all') return {};
  if (view === 'favorites') return { favorite: 'true' };
  return { categoryId: view }; // anything else is a category _id
}

export default function Workspace() {
  const [error, setError] = useState('');
  const { categories, addCategory, renameCategory, removeCategory } =
    useCategories(setError);

  const [selectedView, setSelectedView] = useState('all');
  const [snippets, setSnippets] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listVersion, setListVersion] = useState(0); // bump to force a list reload
  const [selectedSnippetId, setSelectedSnippetId] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  // Reload the snippet list when the view changes or listVersion is bumped.
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
  }, [selectedView, listVersion]);

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

  // ----- category actions (called by the sidebar's dialogs) -----

  const handleCreateCategory = async (name) => {
    const created = await addCategory(name);
    handleSelectView(created._id); // jump to the new, empty category
  };

  const handleDeleteCategory = async (category) => {
    await removeCategory(category._id); // server also deletes its snippets

    if (selectedView === category._id) {
      handleSelectView('all');
    } else if (selectedSnippet?.categoryId === category._id) {
      setSelectedSnippetId(null); // the open snippet no longer exists
    }
    setListVersion((v) => v + 1); // "All"/"Favorites" lists may hold deleted snippets
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
          onCreate={handleCreateCategory}
          onRename={renameCategory}
          onDelete={handleDeleteCategory}
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