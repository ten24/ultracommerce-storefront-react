import { useHistory, useParams } from 'react-router-dom'
import { Layout, ProductTypeList, PageHeader, ListingToolBar, ListingSidebar, ListingGrid, ListingPagination } from '../../components'
import { Helmet } from 'react-helmet'
import { useProductType, useListing } from '../../hooks'
import { useState } from 'react'
import { useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const ProductType = () => {
  const { id } = useParams()
  const history = useHistory()
  const { productTypeRequest, productTypeData, productTypeListRequest, crumbCalculator, productTypeRoute, isError, errorMessage } = useProductType()
  return (
    <Layout>
      {productTypeRequest.isLoaded && <Helmet title={productTypeRequest.data?.settings?.productHTMLTitleString} />}
      <PageHeader title={productTypeData?.productTypeName} crumbs={crumbCalculator()} />
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
          history.push(`/${productTypeRoute}/${urlTitle}`)
        }}
        data={productTypeData}
      />
      {productTypeData?.childProductTypes?.length === 0 && <ProductTypeSearchListing productType={id} />}
    </Layout>
  )
}

const ProductTypeSearchListing = ({ productType }) => {
  const [hide] = useState('productType')
  const [preFilter] = useState({
    productType_slug: productType,
  })
  const loc = useLocation()
  const { t } = useTranslation()
  const siteName = useSelector(state => state.configuration.site.siteName)
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const { records, isFetching, potentialFilters, total, totalPages, setSort, updateAttribute, setPage, setKeyword, params } = useListing(preFilter)

  return (
    <Layout>
      <Helmet title={`${t('frontend.header.shop')} - ${siteName}`} />
      <div className="bg-lightgray py-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center">
            <h1 className="h3 text-dark mb-0 font-accent text-capitalize">{content?.title}</h1>
          </div>
        </div>
      </div>
      <div className="container product-listing mb-5">
        <ListingToolBar hide={hide} {...potentialFilters} removeFilter={updateAttribute} setSort={setSort} recordsCount={total} />
        <div className="row mt-3">
          <ListingSidebar isFetching={isFetching} hide={hide} filtering={potentialFilters} recordsCount={total} keyword={params['keyword']} setKeyword={setKeyword} updateAttribute={updateAttribute} />
          <ListingGrid isFetching={isFetching} pageRecords={records} />
        </div>
        <ListingPagination recordsCount={total} currentPage={params['currentPage']} totalPages={totalPages} setPage={setPage} />
      </div>
    </Layout>
  )
}

export default ProductType
