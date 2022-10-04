import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useGetBlogPosts } from '../'

const useBlogPage = () => {
  let [request, setRequest] = useGetBlogPosts()
  const { pathname, search } = useLocation()
  const params = queryString.parse(search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  const currentPage = params['currentPage'] || 1
  let navigate = useNavigate()
  const countOnPage = 4

  const setPage = pageNumber => {
    params['currentPage'] = pageNumber
    navigate(`${pathname}?${queryString.stringify(params, { arrayFormat: 'comma' })}`)
  }

  //TODO: Double check
  useEffect(() => {
    let didCancel = false
    const params = queryString.parse(search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
    if (!request.isFetching && !request.isLoaded && !didCancel) {
      setRequest({ ...request, isFetching: true, isLoaded: false, params: { currentPage, skip: currentPage === '1' ? 0 : (currentPage - 1) * countOnPage, limit: countOnPage, category: params.category && [params.category] }, makeRequest: true })
    }
    return () => {
      didCancel = true
    }
  }, [request, setRequest, countOnPage, currentPage, search])

  useEffect(() => {
    const newParams = queryString.parse(search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
    const skip = newParams.currentPage === '1' ? 0 : (newParams.currentPage ? newParams.currentPage - 1 : 1 - 1) * countOnPage
    setRequest({ ...request, isFetching: true, isLoaded: false, params: { currentPage: newParams.currentPage, skip, limit: countOnPage, category: newParams.category && [newParams.category] }, makeRequest: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search])

  return { request, currentPage, countOnPage, setPage }
}

export { useBlogPage }
