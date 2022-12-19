import { ProductSlider } from '../ProductSlider/ProductSlider'

const DynamicProductListing = props => {
  const { viewMode = 'celSlider', relatedProducts = [], contentElementName } = props
  const cardDisplayConfigurations = {
    skuCardConfiguration: JSON.parse(props?.skuCardConfiguration || '{}'),
    productCardConfiguration: JSON.parse(props?.productCardConfiguration || '{}'),
  }

  if (viewMode === '2c938084833c662e01833d163c01004c') {
    return <ProductSlider products={relatedProducts} title={contentElementName} cardConfiguration={cardDisplayConfigurations.skuCardConfiguration} />
  } else if (viewMode === 'celGrid') {
    // return <ProductSliderWithConfig {...props} />
  } else if (viewMode === 'celList') {
    // return <ProductSliderWithConfig {...props} />
  }
  return null
}
export { DynamicProductListing }
