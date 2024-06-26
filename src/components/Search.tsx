function Search() {
  return (
    <section className="text-center text-2xl">
      <section className="searchBar w-4/5 mx-auto flex border-2">
        <input className="searchInput flex-grow pl-4" type="text" placeholder="e.g. 'Newcastle'" spellCheck="false" />
        <button className="searchButton p-4 bg-red-100" type="button">Search</button>
      </section>
      <div className="errorMessage text-center"></div>
    </section>
  )
}

export default Search