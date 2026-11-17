import { useEffect, useMemo, useState } from 'react';
import TopBar from '../components/layout/TopBar.jsx';
import CategorySidebar from '../components/layout/CategorySidebar.jsx';
import SnippetList from '../components/layout/SnippetList.jsx';
import MetadataPanel from '../components/layout/MetadataPanel.jsx';
import MainArea from '../components/editor/MainArea.jsx';
import ErrorBanner from '../components/common/ErrorBanner.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import CreateSnippetModal from '../components/layout/CreateSnippetModal.jsx';
import useCategories from '../hooks/useCategories.js';
import useSnippets from '../hooks/useSnippets.js';
import { getSnippet } from '../services/snippetService.js';

export default function Workspace() {
  const [error, setError] = useState('');
  const {
    categories,
    refresh: refreshCategories,
    addCategory,
    renameCategory,
    removeCategory,
  } = useCategories(setError);

  const [selectedView, setSelectedView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const isFiltered = Boolean(searchQuery || selectedLanguage || selectedDifficulty);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('');
    setSelectedDifficulty('');
  };

  // Assembles filters for the backend query: category / view + search + language + difficulty
  const filters = useMemo(() => {
    const f = {};
    if (selectedView === 'favorites') {
      f.favorite = 'true';
    } else if (selectedView !== 'all') {
      f.categoryId = selectedView;
    }
    if (searchQuery.trim()) {
      f.q = searchQuery.trim();
    }
    if (selectedLanguage) {
      f.language = selectedLanguage;
    }
    if (selectedDifficulty) {
      f.difficulty = selectedDifficulty;
    }
    return f;
  }, [selectedView, searchQuery, selectedLanguage, selectedDifficulty]);

  const {
    snippets,
    loading: loadingList,
    refresh: refreshSnippets,
    addSnippet,
    editSnippet,
    removeSnippet,
  } = useSnippets(filters, setError);

  const [selectedSnippetId, setSelectedSnippetId] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [codeDraft, setCodeDraft] = useState('');
  const [savingCode, setSavingCode] = useState(false);

  // Dialog and action states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [snippetToDelete, setSnippetToDelete] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  // Track if current code has unsaved modifications
  const isDirty = Boolean(
    selectedSnippet && codeDraft !== (selectedSnippet.code || '')
  );

  // Load the full snippet (code + notes) whenever the selection changes
  useEffect(() => {
    if (!selectedSnippetId) {
      setSelectedSnippet(null);
      setCodeDraft('');
      return;
    }
    let ignore = false;

    getSnippet(selectedSnippetId)
      .then((data) => {
        if (!ignore) {
          setSelectedSnippet(data);
          setCodeDraft(data.code || '');
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, [selectedSnippetId]);

  // Safe navigation guard to prevent accidental loss of unsaved changes
  const requestNavigation = (action) => {
    if (isDirty) {
      setPendingAction(() => action);
    } else {
      action();
    }
  };

  const handleSelectView = (view) => {
    requestNavigation(() => {
      setSelectedView(view);
      setSelectedSnippetId(null);
    });
  };

  const handleSelectSnippet = (id) => {
    if (id === selectedSnippetId) return;
    requestNavigation(() => {
      setSelectedSnippetId(id);
    });
  };

  // ----- Category actions -----
  const handleCreateCategory = async (name) => {
    const created = await addCategory(name);
    handleSelectView(created._id); // jump to the new, empty category
  };

  const handleDeleteCategory = async (category) => {
    await removeCategory(category._id); // server also deletes its snippets

    if (selectedView === category._id) {
      handleSelectView('all');
    } else if (selectedSnippet?.categoryId === category._id) {
      setSelectedSnippetId(null);
    }
    await refreshSnippets();
  };

  // ----- Snippet actions -----
  const handleCreateSnippet = async (data) => {
    const created = await addSnippet(data);
    await refreshCategories();
    setShowCreateModal(false);

    // If viewing another category, switch view to the created snippet's category
    if (selectedView !== 'all' && selectedView !== created.categoryId) {
      setSelectedView(created.categoryId);
    }
    setSelectedSnippetId(created._id);
  };

  const handleSaveCode = async () => {
    if (!selectedSnippet) return;
    setSavingCode(true);
    try {
      const updated = await editSnippet(selectedSnippet._id, { code: codeDraft });
      setSelectedSnippet(updated);
      setCodeDraft(updated.code || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingCode(false);
    }
  };

  const handleDeleteSnippet = async (snippet) => {
    await removeSnippet(snippet._id);
    await refreshCategories();
    if (selectedSnippetId === snippet._id) {
      setSelectedSnippetId(null);
      setSelectedSnippet(null);
      setCodeDraft('');
    }
  };

  const handleUpdateMetadata = async (metadata) => {
    if (!selectedSnippet) return;
    const previousCategoryId = selectedSnippet.categoryId;
    const updated = await editSnippet(selectedSnippet._id, metadata);
    setSelectedSnippet(updated);

    if (metadata.categoryId && metadata.categoryId !== previousCategoryId) {
      await refreshCategories();
    }
  };

  return (
    <div className="app-shell">
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        onResetFilters={handleResetFilters}
      />
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
          onSelect={handleSelectSnippet}
          loading={loadingList}
          onNewSnippet={() => setShowCreateModal(true)}
          categoriesCount={categories.length}
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
        />

        <MainArea
          snippet={selectedSnippet}
          codeDraft={codeDraft}
          onCodeChange={setCodeDraft}
          isDirty={isDirty}
          onSave={handleSaveCode}
          saving={savingCode}
          onDelete={() => setSnippetToDelete(selectedSnippet)}
        />

        <MetadataPanel
          snippet={selectedSnippet}
          categories={categories}
          onUpdateMetadata={handleUpdateMetadata}
        />
      </div>

      {showCreateModal && (
        <CreateSnippetModal
          categories={categories}
          defaultCategoryId={
            selectedView !== 'all' && selectedView !== 'favorites'
              ? selectedView
              : ''
          }
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSnippet}
        />
      )}

      {snippetToDelete && (
        <ConfirmDialog
          title={`Delete "${snippetToDelete.title}"?`}
          message="This snippet will be permanently deleted. This cannot be undone."
          confirmLabel="Delete"
          onCancel={() => setSnippetToDelete(null)}
          onConfirm={async () => {
            await handleDeleteSnippet(snippetToDelete);
            setSnippetToDelete(null);
          }}
        />
      )}

      {pendingAction && (
        <ConfirmDialog
          title="Discard unsaved changes?"
          message="You have unsaved changes in this snippet. If you leave now, your edits will be discarded."
          confirmLabel="Discard"
          onCancel={() => setPendingAction(null)}
          onConfirm={() => {
            const action = pendingAction;
            setPendingAction(null);
            action();
          }}
        />
      )}
    </div>
  );
}
