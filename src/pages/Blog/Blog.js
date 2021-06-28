import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { Layout, ListingPagination, BlogSidebar, BlogListBody } from '../../components'
import { useGetBlogPosts } from '../../hooks'

const BlogHeading = () => {
  const { t } = useTranslation()
  return (
    <div className="bg-light p-5 mb-4 text-center">
      <h1 className="display-4">{t('frontend.blog.title')}</h1>
      <p className="lead">{t('frontend.blog.subHeading')}</p>
    </div>
  )
}

const Blog = () => {
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
      setRequest({ ...request, isFetching: true, isLoaded: false, params: { skip: currentPage === '1' ? 0 : (currentPage - 1) * countOnPage, limit: countOnPage, category: params.category }, makeRequest: true })
    }
    history.listen(location => {
      const newParams = queryString.parse(location.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
      const skip = newParams.currentPage === '1' ? 0 : (newParams.currentPage ? newParams.currentPage - 1 : 1 - 1) * countOnPage
      setRequest({ ...request, isFetching: true, isLoaded: false, params: { skip, limit: countOnPage, category: newParams.category }, makeRequest: true })
    })
    return () => {
      didCancel = true
    }
  }, [request, setRequest, countOnPage, currentPage, history, loc])

  return (
    <Layout>
      <BlogHeading />
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8 entries">
            {request.isLoaded &&
              request.data.items.map(field => {
                return <BlogListBody key={field.slug} blog={field} />
              })}
            <div className="container pb-4 pb-sm-5">{<ListingPagination recordsCount={request.data.total} currentPage={currentPage} totalPages={Math.ceil(request.data.total / countOnPage)} setPage={setPage} />}</div>
          </div>
          {<BlogSidebar />}
        </div>
      </div>
    </Layout>
  )
}

export default Blog
