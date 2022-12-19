import { ListingToolBar, ListingSidebar, ListingViewToggle, ListingPagination, ListingGrid, ListingListView } from '../../components'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useListing } from '../../hooks'
import { useState } from 'react'
import { useLocation } from 'react-router'
import DynamicPage from '../DynamicPage/DynamicPage'
import { useElementContext } from '../../contexts'
const preFilter = {}
const GRID = 'GRID'
const LISTING = 'LISTING'

const ProductSearch = () => {
  const { SkuCard, ProductCard, ProductRow, SkuRow } = useElementContext()
  const { records, isFetching, potentialFilters, total, totalPages, setSort, updateAttribute, setPage, setKeyword, params, config } = useListing(preFilter, 'productListing')
  const [viewMode, setViewMode] = useState(config.viewMode || LISTING)
  const loc = useLocation()
  const { t } = useTranslation()
  const siteName = useSelector(state => state.configuration.site.siteName)
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const hide = []

  return (
    <DynamicPage ignoreLayout={true}>
      <Helmet title={`${t('frontend.header.shop')} - ${siteName}`} />
      <div className="bg-lightgray py-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center">
            <h1 className="h3 text-dark mb-0 font-accent text-capitalize">{content?.title || t('frontend.header.shopStore')}</h1>
          </div>
        </div>
      </div>
      <div className="container product-listing mb-5">
        <ListingToolBar hide={hide} {...potentialFilters} removeFilter={updateAttribute} setSort={setSort} recordsCount={total} />
        <ListingViewToggle config={config} viewMode={viewMode} setViewMode={setViewMode} />
        <div className="row mt-3">
          <ListingSidebar isFetching={isFetching} hide={hide} filtering={potentialFilters} recordsCount={total} keyword={params['keyword']} setKeyword={setKeyword} updateAttribute={updateAttribute} />
          {viewMode === LISTING && <ListingListView Card={config?.params?.productsListingFlag ? ProductRow : SkuRow} config={config} isFetching={isFetching} pageRecords={records} />}
          {viewMode === GRID && <ListingGrid Card={config?.params?.productsListingFlag ? ProductCard : SkuCard} config={config} isFetching={isFetching} pageRecords={records} />}
        </div>
        <ListingPagination recordsCount={total} currentPage={params['currentPage']} totalPages={totalPages} setPage={setPage} />
      </div>
    </DynamicPage>
  )
}
export default ProductSearch
