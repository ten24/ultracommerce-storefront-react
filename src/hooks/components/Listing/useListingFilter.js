import { useEffect, useState } from 'react'
import queryString from 'query-string'
import { useLocation } from 'react-use'

const useListingFilter = (options, selectType, facetKey) => {
  const loc = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const getAppliedFilters = facetKey => {
    const qs = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
    if (qs[facetKey]) {
      return Array.isArray(qs[facetKey]) ? qs[facetKey] : [qs[facetKey]]
    }
    return []
  }
  const appliedFilters = getAppliedFilters(facetKey)
  useEffect(() => {
    let results = options
    if (searchTerm.length) {
      results = options.filter(option => option.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (selectType === 'single') {
      const selectedResults = options.filter(option => {
        return appliedFilters.includes(option.name)
      })
      if (selectedResults.length !== 0) {
        results = selectedResults
      }
    }
    setSearchResults([...results])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, options])
  return { searchTerm, setSearchTerm, searchResults, appliedFilters }
}

export { useListingFilter }
