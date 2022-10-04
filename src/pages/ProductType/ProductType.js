import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ListingBanner, ListingToolBar, ProductTypeList, ListingSidebar, ListingPagination, ListingGrid, ListingViewToggle, ListingListView, LISTING, GRID } from '../../components'

import { Helmet } from 'react-helmet'
import { useProductType, useListing } from '../../hooks'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import DynamicPage from '../DynamicPage/DynamicPage'
import { useElementContext } from '../../contexts'

const ProductType = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { productTypeRequest, productTypeData, productTypeListRequest, crumbCalculator, productTypeRoute, isError, errorMessage } = useProductType()
  return (
    <DynamicPage ignoreLayout={true}>
      {productTypeRequest.isLoaded && <Helmet title={productTypeRequest.data?.settings?.productHTMLTitleString} />}
      <ListingBanner crumbs={crumbCalculator()} heading={productTypeData?.productTypeName} images={[productTypeData?.imageFile]} description={productTypeData?.productTypeDescription} type="productType" />
      {isError && (
        <div className="container bg-light box-shadow-lg rounded-lg p-5">
          <div className="row">
            <div className="alert alert-info" role="alert">
              {errorMessage}
            </div>
          </div>
        </div>
      )}

      <ProductTypeList
        isFetching={productTypeListRequest.isFetching || !productTypeRequest.isLoaded}
        onSelect={urlTitle => {
          navigate(`/${productTypeRoute}/${urlTitle}`)
        }}
        data={productTypeData}
      />
      {productTypeData?.childProductTypes?.length === 0 && <ProductTypeSearchListing productType={id} />}
    </DynamicPage>
  )
}

const ProductTypeSearchListing = ({ productType }) => {
  const { SkuCard, ProductCard, ProductRow, SkuRow } = useElementContext()
  const [hide] = useState('productType')
  const [preFilter] = useState({
    productType_slug: productType,
  })
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
        <ListingToolBar hide={hide} {...potentialFilters} removeFilter={updateAttribute} setSort={setSort} recordsCount={total} />
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

export default ProductType
