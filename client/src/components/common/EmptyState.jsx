// Friendly, accessible placeholder shown when there is nothing to display.
export default function EmptyState({ title, message, icon = '📋', action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      {title && <p className="empty-title">{title}</p>}
      <p className="muted small empty-message">{message}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}
