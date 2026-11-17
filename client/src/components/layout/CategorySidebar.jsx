import EmptyState from '../common/EmptyState.jsx';

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

// Props: categories (array), selectedView ('all' | 'favorites' | a category _id),
//        onSelectView (called with the new view).
export default function CategorySidebar({ categories, selectedView, onSelectView }) {
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

      {categories.length === 0 ? (
        <EmptyState message="No categories yet. Create one to organize your snippets." />
      ) : (
        categories.map((category) => (
          <SidebarItem
            key={category._id}
            label={category.name}
            count={category.snippetCount}
            active={selectedView === category._id}
            onClick={() => onSelectView(category._id)}
          />
        ))
      )}
    </aside>
  );
}