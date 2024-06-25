function Search() {
  return (
    <section className="text-center text-2xl mt-8">
      <section className="search-bar w-4/5 mx-auto flex border-2">
        <input className="search-input flex-grow pl-4" type="text" placeholder="e.g. 'Newcastle'" spellCheck="false" />
        <button className="search-butto p-4 bg-red-100" type="button">Search</button>
      </section>
      <div className="error-message text-center"></div>
    </section>
  )
}

export default Search