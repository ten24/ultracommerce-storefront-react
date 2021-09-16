import { ListingSidebar, ListingPagination, ListingToolBar, ListingGrid } from '..'
import { useListing } from '../../hooks/'

const Listing = ({ preFilter, hide = [] }) => {
  const { records, isFetching, potentialFilters, total, totalPages, setSort, updateAttribute, setPage, setKeyword, params } = useListing(preFilter)
  const products = records.map(sku => {
    return { ...sku, salePrice: sku.skuPrice, productName: sku.product_productName, urlTitle: sku.product_urlTitle, productCode: sku.product_productCode, imageFile: sku.sku_imageFile, skuID: sku.sku_skuID, skuCode: sku.sku_skuCode }
  })

  return (
    <div className="container product-listing mb-5">
      <ListingToolBar hide={hide} {...potentialFilters} removeFilter={updateAttribute} setSort={setSort} />
      <div className="row mt-3">
        <ListingSidebar isFetching={isFetching} hide={hide} filtering={potentialFilters} recordsCount={total} keyword={params['keyword']} setKeyword={setKeyword} updateAttribute={updateAttribute} />
        <ListingGrid isFetching={isFetching} pageRecords={products} />
      </div>
      <ListingPagination recordsCount={total} currentPage={params['currentPage']} totalPages={totalPages} setPage={setPage} />
    </div>
  )
}

export { Listing }
