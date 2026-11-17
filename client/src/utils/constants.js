// Matches server/utils/constants.js. "monaco" is the language ID Monaco Editor
// uses (it calls Bash "shell"); we'll use it in Phase 8.
export const LANGUAGES = [
  { value: 'cpp', label: 'C++', monaco: 'cpp' },
  { value: 'java', label: 'Java', monaco: 'java' },
  { value: 'javascript', label: 'JavaScript', monaco: 'javascript' },
  { value: 'python', label: 'Python', monaco: 'python' },
  { value: 'sql', label: 'SQL', monaco: 'sql' },
  { value: 'html', label: 'HTML', monaco: 'html' },
  { value: 'css', label: 'CSS', monaco: 'css' },
  { value: 'json', label: 'JSON', monaco: 'json' },
  { value: 'bash', label: 'Bash', monaco: 'shell' },
];

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export function getLanguageLabel(value) {
  return LANGUAGES.find((lang) => lang.value === value)?.label || value;
}

export function getMonacoLanguage(value) {
  return LANGUAGES.find((lang) => lang.value === value)?.monaco || 'plaintext';
}
