import { NoProductFound, Spinner } from '../../components'
import { ProductRow } from './ProductRow'

const ProductListingListView = ({ isFetching, pageRecords }) => {
  return (
    <>
      {isFetching && <Spinner />}
      {!isFetching && (
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Product:</th>
              <th scope="col">Brand:</th>
              <th scope="col">Price:</th>
              <th scope="col">QTY:</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {!isFetching &&
              pageRecords.length > 0 &&
              pageRecords.map((product, index) => {
                return <ProductRow key={index} product={product} />
              })}
          </tbody>
        </table>
      )}

      {!isFetching && pageRecords.length === 0 && <NoProductFound />}
    </>
  )
}

export { ProductListingListView }
