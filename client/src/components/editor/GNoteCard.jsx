import { useEffect, useRef, useState } from 'react';

// Draggable, editable visual note overlaying the code editor.
// Coordinates are calculated relative to the editor container bounding box.
export default function GNoteCard({
  note,
  containerRef,
  onUpdate,
  onDelete,
}) {
  const [pos, setPos] = useState({ x: note.x, y: note.y });
  const [text, setText] = useState(note.text);
  const [isDragging, setIsDragging] = useState(false);

  // Drag tracking refs (avoid stale closures in window event listeners)
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    initialX: note.x,
    initialY: note.y,
    currentX: note.x,
    currentY: note.y,
  });

  // Sync state if server updates the note
  useEffect(() => {
    setPos({ x: note.x, y: note.y });
    dragRef.current.currentX = note.x;
    dragRef.current.currentY = note.y;
  }, [note.x, note.y]);

  useEffect(() => {
    setText(note.text);
  }, [note.text]);

  const handleMouseDown = (e) => {
    // Only drag from the header bar, not when typing in the textarea
    if (e.target.closest('.gnote-close-btn') || e.target.tagName === 'TEXTAREA') {
      return;
    }

    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = pos.x;
    const initialY = pos.y;

    dragRef.current.startX = startX;
    dragRef.current.startY = startY;
    dragRef.current.initialX = initialX;
    dragRef.current.initialY = initialY;
    dragRef.current.currentX = initialX;
    dragRef.current.currentY = initialY;

    const handleMouseMove = (moveEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      const cardWidth = note.width || 200;
      const minCardHeight = 60;

      // Keep note within container boundaries
      const clampedX = Math.max(0, Math.min(rect.width - cardWidth, initialX + dx));
      const clampedY = Math.max(0, Math.min(rect.height - minCardHeight, initialY + dy));

      dragRef.current.currentX = Math.round(clampedX);
      dragRef.current.currentY = Math.round(clampedY);

      setPos({ x: Math.round(clampedX), y: Math.round(clampedY) });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      // Only save to MongoDB when drag finishes and position actually changed
      const finalX = dragRef.current.currentX;
      const finalY = dragRef.current.currentY;

      if (finalX !== note.x || finalY !== note.y) {
        onUpdate(note.id, { x: finalX, y: finalY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTextBlur = () => {
    const trimmed = text.trim();
    if (trimmed && trimmed !== note.text) {
      onUpdate(note.id, { text: trimmed });
    } else if (!trimmed) {
      // Revert if user leaves note empty
      setText(note.text);
    }
  };

  return (
    <div
      className={`gnote-card ${isDragging ? 'is-dragging' : ''}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${note.width || 200}px`,
      }}
    >
      <div
        className="gnote-header"
        onMouseDown={handleMouseDown}
        title="Drag to reposition note"
      >
        <span className="gnote-drag-handle">⠿ Note</span>
        <button
          type="button"
          className="gnote-close-btn"
          onClick={() => onDelete(note.id)}
          title="Delete note"
          aria-label="Delete note"
        >
          ×
        </button>
      </div>

      <textarea
        className="gnote-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleTextBlur}
        placeholder="Type a note..."
        rows={3}
      />
    </div>
  );
}
