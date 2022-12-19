import { NoProductFound } from '../'
import ContentLoader from 'react-content-loader'
import { useElementContext } from '../../contexts/ElementContextProvider'

const ListingGridLoader = props => (
  <ContentLoader viewBox="0 0 1200 500" className="listingGridLoader" {...props}>
    <rect x="100" y="20" rx="8" ry="8" width="300" height="300" />
    <rect x="100" y="350" rx="0" ry="0" width="300" height="32" />
    <rect x="100" y="400" rx="0" ry="0" width="180" height="36" />

    <rect x="500" y="20" rx="8" ry="8" width="300" height="300" />
    <rect x="500" y="350" rx="0" ry="0" width="300" height="36" />
    <rect x="500" y="400" rx="0" ry="0" width="180" height="30" />

    <rect x="900" y="20" rx="8" ry="8" width="300" height="300" />
    <rect x="900" y="350" rx="0" ry="0" width="300" height="32" />
    <rect x="900" y="400" rx="0" ry="0" width="180" height="36" />
  </ContentLoader>
)

const ListingGrid = ({ cardDisplayConfigurations, isFetching, pageRecords, config }) => {
  const { SkuCard, ProductCard } = useElementContext()
  let Card = SkuCard
  let cardConfig = cardDisplayConfigurations.skuCardConfiguration
  if (config?.params?.productsListingFlag) {
    Card = ProductCard
    cardConfig = cardDisplayConfigurations.productCardConfiguration
  }
  return (
    <div className="col">
      {isFetching && (
        <>
          <ListingGridLoader /> <ListingGridLoader /> <ListingGridLoader />
        </>
      )}
      <div className="product-grid">
        {!isFetching &&
          pageRecords?.map((product, index) => {
            return (
              <div key={`${product.productName}${index}`} className="mb-4">
                <Card cardConfiguration={cardConfig} config={config} showInputLabel={false} showInput={cardConfig?.showInput} {...product} />
              </div>
            )
          })}
      </div>
      {!isFetching && pageRecords.length === 0 && <NoProductFound noProductFoundLink={config.noProductFoundLink} />}
    </div>
  )
}
export { ListingGrid }
