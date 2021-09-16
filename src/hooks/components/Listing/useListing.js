import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useGetProductsWithPagination } from '../../../hooks/'
import { processQueryParameters } from '../../../utils'
import { useSelector } from 'react-redux'

const buildPath = params => {
  return queryString.stringify(params, { arrayFormat: 'comma' })
}
const initialData = { brand_slug: '', orderBy: '', pageSize: '12', currentPage: '1', keyword: '', productType_slug: '' }

const useReconcile = ({ option, brand, attribute, category, priceRange, productType }) => {
  const loc = useLocation()
  let core = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  let queryStringParams = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  const evaluation = ({ qs, facetKey, facetIdentifier, filter }) => {
    if (qs[facetKey] && qs[facetKey].length) {
      let params = Array.isArray(qs[facetKey]) ? qs[facetKey] : [qs[facetKey]]
      const missingFilter = params.filter(optionToValidate => (!filter.options.filter(opt => opt[facetIdentifier] === optionToValidate).map(data => data).length ? optionToValidate : false)).filter(data => data)
      if (missingFilter.length > 0) {
        qs[facetKey] = params.filter(param => !missingFilter.includes(param))
        return qs
      }
    }
    return qs
  }

  if (category && category !== {}) {
    ;[category].forEach(filter => {
      queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'name', facetKey: `category` })
    })
  } else {
    Object.keys(queryStringParams)
      .filter(paramKey => paramKey === 'category')
      .forEach(keyToDelete => {
        delete queryStringParams[keyToDelete]
      })
  }
  if (productType && productType !== {}) {
    ;[productType].forEach(filter => {
      queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'slug', facetKey: `productType_slug` })
    })
  }
  if (brand && brand !== {})
    [brand].forEach(filter => {
      queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'slug', facetKey: `brand_slug` })
    })

  if (priceRange && priceRange !== {})
    [priceRange].forEach(filter => {
      queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'value', facetKey: `priceRange` })
    })

  if (attribute && attribute.subFacets) {
    Object.keys(attribute.subFacets).forEach(facetKey => {
      return [attribute.subFacets[facetKey]].forEach(filter => {
        queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'name', facetKey: `attribute_${facetKey}` })
      })
    })
  } else {
    Object.keys(queryStringParams)
      .filter(paramKey => paramKey.includes('attribute_'))
      .forEach(keyToDelete => {
        delete queryStringParams[keyToDelete]
      })
  }

  if (option && option.subFacets) {
    Object.keys(option.subFacets).forEach(facetKey => {
      return [option.subFacets[facetKey]].forEach(filter => {
        queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'name', facetKey: `option_${facetKey}` })
      })
    })
  } else {
    Object.keys(queryStringParams)
      .filter(paramKey => paramKey.includes('option_'))
      .forEach(keyToDelete => {
        delete queryStringParams[keyToDelete]
      })
  }

  return { shouldUpdate: JSON.stringify(queryStringParams) !== JSON.stringify(core), queryStringParams }
}

const useListing = preFilter => {
  const loc = useLocation()
  const productSearch = useSelector(state => state.configuration.productSearch)

  let history = useHistory()
  let params = processQueryParameters(loc.search)
  params = { ...initialData, ...params, ...preFilter }
  const returnFacetList = !!params['brand_slug'] || !!params['productType_slug'] ? 'brand,option,attribute,sorting,priceRange,productType' : 'brand,sorting,productType'

  const cachedFilters = JSON.stringify({ ...params, ...productSearch, returnFacetList })
  let { isFetching, records, potentialFilters, total, totalPages, error } = useGetProductsWithPagination(cachedFilters)
  const { shouldUpdate, queryStringParams } = useReconcile({ ...potentialFilters })
  const setPage = pageNumber => {
    params['currentPage'] = pageNumber
    history.push({
      pathname: loc.pathname,
      search: buildPath(params, { arrayFormat: 'comma' }),
    })
  }
  const setKeyword = keyword => {
    params = { ...initialData, ...preFilter, orderBy: params.orderBy, keyword: keyword }
    history.push({
      pathname: loc.pathname,
      search: buildPath(params, { arrayFormat: 'comma' }),
    })
  }
  const setSort = orderBy => {
    params['orderBy'] = orderBy
    params['currentPage'] = 1
    history.push({
      pathname: loc.pathname,
      search: buildPath(params, { arrayFormat: 'comma' }),
    })
  }
  const updateAttribute = attribute => {
    let attributeFilters = params[attribute.filterName]?.split(',').filter(data => data) || []
    if (attributeFilters.includes(attribute.name)) {
      attributeFilters = attributeFilters.filter(item => item !== attribute.name)
    } else {
      attributeFilters.push(attribute.name)
    }

    params[attribute.filterName] = attributeFilters
    params['currentPage'] = 1

    // This is a check for if we deselct a brand or Poroduct type and need to reset other checked params
    if (Object.keys(params).length >= 6 && !params.brand_slug.length && !params.productType_slug.length) {
      params = { ...initialData, ...preFilter, orderBy: params.orderBy, keyword: params.keyword }
    }
    history.push({
      pathname: loc.pathname,
      search: buildPath(params, { arrayFormat: 'comma' }),
    })
  }

  if (shouldUpdate && !isFetching) {
    const path = queryString.stringify(queryStringParams, { arrayFormat: 'comma' })
    params = processQueryParameters(path)
    history.replace({
      pathname: loc.pathname,
      search: path,
    })
  }

  return { records, potentialFilters, isFetching, total, totalPages, error, setSort, updateAttribute, setPage, setKeyword, params }
}

export { useListing }