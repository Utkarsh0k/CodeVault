// Shows a readable error banner under the top bar with an alert icon and dismiss button.
export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      <div className="error-banner-content">
        <span className="error-banner-icon">⚠️</span>
        <span className="error-banner-text">{message}</span>
      </div>
      <button
        type="button"
        className="link-button error-dismiss-btn"
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        Dismiss
      </button>
    </div>
  );
}
