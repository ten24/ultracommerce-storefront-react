import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { ListingGrid, ListingPagination } from '../../components'
import { useGetProducts } from '../../hooks'
import queryString from 'query-string'

const BasicPage = () => {
  let history = useHistory()
  let loc = useLocation()
  let params = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const { title, customBody, sections, isMarkup = true } = content || {}
  const [path, setPath] = useState(loc.search)
  let [request, setRequest] = useGetProducts(params)

  const setPage = pageNumber => {
    params['currentPage'] = pageNumber
    request.data.currentPage = pageNumber
    setRequest({ ...request, params: { currentPage: pageNumber, content_id: content.contentID, includePotentialFilters: false }, makeRequest: true, isFetching: true, isLoaded: false })
  }

  useEffect(() => {
    let didCancel = false
    if (!didCancel && ((!request.isFetching && !request.isLoaded) || loc.search !== path) && content.productListingPageFlag === '1') {
      setPath(loc.search)
      setRequest({ ...request, params: { ...params, content_id: content.contentID, includePotentialFilters: false }, makeRequest: true, isFetching: true, isLoaded: false })
    }
    return () => {
      didCancel = true
    }
  }, [request, setRequest, params, loc, path, content])

  return (
    <div className="bg-light p-0">
      <div className="page-title-overlap bg-lightgray pt-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center">
            <h1 className="h3 text-dark mb-0 font-accent">{title || ''}</h1>
          </div>
        </div>
      </div>
      <div className="container bg-light box-shadow-lg rounded-3 p-5">
        {isMarkup && (
          <div
            className="content-body"
            onClick={event => {
              event.preventDefault()
              if (event.target.getAttribute('href')) {
                history.push(event.target.getAttribute('href'))
              }
            }}
            dangerouslySetInnerHTML={{
              __html: customBody || '',
            }}
          />
        )}
        {!isMarkup &&
          sections &&
          sections.map(({ title, text, imageUrl }) => {
            return (
              <div key={title}>
                <h2>{title}</h2>
                <div className="row">
                  <div className="col-md-8">{text}</div>
                  <div className="col-md-4">{imageUrl !== '' && <img className="float-end ml-md-2 mb-md-2 about-Img" src={imageUrl} alt={title} />}</div>
                </div>
              </div>
            )
          })}
        {content?.productListingPageFlag === '1' && (
          <>
            <hr />
            <div className="col">
              <ListingGrid isFetching={request.isFetching} pageRecords={request.data.pageRecords} />
              <ListingPagination recordsCount={request.data.recordsCount} currentPage={request.data.currentPage} totalPages={request.data.totalPages} setPage={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BasicPage
