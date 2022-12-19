import { useState } from 'react'
import { ListingToolBar, ListingPagination, ListingGrid, ListingViewToggle, ListingListView, LISTING, GRID } from '../../components'
import { useElementContext } from '../../contexts/ElementContextProvider'

const SearchListingStack = ({ searchListingData, searchConfig, cardDisplayConfigurations, hide = '' }) => {
  const { ListingSidebar } = useElementContext()
  const { records, isFetching, potentialFilters, total, totalPages, setSort, updateAttribute, setPage, setKeyword, params } = searchListingData
  const [viewMode, setViewMode] = useState(searchConfig.viewMode || LISTING)

  return (
    <div className="container product-listing mb-5 py-5">
      <ListingToolBar config={searchConfig} {...potentialFilters} removeFilter={updateAttribute} setSort={setSort} recordsCount={total} />
      <ListingViewToggle config={searchConfig} viewMode={viewMode} setViewMode={setViewMode} />
      <div className="row mt-3">
        <ListingSidebar config={searchConfig} isFetching={isFetching} hide={hide} filtering={potentialFilters} recordsCount={total} keyword={params['keyword']} setKeyword={setKeyword} updateAttribute={updateAttribute} />
        {viewMode === LISTING && <ListingListView config={searchConfig} isFetching={isFetching} pageRecords={records} />}
        {viewMode === GRID && <ListingGrid cardDisplayConfigurations={cardDisplayConfigurations} config={searchConfig} isFetching={isFetching} pageRecords={records} />}
      </div>
      <ListingPagination recordsCount={total} currentPage={params['currentPage']} totalPages={totalPages} setPage={setPage} />
    </div>
  )
}

export { SearchListingStack }
