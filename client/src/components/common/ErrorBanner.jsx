// Shows a readable error under the top bar, with a dismiss button.
export default function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="error-banner" role="alert">
      <span>{message}</span>
      <button className="link-button" onClick={onDismiss}>Dismiss</button>
    </div>
  );
}