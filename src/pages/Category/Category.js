import { Layout, ListingToolBar, ListingSidebar, ListingPagination, ListingGrid, PageHeader, CategoryList } from '../../components'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation, useParams } from 'react-router'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useCategory, useListing } from '../../hooks'
import { useState } from 'react'

const Category = () => {
  const { id } = useParams()
  const history = useHistory()
  const { categoryRequest, categoryData, categoryListRequest, crumbCalculator, categoryRoute, isError, errorMessage } = useCategory()
  return (
    <Layout>
      {categoryRequest.isLoaded && <Helmet title={categoryRequest?.data?.settings?.productHTMLTitleString} />}
      <PageHeader title={categoryRequest?.data?.categoryName} crumbs={crumbCalculator()} />
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
          history.push(`/${categoryRoute}/${urlTitle}`)
        }}
        data={categoryData}
      />
      {(!categoryData?.children || categoryData?.children?.length === 0) && <CategorySearchListing category={id} />}
    </Layout>
  )
}

const CategorySearchListing = ({ category }) => {
  const [hide] = useState('category')
  const loc = useLocation()
  const path = loc.pathname.split('/').reverse()
  const [preFilter] = useState({
    category_slug: path[0],
  })
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
        <ListingToolBar hide={hide} {...potentialFilters} removeFilter={updateAttribute} setSort={setSort} />
        <div className="row mt-3">
          <ListingSidebar isFetching={isFetching} hide={hide} filtering={potentialFilters} recordsCount={total} keyword={params['keyword']} setKeyword={setKeyword} updateAttribute={updateAttribute} />
          <ListingGrid isFetching={isFetching} pageRecords={records} />
        </div>
        <ListingPagination recordsCount={total} currentPage={params['currentPage']} totalPages={totalPages} setPage={setPage} />
      </div>
    </Layout>
  )
}

export default Category
