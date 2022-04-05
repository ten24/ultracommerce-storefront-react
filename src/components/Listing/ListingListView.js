import { NoProductFound } from '..'
import ContentLoader from 'react-content-loader'

const ListingGridLoader = props => (
  <ContentLoader viewBox="0 0 1200 500" className="listingGridLoader" {...props}>
    <rect x="100" y="20" rx="8" ry="8" width="300" height="300" />
    <rect x="100" y="350" rx="0" ry="0" width="300" height="32" />
    <rect x="100" y="400" rx="0" ry="0" width="180" height="36" />

    <rect x="500" y="20" rx="8" ry="8" width="300" height="300" />
    <rect x="500" y="350" rx="0" ry="0" width="300" height="36" />
    <rect x="500" y="400" rx="0" ry="0" width="180" height="30" />

    <rect x="900" y="20" rx="8" ry="8" width="300" height="300" />
    <rect x="900" y="350" rx="0" ry="0" width="300" height="32" />
    <rect x="900" y="400" rx="0" ry="0" width="180" height="36" />
  </ContentLoader>
)

const ListingListView = ({ isFetching, pageRecords }) => {
  return (
    <div className="col">
      {isFetching && (
        <>
          <ListingGridLoader /> <ListingGridLoader /> <ListingGridLoader />
        </>
      )}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Product Name</th>
            <th scope="col">Sku Code</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {!isFetching &&
            pageRecords.length > 0 &&
            pageRecords.map((product, index) => {
              return (
                <tr key={`${product.productName}${index}`}>
                  <td>{product.productName}</td>
                  <td>{product.skuCode}</td>
                  <td>
                    <button>View</button>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>

      {!isFetching && pageRecords.length === 0 && <NoProductFound />}
    </div>
  )
}
export { ListingListView }
