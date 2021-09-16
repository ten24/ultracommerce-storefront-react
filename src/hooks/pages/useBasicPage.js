import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useGetProducts } from '../'
import queryString from 'query-string'
import { useGetProductsByEntityModified } from '../useAPI'

const useBasicPage = () => {
  let loc = useLocation()
  let params = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const cmsProvider = useSelector(state => state.configuration.cmsProvider)

  const [path, setPath] = useState(loc.search)
  let [request, setRequest] = useGetProducts(params)
  let [cmsProducts, setCmsProducts] = useGetProductsByEntityModified(params)

  const setPage = pageNumber => {
    params['currentPage'] = pageNumber
    request.data.currentPage = pageNumber
    setRequest({ ...request, params: { currentPage: pageNumber, content_id: content.contentID, includePotentialFilters: false }, makeRequest: true, isFetching: true, isLoaded: false })
  }

  useEffect(() => {
    let didCancel = false
    if (!didCancel && ((!request.isFetching && !request.isLoaded) || loc.search !== path) && content.productListingPageFlag && cmsProvider === 'slatwallCMS') {
      setPath(loc.search)
      setRequest({ ...request, params: { ...params, pageSize: 100, content_id: content.contentID, includePotentialFilters: false }, makeRequest: true, isFetching: true, isLoaded: false })
    }
    if (!didCancel && ((!cmsProducts.isFetching && !cmsProducts.isLoaded) || loc.search !== path) && content.productListingPageFlag && cmsProvider !== 'slatwallCMS' && content.product) {
      setPath(loc.search)
      setCmsProducts({
        ...cmsProducts,
        params: {
          'f:publishedFlag': 1,
          'f:productID:in': content.product.products.join(','),
          pageSize: 100,
        },
        makeRequest: true,
        isFetching: true,
        isLoaded: false,
      })
    }
    return () => {
      didCancel = true
    }
  }, [request, setRequest, params, loc, path, content, cmsProvider, setCmsProducts, cmsProducts])

  if (cmsProvider !== 'slatwallCMS') {
    request = {
      ...cmsProducts,
      data: {
        pageRecords: cmsProducts.data,
      },
    }
  }
  return { content: { isMarkup: true, ...content }, setPage, request }
}

export { useBasicPage }
