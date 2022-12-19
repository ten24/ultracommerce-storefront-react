import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useListing, useProductType } from '../../hooks'
import { ListingBanner, ProductTypeList, SearchListingStack } from '..'

const ProductTypeSearchListing = props => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { productTypeRequest, productTypeData, productTypeListRequest, crumbCalculator, productTypeRoute, isError, errorMessage } = useProductType()
  return (
    <>
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
      {productTypeData?.childProductTypes?.length === 0 && (
        <DelaySearchListingStack
          hide="productType"
          preFilter={{
            productType_slug: id,
          }}
          {...props}
        />
      )}
    </>
  )
}

// This is just so we dont call the listing api untill we have a leaf category
const DelaySearchListingStack = props => {
  const searchListingData = useListing(props.preFilter, props.searchConfig)
  return <SearchListingStack searchListingData={searchListingData} {...props} />
}

export { ProductTypeSearchListing }
