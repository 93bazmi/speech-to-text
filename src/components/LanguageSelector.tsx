import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectorProps {
  languages: Language[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  id: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  value,
  onChange,
  label,
  id,
}) => {
  const selectedLanguage = languages.find((lang) => lang.code === value);

  return (
    <div className="relative w-full">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none block w-full px-4 py-2.5 bg-white border border-gray-300 
                    rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600
                    transition-colors duration-200 ease-in-out text-gray-700 pr-10"
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown size={18} />
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {selectedLanguage?.nativeName ? `${selectedLanguage.nativeName}` : ''}
      </p>
    </div>
  );
};

export default LanguageSelector;