const FacetSearch = ({ searchTerm, search, facetKey }) => {
  return (
    <div className={`input-group rounded-pill my-2 ${facetKey}-search `}>
      <input
        className="form-control remove-focus border-end-0"
        value={searchTerm}
        onChange={event => {
          search(event.target.value)
        }}
        type="text"
        placeholder="Search"
      />
      <span className="btn btn-link">
        <i className="bi bi-search"></i>
      </span>
    </div>
  )
}
export { FacetSearch }
