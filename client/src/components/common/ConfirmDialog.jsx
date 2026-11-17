import { useState } from 'react';
import Modal from './Modal.jsx';

// Asks "are you sure?" before a destructive action.
// Props: title, message, confirmLabel, onConfirm (async), onCancel.
// If onConfirm throws, the error is shown here and the dialog stays open.
// On success the parent closes the dialog.
export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title={title} onClose={onCancel}>
      <p>{message}</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="modal-actions">
        <button className="btn" onClick={onCancel} disabled={busy}>Cancel</button>
        <button className="btn btn-danger" onClick={handleConfirm} disabled={busy}>
          {busy ? 'Working...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}