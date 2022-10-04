import { Helmet } from 'react-helmet'
import { Layout, ListingBanner, ListingToolBar, ListingSidebar, ListingGrid, ListingListView, ListingPagination, ListingViewToggle, SkuCard, ProductRow, SkuRow, ProductCard, LISTING, GRID } from '../../components'
import { useBrand, useListing } from '../../hooks'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Brand = () => {
  const { brandResponse, slug, subHeading } = useBrand()
  console.log('brandResponse', brandResponse)
  return (
    <Layout>
      {!!brandResponse.data?.at(0)?.settings?.brandHTMLTitleString && <Helmet title={brandResponse.data?.at(0)?.settings?.brandHTMLTitleString} />}
      <ListingBanner subHeading={subHeading} heading={brandResponse?.data?.at(0)?.brandName} images={brandResponse?.data?.at(0)?.images} description={brandResponse?.data?.at(0)?.brandDescription} />

      {brandResponse.isLoaded && brandResponse.data.length > 0 && <BrandSearchListing brandSlug={slug} />}
    </Layout>
  )
}

const BrandSearchListing = ({ brandSlug }) => {
  const [preFilter] = useState({
    brand_slug: brandSlug,
  })
  const [hide] = useState('brands')
  const loc = useLocation()
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const { records, isFetching, potentialFilters, total, totalPages, setSort, updateAttribute, setPage, setKeyword, params, config } = useListing(preFilter)
  const [viewMode, setViewMode] = useState(config.viewMode || LISTING)

  return (
    <>
      <div className="bg-lightgray py-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center">
            <h1 className="h3 text-dark mb-0 font-accent text-capitalize">{content?.title}</h1>
          </div>
        </div>
      </div>
      <div className="container product-listing mb-5">
        <ListingToolBar hide={hide} {...potentialFilters} removeFilter={updateAttribute} setSort={setSort} />
        <ListingViewToggle config={config} viewMode={viewMode} setViewMode={setViewMode} />
        <div className="row mt-3">
          <ListingSidebar isFetching={isFetching} hide={hide} filtering={potentialFilters} recordsCount={total} keyword={params['keyword']} setKeyword={setKeyword} updateAttribute={updateAttribute} />
          {viewMode === LISTING && <ListingListView Card={config?.params?.productsListingFlag ? ProductRow : SkuRow} config={config} isFetching={isFetching} pageRecords={records} />}
          {viewMode === GRID && <ListingGrid Card={config?.params?.productsListingFlag ? ProductCard : SkuCard} config={config} isFetching={isFetching} pageRecords={records} />}
        </div>
        <ListingPagination recordsCount={total} currentPage={params['currentPage']} totalPages={totalPages} setPage={setPage} />
      </div>
    </>
  )
}
export default Brand
