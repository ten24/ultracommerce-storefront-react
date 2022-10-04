import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { ListingPagination, SimpleImage } from '../../components'
import { useGetEntityWithPagination, useUtilities } from '../../hooks'
import { Link } from 'react-router-dom'
import { getBrandRoute } from '../../selectors'
import queryString from 'query-string'
import DynamicPage from '../DynamicPage/DynamicPage'

const Manufacturer = () => {
  let { eventHandlerForWSIWYG } = useUtilities()
  const navigate = useNavigate()
  let loc = useLocation()
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const brandRoute = useSelector(getBrandRoute)
  const { contentBody } = content || {}
  const { maxCount } = useSelector(state => state.configuration.shopByManufacturer)
  let { currentPage = 1 } = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  let { isFetching, records, totalRecords, totalPages } = useGetEntityWithPagination('brand', currentPage, maxCount, 'brandFeatured|desc,brandName|asc', '{"includeImages":true}')

  return (
    <DynamicPage>
      <div className="container pb-4 pb-sm-5">
        {!contentBody && (
          <div
            className="content-body"
            onClick={eventHandlerForWSIWYG}
            dangerouslySetInnerHTML={{
              __html: contentBody || '',
            }}
          />
        )}
        <div className="row pt-4">
          {!isFetching &&
            records?.map(brand => {
              return (
                <div key={brand.brandID} className="col-6 col-md-4 col-lg-3 col-xl-2 d-flex mb-4">
                  <div className="card border-0">
                    <Link className="d-block overflow-hidden rounded-lg " to={`/${brandRoute}/${brand.urlTitle}`}>
                      <SimpleImage className="d-block w-100" src={brand.images && brand.images?.at(0)} alt={brand.brandName} type="brand" />
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
            navigate({
              pathname: loc.pathname,
              search: `?currentPage=${pageNumber}`,
            })
          }}
        />
      </div>
    </DynamicPage>
  )
}

export default Manufacturer
