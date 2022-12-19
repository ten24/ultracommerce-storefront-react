import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useCategory, useListing } from '../../hooks'
import { SearchListingStack, CategoryList, ListingBanner } from '..'

const CategorySearchListing = props => {
  const { id } = useParams()
  const loc = useLocation()
  const path = loc.pathname.split('/').reverse()
  const navigate = useNavigate()
  const { categoryRequest, categoryData, categoryListRequest, crumbCalculator, categoryRoute, isError, errorMessage } = useCategory()

  return (
    <>
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
      {(!categoryData?.children || categoryData?.children?.length === 0) && (
        <>
          <div className="bg-lightgray py-4">
            <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
              <div className="order-lg-1 pr-lg-4 text-center">{/* <h1 className="h3 text-dark mb-0 font-accent text-capitalize">{content?.title}</h1> */}</div>
            </div>
          </div>
          <DelaySearchListingStack
            hide="category"
            {...props}
            preFilter={{
              category_slug: path?.at(0),
            }}
            category={id}
          />
        </>
      )}
    </>
  )
}

// This is just so we dont call the listing api untill we have a leaf category
const DelaySearchListingStack = props => {
  const searchListingData = useListing(props.preFilter, props.searchConfig)
  return <SearchListingStack searchListingData={searchListingData} {...props} />
}

export { CategorySearchListing }
