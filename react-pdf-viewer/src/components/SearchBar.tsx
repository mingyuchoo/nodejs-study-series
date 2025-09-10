import { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onClear: () => void;
  currentMatch: number;
  totalMatches: number;
  onPrevious: () => void;
  onNext: () => void;
}

const SearchBar = ({ 
  onSearch, 
  onClear, 
  currentMatch, 
  totalMatches, 
  onPrevious, 
  onNext 
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        onPrevious();
      } else {
        onNext();
      }
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="텍스트 검색..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          검색
        </button>
        <button type="button" onClick={handleClear} className="clear-button">
          지우기
        </button>
      </form>
      
      {totalMatches > 0 && (
        <div className="search-results">
          <span className="match-info">
            {currentMatch} / {totalMatches}
          </span>
          <button 
            onClick={onPrevious} 
            disabled={totalMatches === 0}
            className="nav-button"
          >
            ↑
          </button>
          <button 
            onClick={onNext} 
            disabled={totalMatches === 0}
            className="nav-button"
          >
            ↓
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;