import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useGetProducts } from '../'
import queryString from 'query-string'
import { useGetProductsByEntityModified } from '../useAPI'

const useBasicPage = () => {
  const cmsProvider = useSelector(state => state.configuration.cmsProvider)
  let { pathname, search } = useLocation()
  let params = queryString.parse(search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  const pageData = useSelector(state => state.content[pathname.substring(1)] || {})

  const [path, setPath] = useState(search)
  let [request, setRequest] = useGetProducts(params)
  let [cmsProducts, setCmsProducts] = useGetProductsByEntityModified(params)
  const setPage = pageNumber => {
    params['currentPage'] = pageNumber
    request.data.currentPage = pageNumber
    setRequest({ ...request, params: { currentPage: pageNumber, content_id: pageData.contentID, includePotentialFilters: false }, makeRequest: true, isFetching: true, isLoaded: false })
  }

  useEffect(() => {
    let didCancel = false
    if (!didCancel && ((!request.isFetching && !request.isLoaded) || search !== path) && pageData?.productListingPageFlag && cmsProvider === 'slatwallCMS') {
      setPath(search)
      setRequest({ ...request, params: { ...params, pageSize: 100, content_id: pageData.contentID, includePotentialFilters: false }, makeRequest: true, isFetching: true, isLoaded: false })
    }
    if (!didCancel && ((!cmsProducts.isFetching && !cmsProducts.isLoaded) || search !== path) && pageData?.productListingPageFlag && cmsProvider !== 'slatwallCMS' && pageData?.product) {
      setPath(search)
      setCmsProducts({
        ...cmsProducts,
        params: {
          'f:publishedFlag': 1,
          'f:productID:in': pageData?.product?.products?.join(','),
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
  }, [request, setRequest, params, search, path, pageData, cmsProvider, setCmsProducts, cmsProducts])

  if (cmsProvider !== 'slatwallCMS') {
    request = {
      ...cmsProducts,
      data: {
        pageRecords: cmsProducts.data,
      },
    }
  }
  return { content: { isMarkup: true, ...pageData }, setPage, request }
}

export { useBasicPage }
