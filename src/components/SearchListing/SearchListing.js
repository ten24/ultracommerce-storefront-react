import { useSelector } from 'react-redux'

import { usePageTypeContext } from '../../contexts/ContentContext'
import { useElementContext } from '../../contexts/ElementContextProvider'

const SearchListing = props => {
  const pageType = usePageTypeContext()
  const { BrandSearchListing, DefaultSearchListing, ProductTypeSearchListing, CategorySearchListing } = useElementContext()
  let searchConfig = JSON.parse(props?.listingConfig)
  const defaultListingConfig = useSelector(state => state.configuration.defaultListingConfig)
  if (!searchConfig) searchConfig = defaultListingConfig
  const cardDisplayConfigurations = {
    skuCardConfiguration: JSON.parse(props?.skuCardConfiguration),
    productCardConfiguration: JSON.parse(props?.productCardConfiguration),
  }

  if (pageType === 'cptProductTypeListing') return <ProductTypeSearchListing {...props} searchConfig={searchConfig} cardDisplayConfigurations={cardDisplayConfigurations} />
  if (pageType === 'cptBrandListing') return <BrandSearchListing {...props} searchConfig={searchConfig} cardDisplayConfigurations={cardDisplayConfigurations} />
  if (pageType === 'cptCategoryListing') return <CategorySearchListing {...props} searchConfig={searchConfig} cardDisplayConfigurations={cardDisplayConfigurations} />
  return <DefaultSearchListing {...props} searchConfig={searchConfig} cardDisplayConfigurations={cardDisplayConfigurations} />
}

export { SearchListing }
