import { Helmet } from 'react-helmet'
import { Layout, BrandBanner, ListingToolBar, ListingSidebar, ListingGrid, ListingPagination } from '../../components'
import { useBrand, useListing } from '../../hooks'
import { useState } from 'react'
import { useLocation } from 'react-router'
import { useSelector } from 'react-redux'

const Brand = () => {
  const { brandResponse, slug, subHeading } = useBrand()
  return (
    <Layout>
      {!!brandResponse.data[0]?.settings?.brandHTMLTitleString && <Helmet title={brandResponse.data[0]?.settings?.brandHTMLTitleString} />}
      <BrandBanner subHeading={subHeading} brandName={brandResponse?.data[0]?.brandName} images={brandResponse?.data[0]?.images} brandDescription={brandResponse?.data[0]?.brandDescription} />

      {brandResponse.isLoaded && brandResponse.data.length > 0 && <BrandSearchListing brandSlug={slug} />}
    </Layout>
  )
}

const BrandSearchListing = ({ brandSlug }) => {
  const [hide] = useState('brands')
  const [preFilter] = useState({
    brand_slug: brandSlug,
  })
  const loc = useLocation()
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const { records, isFetching, potentialFilters, total, totalPages, setSort, updateAttribute, setPage, setKeyword, params } = useListing(preFilter)

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
        <div className="row mt-3">
          <ListingSidebar isFetching={isFetching} hide={hide} filtering={potentialFilters} recordsCount={total} keyword={params['keyword']} setKeyword={setKeyword} updateAttribute={updateAttribute} />
          <ListingGrid isFetching={isFetching} pageRecords={records} />
        </div>
        <ListingPagination recordsCount={total} currentPage={params['currentPage']} totalPages={totalPages} setPage={setPage} />
      </div>
    </>
  )
}
export default Brand
