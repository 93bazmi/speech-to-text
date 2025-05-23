import React, { useState, useRef, useEffect } from 'react';

interface LanguageDropdownProps {
  options: { code: string; name: string }[];
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  label: string;
  id: string;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  label,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearchTerm('');
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      setSearchTerm('');
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectedOption = options.find((o) => o.code === value);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-gray-900 dark:text-gray-100 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedOption ? selectedOption.name : 'Select language'}
        <span className="float-right">&#x25BC;</span>
      </button>

      {open && (
        <div
          className="absolute z-10 mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg focus:outline-none"
          style={{ maxHeight: '220px' }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search language..."
            className="w-full px-3 py-2 border-b border-gray-300 dark:border-gray-600 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            autoFocus
          />
          <ul role="listbox" tabIndex={-1} className="max-h-40 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.code}
                  role="option"
                  aria-selected={option.code === value}
                  onClick={() => {
                    onChange(option.code);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onChange(option.code);
                      setOpen(false);
                      setSearchTerm('');
                    }
                  }}
                  tabIndex={0}
                  className={`cursor-pointer px-3 py-2 hover:bg-indigo-600 hover:text-white ${
                    option.code === value
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {option.name}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;