import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, placeholder, disabled, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        if (selectedOption) {
          setSearchTerm(selectedOption.label);
        } else {
          setSearchTerm('');
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedOption]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          className="px-3 py-1 pr-8 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full min-w-[160px] bg-white cursor-text"
          placeholder={loading ? 'Loading...' : placeholder}
          value={isOpen ? searchTerm : (selectedOption ? selectedOption.label : '')}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onClick={() => {
            if (disabled || loading) return;
            setIsOpen(true);
            setSearchTerm(''); // show all
          }}
          disabled={disabled || loading}
        />
        <div 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
          onClick={() => {
            if (disabled || loading) return;
            setIsOpen(!isOpen);
            if (!isOpen) setSearchTerm('');
          }}
        >
          <ChevronDown size={14} />
        </div>
      </div>
      
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto text-xs py-1">
          <li
            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-700"
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
          >
            Overall
          </li>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt.value}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  opt.value === value ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700'
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500 italic">No matches</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
