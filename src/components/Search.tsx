import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"

function Search() {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      navigate(`/weather/${inputValue.replace(/\s+/g, '-').toLowerCase()}`, { state: inputValue });
    }
  }

  return (
    <section className="text-center text-2xl">
      <section className="searchBar w-4/5 mx-auto flex border-2">
        <input className="searchInput flex-grow pl-4" type="text" placeholder="e.g. 'Newcastle'" spellCheck="false" value={inputValue} onChange={handleInputChange} onKeyDown={handleInputKeyDown} />
        <Link to={`/weather/${inputValue.replace(/\s+/g, '-').toLowerCase()}`} state={inputValue} className="searchButton p-4 bg-amber-400 border-4 border-amber-500" type="button">Search</Link>
      </section>
      <div className="errorMessage text-center"></div>
    </section>
  )
}

export default Search