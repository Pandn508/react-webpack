import React, { useState } from 'react';

const suggestions = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
  "fig",
  "grapefruit"
];

function SearchBox() {
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInput(value);
    if (value.length > 0) {
      const filtered = suggestions.filter(suggestion => suggestion.toLowerCase().startsWith(value.toLowerCase()));
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setFilteredSuggestions([]);
  }

  return (
    <div>
      <input type="text" value={input} onChange={handleInputChange} />
      <ul>
        {filteredSuggestions.map(suggestion => (
          <li key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>
            <span dangerouslySetInnerHTML={{ __html: suggestion.replace(new RegExp(`^(${input})`, 'i'), '<b>$1</b>') }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBox;
