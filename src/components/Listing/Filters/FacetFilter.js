import { FacetSearch } from './FacetSearch'
import { FacetHeading } from './FacetHeading'
import { useListingFilter } from '../../../hooks'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const AttributeList = ({ appliedFilters, facetKeyName = 'name', facet, filterName, facetKey, updateAttribute }) => {
  const token = filterName.replace(/\s/g, '') + facet.name.replace(/\s/g, '') + 'input'
  const name = facet[facetKeyName] || facet.name
  const isSelected = appliedFilters.includes(name)
  const updateAction = () => {
    updateAttribute({ name, filterName: facetKey })
  }
  return (
    <div className="d-flex justify-content-between">
      <div className="form-check pb-0 pe-3">
        <input className="form-check-input" type="checkbox" checked={isSelected} onChange={updateAction} id={token} />
        <label className="form-check-label" onClick={updateAction}>
          {facet.displayName}
        </label>
      </div>
      <div className="pt-1">
        {facet.count && (
          <span style={{ fontSize: 12 }} className="text-muted ml-3 text-right">
            {facet.count}
          </span>
        )}
      </div>
    </div>
  )
}

const FacetFilter = ({ filter, updateAttribute, facetIdentifier = '', facetKey = '' }) => {
  const { searchTerm, setSearchTerm, searchResults, appliedFilters } = useListingFilter(filter.options, filter.selectType, facetKey)
  const filterData = useSelector(state => state.configuration.filtering.filterDataShowCounts)
  const [updateCount, setUpdateCount] = useState(filterData)
  const { t } = useTranslation()
  if (!filter.options.length) return null

  return (
    <div className="filter-list-container mt-4">
      <FacetHeading name={filter.name} value={facetKey} />

      <FacetSearch facetKey={facetKey} searchTerm={searchTerm} search={setSearchTerm} />
      <div className={`filter-items-list pt-2 ps-2 pe-3 listingFilter ${facetKey}-list`} style={{ maxHeight: '12rem', overflowY: 'auto', overflowX: 'hidden' }}>
        {searchResults &&
          searchResults.map((facet, index) => {
            if (index + 1 > updateCount) return null
            return <AttributeList appliedFilters={appliedFilters} facetKeyName={facetIdentifier} filterName={filter.name} facet={facet} key={facet.id || facet.name} facetKey={facetKey} updateAttribute={updateAttribute} />
          })}

        {searchResults.length > updateCount && (
          <button className="link-button small mb-2" onClick={() => setUpdateCount(updateCount + filterData)}>
            {t('frontend.product.select_more')}
          </button>
        )}
      </div>
    </div>
  )
}

export { FacetFilter, AttributeList }
