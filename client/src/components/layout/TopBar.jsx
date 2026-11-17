import { useEffect, useState } from 'react';
import { LANGUAGES, DIFFICULTIES } from '../../utils/constants.js';

// TopBar with CodeVault branding, debounced search, and language/difficulty filters.
export default function TopBar({
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  selectedDifficulty,
  onDifficultyChange,
  onResetFilters,
}) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Keep local search input in sync if parent resets it
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search input by 250ms so we don't spam the server on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, onSearchChange]);

  const hasActiveFilters = Boolean(
    searchQuery || selectedLanguage || selectedDifficulty
  );

  return (
    <header className="topbar">
      <div className="topbar-brand-group">
        <span className="brand-logo" aria-hidden="true">⟨/⟩</span>
        <span className="brand">CodeVault</span>
        <span className="muted small brand-tagline">Personal code snippet vault</span>
      </div>

      <div className="topbar-controls">
        <div className="search-box-wrapper">
          <input
            className="search-input"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search snippets (title, tag, description)..."
            aria-label="Search snippets"
          />
          {localSearch && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setLocalSearch('');
                onSearchChange('');
              }}
              title="Clear search"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <select
          className="topbar-select"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          aria-label="Filter by language"
        >
          <option value="">All Languages</option>
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        <select
          className="topbar-select"
          value={selectedDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          aria-label="Filter by difficulty"
        >
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-sm btn-reset-filters"
            onClick={onResetFilters}
            title="Reset search and filters"
          >
            Reset
          </button>
        )}
      </div>
    </header>
  );
}
