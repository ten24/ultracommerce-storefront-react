import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useGetBlogPosts } from '../'

const useBlogPage = () => {
  let [request, setRequest] = useGetBlogPosts()
  const loc = useLocation()
  const params = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  const currentPage = params['currentPage'] || 1
  let history = useHistory()
  const countOnPage = 4

  const setPage = pageNumber => {
    params['currentPage'] = pageNumber
    history.push({
      pathname: loc.pathname,
      search: queryString.stringify(params, { arrayFormat: 'comma' }),
    })
  }

  useEffect(() => {
    let didCancel = false
    const params = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
    if (!request.isFetching && !request.isLoaded && !didCancel) {
      setRequest({ ...request, isFetching: true, isLoaded: false, params: { skip: currentPage === '1' ? 0 : (currentPage - 1) * countOnPage, limit: countOnPage, category: params.category && [params.category] }, makeRequest: true })
    }
    history.listen(location => {
      const newParams = queryString.parse(location.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
      const skip = newParams.currentPage === '1' ? 0 : (newParams.currentPage ? newParams.currentPage - 1 : 1 - 1) * countOnPage
      setRequest({ ...request, isFetching: true, isLoaded: false, params: { skip, limit: countOnPage, category: newParams.category && [newParams.category] }, makeRequest: true })
    })
    return () => {
      didCancel = true
    }
  }, [request, setRequest, countOnPage, currentPage, history, loc])

  return { request, currentPage, countOnPage, setPage }
}

export { useBlogPage }
