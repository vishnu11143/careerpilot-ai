/* ============================================
   CareerPilot AI — TagInput Component
   Pill-style tag input for skills and similar.
   Type and press Enter or comma to add tags.
   ============================================ */

import { useState, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * @param {Object} props
 * @param {string[]} props.value — current tags array
 * @param {function} props.onChange — callback with updated tags array
 * @param {string} [props.placeholder]
 * @param {number} [props.maxTags=20] — maximum number of tags
 * @param {string[]} [props.suggestions=[]] — autocomplete suggestions
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {string} [props.className]
 */
export function TagInput({
  value = [],
  onChange,
  placeholder = 'Type and press Enter…',
  maxTags = 20,
  suggestions = [],
  label,
  error,
  className = '',
}) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(s)
  ).slice(0, 8);

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (!trimmed || value.includes(trimmed) || value.length >= maxTags) return;
    onChange([...value, trimmed]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(e.target.value.length > 0 && suggestions.length > 0);
  };

  return (
    <div className={`tag-input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div
        className={`tag-input-container ${error ? 'tag-input-error' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="tag-input-tags">
          {value.map((tag) => (
            <span key={tag} className="tag-input-tag">
              <span className="tag-input-tag-text">{tag}</span>
              <button
                type="button"
                className="tag-input-tag-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                aria-label={`Remove ${tag}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {value.length < maxTags && (
            <input
              ref={inputRef}
              type="text"
              className="tag-input-field"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => inputValue && suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder={value.length === 0 ? placeholder : ''}
            />
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="tag-input-suggestions">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="tag-input-suggestion"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addTag(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {value.length >= maxTags && (
        <span className="tag-input-limit">Maximum {maxTags} tags reached</span>
      )}
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}
