import { NoProductFound } from '..'
import { BulkOrderProductCard } from './BulkOrderProductCard'
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

const BulkOrderListingGridView = ({ isFetching, pageRecords, setBulkOrderList, bulkOrderList }) => {
  return (
    <div className="col">
      {isFetching && (
        <>
          <ListingGridLoader /> <ListingGridLoader /> <ListingGridLoader />
        </>
      )}
      <div className="product-grid">
        {!isFetching &&
          pageRecords?.map((product, index) => {
            return (
              <div key={`${product.productName}${index}`} className="mb-4">
                <BulkOrderProductCard productData={product} setBulkOrderList={setBulkOrderList} bulkOrderList={bulkOrderList} />
              </div>
            )
          })}
      </div>
      {!isFetching && pageRecords.length === 0 && <NoProductFound />}
    </div>
  )
}
export { BulkOrderListingGridView }
