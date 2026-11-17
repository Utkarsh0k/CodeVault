import GNoteCard from './GNoteCard.jsx';

// Transparent overlay positioned above the Monaco editor canvas.
// Uses pointer-events: none on the overlay container so code underneath remains
// clickable and editable, while pointer-events: auto on GNoteCards captures note interactions.
export default function GNotesOverlay({
  gNotes = [],
  containerRef,
  onUpdateNote,
  onDeleteNote,
}) {
  return (
    <div className="gnotes-overlay">
      {gNotes.map((note) => (
        <GNoteCard
          key={note.id}
          note={note}
          containerRef={containerRef}
          onUpdate={onUpdateNote}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
}
