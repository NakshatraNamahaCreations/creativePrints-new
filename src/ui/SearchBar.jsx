import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ placeholder = "Search...", size = "md", onSearch }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Example popular search suggestions
  const popularSearches = [
    "Business Cards",
    "Custom T-Shirts",
    "Stickers",
    "Labels",
    "Mugs",
  ];

  const handleSearch = (q) => {
    setQuery(q);
    onSearch(q);
    setShowSuggestions(false); // hide suggestions after search
  };

  return (
    <div className="relative w-full">
      {/* Input */}
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // delay so click works
        className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        onClick={() => handleSearch(query)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      >
        <FiSearch size={20} />
      </button>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute z-50 bg-white border border-gray-200 mt-1 w-full rounded-md shadow-lg">
          <ul className="max-h-60 overflow-y-auto">
            {popularSearches
              .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
              .map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSearch(s)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {s}
                </li>
              ))}

            {/* No results */}
            {popularSearches.filter((s) =>
              s.toLowerCase().includes(query.toLowerCase())
            ).length === 0 && (
              <li className="px-4 py-2 text-gray-500">No suggestions</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
