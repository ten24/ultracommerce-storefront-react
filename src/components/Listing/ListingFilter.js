import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
const FacetSearch = ({ searchTerm, search }) => {
  return (
    <div className="input-group">
      <input
        className="form-control  border-end-0"
        value={searchTerm}
        onChange={event => {
          search(event.target.value)
        }}
        type="text"
        placeholder="Search"
      />
      <span className="input-group-text bg-white border-start-0">
        <i className="bi bi-search"></i>
      </span>
    </div>
  )
}

const AttributeFacet = ({ facet, filterName, facetKey, updateAttribute, isSelected = false }) => {
  const token = filterName.replace(/\s/g, '') + facet.name.replace(/\s/g, '') + 'input'
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={isSelected}
        onChange={() => {
          updateAttribute({ name: facet.legacyName || facet.name, filterName: facetKey })
        }}
        id={token}
      />
      <label className="form-check-label"> {facet.name}</label>
    </div>
  )
}

const ListingFilter = ({ qs, appliedFilters, name, facetKey, selectType, options, index, updateAttribute }) => {
  let filterData = useSelector(state => state.configuration.filtering.filterDataShowCounts)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [updateCount, setUpdateCount] = useState(filterData)
  const { t } = useTranslation()
  useEffect(() => {
    let results = options
    if (searchTerm.length) {
      results = options.filter(option => option.name.toLowerCase().includes(searchTerm.toLowerCase()))
      results = options.filter(option => option?.legacyName.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (selectType === 'single') {
      const selectedResults = options.filter(option => {
        return appliedFilters.includes(option.name) || appliedFilters.includes(option?.legacyName)
      })
      if (selectedResults.length !== 0) {
        results = selectedResults
      }
    }

    setSearchResults([...results])
  }, [searchTerm, options, appliedFilters, name, selectType])

  return (
    <div className="filter-list-container">
      <h4>{name}</h4>
      <FacetSearch searchTerm={searchTerm} search={setSearchTerm} />
      <div className="filter-items-list pt-1 listingFilter ps-1">
        {searchResults &&
          searchResults
            .filter((facet, key) => key < updateCount)
            .map(facet => {
              const isSelected = appliedFilters.includes(facet.name) || appliedFilters.includes(facet?.legacyName)
              return <AttributeFacet qs={qs} isSelected={isSelected} facet={facet} key={facet.id || facet.value} filterName={name} facetKey={facetKey} updateAttribute={updateAttribute} />
            })}
      </div>
      {searchResults.length > updateCount && (
        <button className="link-button" onClick={() => setUpdateCount(searchResults.length)}>
          {t('frontend.product.select_more')}
        </button>
      )}
    </div>
  )
}

export { ListingFilter }
