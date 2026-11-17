import Editor from '@monaco-editor/react';

// Wraps Microsoft's Monaco Editor with CodeVault's dark theme and settings.
// Props:
// - code: string (current value)
// - language: string (monaco language identifier e.g. "javascript", "cpp", "python")
// - onChange: function(newCode)
// - onSave: function() (triggered by Ctrl+S inside the editor)
export default function CodeEditor({ code, language, onChange, onSave }) {
  const handleEditorDidMount = (editor, monaco) => {
    // Intercept Ctrl+S / Cmd+S inside Monaco so it triggers CodeVault's save action
    // rather than the browser's "Save Webpage" dialog
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) {
        onSave();
      }
    });
  };

  return (
    <div className="editor-wrapper">
      <Editor
        height="100%"
        language={language || 'plaintext'}
        value={code || ''}
        theme="vs-dark"
        onChange={(value) => onChange(value ?? '')}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 13,
          fontFamily: "Consolas, 'Courier New', monospace",
          minimap: { enabled: false }, // keep workspace clean without mini-preview
          scrollBeyondLastLine: false,
          automaticLayout: true, // auto-resizes when sidebar/panel sizes change
          tabSize: 2,
          wordWrap: 'on',
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          padding: { top: 12, bottom: 12 },
        }}
        loading={<div className="pad muted small">Loading editor...</div>}
      />
    </div>
  );
}
