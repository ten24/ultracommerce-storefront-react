import { Layout, ListingToolBar, ListingSidebar, ListingPagination, ListingGrid, ListingListView } from '../../components'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useListing } from '../../hooks'
import { useState } from 'react'
import { useLocation } from 'react-router'
const preFilter = {}
const GRID = 'GRID'
const LISTING = 'LISTING'

const Search = () => {
  const [viewMode] = useState(GRID)
  const loc = useLocation()
  const { t } = useTranslation()
  const siteName = useSelector(state => state.configuration.site.siteName)
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const hide = []
  const { records, isFetching, potentialFilters, total, totalPages, setSort, updateAttribute, setPage, setKeyword, params } = useListing(preFilter)

  return (
    <Layout>
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
        <div className="row mt-3">
          <ListingSidebar isFetching={isFetching} hide={hide} filtering={potentialFilters} recordsCount={total} keyword={params['keyword']} setKeyword={setKeyword} updateAttribute={updateAttribute} />
          {viewMode === LISTING && <ListingListView isFetching={isFetching} pageRecords={records} />}
          {viewMode === GRID && <ListingGrid isFetching={isFetching} pageRecords={records} />}
        </div>
        <ListingPagination recordsCount={total} currentPage={params['currentPage']} totalPages={totalPages} setPage={setPage} />
      </div>
    </Layout>
  )
}
export default Search
