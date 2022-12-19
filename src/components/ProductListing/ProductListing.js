import { useEffect } from 'react'
import { useGetProducts } from '../../hooks'
import { ListingGrid } from '../Listing/ListingGrid'
import { ListingPagination } from '../Listing/ListingPagination'

const ProductListing = ({ contentID }) => {
  let [request, setRequest] = useGetProducts({})
  const setPage = pageNumber => {
    // params['currentPage'] = pageNumber
    // request.data.currentPage = pageNumber
    setRequest({ ...request, params: { currentPage: pageNumber, content_id: contentID, includePotentialFilters: false }, makeRequest: true, isFetching: true, isLoaded: false })
  }
  useEffect(() => {
    let didCancel = false
    if (!didCancel && !request.isFetching && !request.isLoaded) {
      setRequest({ ...request, params: { pageSize: 100, content_id: contentID, includePotentialFilters: false }, makeRequest: true, isFetching: true, isLoaded: false })
    }
    return () => {
      didCancel = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, setRequest])

  return (
    <div className="">
      <ListingGrid isFetching={request.isFetching} pageRecords={request.data.pageRecords} />
      <ListingPagination recordsCount={request.data.recordsCount} currentPage={request.data.currentPage} totalPages={request.data.totalPages} setPage={setPage} />
    </div>
  )
}
export { ProductListing }
