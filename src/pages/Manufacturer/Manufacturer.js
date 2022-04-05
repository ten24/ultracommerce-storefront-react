import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { Layout, ListingPagination, SimpleImage } from '../../components'
import { useGetEntityWithPagination, useUtilities } from '../../hooks'
import { Link } from 'react-router-dom'
import { getBrandRoute } from '../../selectors'
import queryString from 'query-string'

const Manufacturer = () => {
  let { eventHandlerForWSIWYG } = useUtilities()
  const history = useHistory()
  let loc = useLocation()
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const brandRoute = useSelector(getBrandRoute)
  const { title, contentBody } = content || {}
  const { maxCount } = useSelector(state => state.configuration.shopByManufacturer)
  let { currentPage = 1 } = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  let { isFetching, records, totalRecords, totalPages } = useGetEntityWithPagination('brand', currentPage, maxCount, 'brandFeatured|desc,brandName|asc', '{"includeImages":true}')

  return (
    <Layout>
      <div className="bg-light p-0">
        <div className="bg-lightgray pt-4">
          <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
            <div className="order-lg-1 pr-lg-4 text-center w-100">
              <h1 className="h3 text-dark mb-0 font-accent">{title || ''}</h1>
            </div>
          </div>
        </div>
        <div className="container bg-light box-shadow-lg rounded-lg p-5 pt-0">
          {!contentBody && (
            <div
              className="content-body"
              onClick={eventHandlerForWSIWYG}
              dangerouslySetInnerHTML={{
                __html: contentBody || '',
              }}
            />
          )}
          <div className="container pb-4 pb-sm-5">
            <div className="row pt-4">
              {!isFetching &&
                records.length &&
                records.map(brand => {
                  return (
                    <div key={brand.brandID} className="col-6 col-md-4 col-lg-3 col-xl-2 d-flex mb-4">
                      <div className="card border-0">
                        <Link className="d-block overflow-hidden rounded-lg " to={`/${brandRoute}/${brand.urlTitle}`}>
                          <SimpleImage className="d-block w-100" src={brand.images && brand.images[0]} alt={brand.brandName} type="brand" />
                          <h2 className="h6 link my-2 pb-2 mx-2 text-center">{brand.brandName}</h2>
                        </Link>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
          <div className="container pb-4 pb-sm-5">
            <ListingPagination
              recordsCount={totalRecords}
              currentPage={currentPage}
              totalPages={totalPages}
              setPage={pageNumber => {
                history.push({
                  pathname: loc.pathname,
                  search: `?currentPage=${pageNumber}`,
                })
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Manufacturer
