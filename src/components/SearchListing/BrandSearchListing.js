import { Helmet } from 'react-helmet'
import { useElementContext } from '../../contexts/ElementContextProvider'
import { useBrand, useListing } from '../../hooks'

const BrandSearchListing = props => {
  const { ListingBanner } = useElementContext()
  const { brandResponse, slug, subHeading } = useBrand()
  return (
    <>
      {!!brandResponse.data?.at(0)?.settings?.brandHTMLTitleString && <Helmet title={brandResponse.data?.at(0)?.settings?.brandHTMLTitleString} />}
      <ListingBanner subHeading={subHeading} heading={brandResponse?.data?.at(0)?.brandName} images={brandResponse?.data?.at(0)?.images} description={brandResponse?.data?.at(0)?.brandDescription} />
      {brandResponse.isLoaded && brandResponse.data.length > 0 && (
        <DelaySearchListingStack
          hide="brand"
          brandSlug={slug}
          {...props}
          preFilter={{
            brand_slug: slug,
          }}
        />
      )}
    </>
  )
}

// This is just so we dont call the listing api untill we know if we have a brand
const DelaySearchListingStack = props => {
  const { SearchListingStack } = useElementContext()
  const searchListingData = useListing(props.preFilter, props.searchConfig)
  return <SearchListingStack searchListingData={searchListingData} {...props} />
}

export { BrandSearchListing }
