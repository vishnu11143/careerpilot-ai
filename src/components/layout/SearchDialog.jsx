/* ============================================
   CareerPilot AI — Search Dialog
   Command-palette style search (⌘K / Ctrl+K)
   ============================================ */

import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { SIDEBAR_NAV_ITEMS } from '../../config/navigation';

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 */
export function SearchDialog({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Filter nav items based on query
  const results = useMemo(() => {
    if (!query.trim()) return SIDEBAR_NAV_ITEMS;
    const lower = query.toLowerCase();
    return SIDEBAR_NAV_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        item.id.toLowerCase().includes(lower)
    );
  }, [query]);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  if (!open) return null;

  return (
    <div
      className="search-dialog-overlay animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-dialog animate-scale-in">
        <div className="search-dialog-input-wrap">
          <Search size={18} className="search-dialog-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, features, settings..."
            className="search-dialog-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          <kbd className="search-dialog-kbd">ESC</kbd>
        </div>

        <div className="search-dialog-results">
          {results.length === 0 ? (
            <div className="search-dialog-empty">
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <ul className="search-dialog-list">
              {results.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      className="search-dialog-item"
                      onClick={() => handleSelect(item.path)}
                    >
                      <Icon size={18} className="search-dialog-item-icon" />
                      <span className="search-dialog-item-label">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="search-dialog-item-badge">
                          {item.badge}
                        </span>
                      )}
                      <ArrowRight size={14} className="search-dialog-item-arrow" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
