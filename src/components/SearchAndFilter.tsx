import React from 'react';
import { Search, Filter, Star } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  allGenres: string[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedGenres,
  onGenreChange,
  sortBy,
  onSortChange,
  allGenres
}) => {
  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenreChange(selectedGenres.filter(g => g !== genre));
    } else {
      onGenreChange([...selectedGenres, genre]);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="rating">Rating</option>
            <option value="genre">Genre</option>
          </select>
        </div>
      </div>

      {/* Genre Filters */}
      <div className="mt-4">
        <h3 className="text-white font-semibold mb-3">Genres</h3>
        <div className="flex flex-wrap gap-2">
          {allGenres.map(genre => (
            <button
              key={genre}
              onClick={() => handleGenreToggle(genre)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedGenres.includes(genre)
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;