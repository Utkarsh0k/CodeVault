// Friendly placeholder shown when there is nothing to display.
export default function EmptyState({ title, message }) {
  return (
    <div className="empty-state">
      {title && <p className="empty-title">{title}</p>}
      <p className="muted">{message}</p>
    </div>
  );
}