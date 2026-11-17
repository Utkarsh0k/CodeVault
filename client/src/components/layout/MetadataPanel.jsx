import { getLanguageLabel } from '../../utils/constants.js';

function Field({ label, children }) {
  return (
    <div className="field">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

const formatDate = (iso) => new Date(iso).toLocaleString();

// Read-only for now; editing arrives in Phase 9.
export default function MetadataPanel({ snippet }) {
  return (
    <aside className="meta-panel">
      <h2 className="panel-title">Details</h2>

      {!snippet ? (
        <p className="muted pad">Select a snippet to see its details.</p>
      ) : (
        <dl className="pad">
          <Field label="Title">{snippet.title}</Field>
          <Field label="Description">{snippet.description || '—'}</Field>
          <Field label="Language">{getLanguageLabel(snippet.language)}</Field>
          <Field label="Difficulty">{snippet.difficulty || '—'}</Field>
          <Field label="Time Complexity">{snippet.timeComplexity || '—'}</Field>
          <Field label="Tags">
            {snippet.tags.length === 0
              ? '—'
              : snippet.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
          </Field>
          <Field label="Created">{formatDate(snippet.createdAt)}</Field>
          <Field label="Updated">{formatDate(snippet.updatedAt)}</Field>
        </dl>
      )}
    </aside>
  );
}