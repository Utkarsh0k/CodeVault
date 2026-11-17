import { useEffect } from 'react';

// A centered dialog over a dimmed background.
// Props: title, onClose, children (the dialog's content).
// Closes on Escape or when you click the dark background.
export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey); // cleanup
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()} // clicks inside don't close it
      >
        <h2 className="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}