import { ListingToolBar, ListingSidebar, ListingPagination, ListingGrid, CategoryList, ListingViewToggle, ListingListView, LISTING, GRID, ListingBanner } from '../../components'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useCategory, useListing } from '../../hooks'
import { useState } from 'react'
import DynamicPage from '../DynamicPage/DynamicPage'
import { useElementContext } from '../../contexts'

const Category = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { categoryRequest, categoryData, categoryListRequest, crumbCalculator, categoryRoute, isError, errorMessage } = useCategory()

  return (
    <DynamicPage ignoreLayout={true}>
      {!!categoryData?.settings?.categoryHTMLTitleString && <Helmet title={categoryData?.settings?.categoryHTMLTitleString} />}
      <ListingBanner crumbs={crumbCalculator()} heading={categoryData?.categoryName} images={[categoryData?.imagePath]} description={categoryData?.categoryDescription} type="category" />

      {isError && (
        <div className="container bg-light box-shadow-lg rounded-lg p-5">
          <div className="row">
            <div className="alert alert-info" role="alert">
              {errorMessage}
            </div>
          </div>
        </div>
      )}

      <CategoryList
        isFetching={categoryListRequest.isFetching || !categoryRequest.isLoaded}
        onSelect={urlTitle => {
          navigate(`/${categoryRoute}/${urlTitle}`)
        }}
        data={categoryData}
      />
      {(!categoryData?.children || categoryData?.children?.length === 0) && <CategorySearchListing category={id} />}
    </DynamicPage>
  )
}

const CategorySearchListing = ({ category }) => {
  const { SkuCard, ProductCard, ProductRow, SkuRow } = useElementContext()
  const loc = useLocation()
  const path = loc.pathname.split('/').reverse()
  const [preFilter] = useState({
    category_slug: path?.at(0),
  })
  const [hide] = useState('category')
  const { records, isFetching, potentialFilters, total, totalPages, setSort, updateAttribute, setPage, setKeyword, params, config } = useListing(preFilter)
  const [viewMode, setViewMode] = useState(config.viewMode || LISTING)
  const content = useSelector(state => state.content[loc.pathname.substring(1)])

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

export default Category
