import { useState } from 'react';
import EmptyState from '../common/EmptyState.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';
import CategoryNameModal from './CategoryNameModal.jsx';

// One clickable row in the sidebar.
function SidebarItem({ label, count, active, onClick }) {
  return (
    <button
      className={`sidebar-item ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="sidebar-item-label">{label}</span>
      {count !== undefined && <span className="muted">{count}</span>}
    </button>
  );
}

function deleteMessage(category) {
  const n = category.snippetCount;
  if (n === 0) return 'This category is empty. This cannot be undone.';
  return `This will also permanently delete ${n} snippet${n === 1 ? '' : 's'}. This cannot be undone.`;
}

// Props:
//   categories, selectedView, onSelectView(view)
//   onCreate(name), onRename(id, name), onDelete(category): all async, passed by Workspace.
// State owned: which dialog is open. null, or { type: 'create' | 'rename' | 'delete', category }.
export default function CategorySidebar({
  categories,
  selectedView,
  onSelectView,
  onCreate,
  onRename,
  onDelete,
}) {
  const [dialog, setDialog] = useState(null);
  const closeDialog = () => setDialog(null);

  const totalSnippets = categories.reduce((sum, c) => sum + c.snippetCount, 0);

  return (
    <aside className="sidebar">
      <h2 className="panel-title">Categories</h2>

      <SidebarItem
        label="All Snippets"
        count={totalSnippets}
        active={selectedView === 'all'}
        onClick={() => onSelectView('all')}
      />
      <SidebarItem
        label="★ Favorites"
        active={selectedView === 'favorites'}
        onClick={() => onSelectView('favorites')}
      />

      <div className="sidebar-divider" />

      {categories.length === 0 && (
        <EmptyState message="No categories yet. Create one to organize your snippets." />
      )}

      {categories.map((category) => (
        <div className="sidebar-row" key={category._id}>
          <SidebarItem
            label={category.name}
            count={category.snippetCount}
            active={selectedView === category._id}
            onClick={() => onSelectView(category._id)}
          />
          <div className="row-actions">
            <button
              className="icon-button"
              title="Rename category"
              aria-label={`Rename ${category.name}`}
              onClick={() => setDialog({ type: 'rename', category })}
            >
              ✎
            </button>
            <button
              className="icon-button"
              title="Delete category"
              aria-label={`Delete ${category.name}`}
              onClick={() => setDialog({ type: 'delete', category })}
            >
              ×
            </button>
          </div>
        </div>
      ))}

      <button className="add-category" onClick={() => setDialog({ type: 'create' })}>
        + Add Category
      </button>

      {dialog?.type === 'create' && (
        <CategoryNameModal
          title="New category"
          submitLabel="Create"
          onClose={closeDialog}
          onSubmit={async (name) => {
            await onCreate(name);
            closeDialog();
          }}
        />
      )}

      {dialog?.type === 'rename' && (
        <CategoryNameModal
          title="Rename category"
          initialName={dialog.category.name}
          submitLabel="Rename"
          onClose={closeDialog}
          onSubmit={async (name) => {
            await onRename(dialog.category._id, name);
            closeDialog();
          }}
        />
      )}

      {dialog?.type === 'delete' && (
        <ConfirmDialog
          title={`Delete "${dialog.category.name}"?`}
          message={deleteMessage(dialog.category)}
          onCancel={closeDialog}
          onConfirm={async () => {
            await onDelete(dialog.category);
            closeDialog();
          }}
        />
      )}
    </aside>
  );
}