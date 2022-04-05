import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { getErrorMessage, processQueryParameters } from '../../../utils'
import { useSelector } from 'react-redux'
import { useDeepCompareEffect } from 'react-use'
import { SlatwalApiService, axios } from '../../../services'
import { useState } from 'react'

const buildPath = params => {
  return queryString.stringify(params, { arrayFormat: 'comma' })
}

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
      queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'slug', facetKey: `category_slug` })
    })
  } else {
    Object.keys(queryStringParams)
      .filter(paramKey => paramKey === 'category_slug')
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

const useListing = (preFilter, type = 'productListing') => {
  let [isFetching, setFetching] = useState(true)
  let [records, setRecords] = useState([])
  let [total, setTotal] = useState(0)
  let [pageSize, setPageSize] = useState(12)
  let [totalPages, setTotalPages] = useState(1)
  let [potentialFilters, setPotentialFilters] = useState({})
  let [error, setError] = useState({ isError: false, message: '' })

  const loc = useLocation()
  let productSearch = useSelector(state => state.configuration.listings.productListing.params)
  let initialData = useSelector(state => state.configuration.listings.productListing.filters)
  let initialForcedFilterOptions = useSelector(state => state.configuration.listings.productListing.forcedFilterOptions)
  let bulkOrder = useSelector(state => state.configuration.listings.bulkOrder.params)
  let initialBulkOrderData = useSelector(state => state.configuration.listings.bulkOrder.filters)
  let initialBulkForcedFilterOptions = useSelector(state => state.configuration.listings.bulkOrder.forcedFilterOptions)
  if (type === 'bulkOrder') {
    productSearch = bulkOrder
    initialData = initialBulkOrderData
    initialData = initialBulkOrderData
    initialForcedFilterOptions = initialBulkForcedFilterOptions
  }
  let history = useHistory()
  let params = processQueryParameters(loc.search)
  params = { ...initialData, ...params, ...preFilter }
  const hasValidFilter =
    !initialForcedFilterOptions?.length ||
    initialForcedFilterOptions.reduce((result, filterKey) => {
      if (params[filterKey]?.length) return true
      return result
    }, false)
  const returnFacetList = hasValidFilter ? 'brand,option,category,attribute,sorting,priceRange,productType' : 'category,brand,sorting,productType'

  const payload = { ...params, ...productSearch, returnFacetList }

  useDeepCompareEffect(() => {
    let source = axios.CancelToken.source()
    setFetching(true)
    SlatwalApiService.products.search(payload, {}, source).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) setError({ isError: true, message: getErrorMessage(response.success().errors) })
      if (response.isSuccess()) {
        const data = response.success().data
        const products = data.products.map(sku => {
          return { ...sku, salePrice: sku.skuPrice, productName: sku.product_productName, urlTitle: sku.product_urlTitle, productCode: sku.product_productCode, imageFile: sku.sku_imageFile, skuID: sku.sku_skuID, skuCode: sku.sku_skuCode }
        })

        setRecords(products)
        setPotentialFilters(data.potentialFilters)
        setTotal(data.total)
        setTotalPages(Math.ceil(data.total / data.pageSize))
        setError({ isError: false, message: '' })
      } else {
        setRecords([])
        setPotentialFilters({})
        setTotal(0)
        setPageSize(12)
        setTotalPages(1)
        setError({ isError: true, message: 'Something was wrong' })
      }
      setFetching(false)
    })

    return () => {
      source.cancel()
    }
  }, [payload])

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

  return { records, pageSize, potentialFilters, isFetching, total, totalPages, error, setSort, updateAttribute, setPage, setKeyword, params }
}

export { useListing }
