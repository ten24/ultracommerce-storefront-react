import { ProductSlider } from '../ProductSlider/ProductSlider'

const DynamicProductListing = props => {
  const { viewMode = 'celSlider', relatedProducts = [], contentElementName } = props
  if (viewMode === '2c938084833c662e01833d163c01004c') {
    return <ProductSlider products={relatedProducts} title={contentElementName} />
  } else if (viewMode === 'celGrid') {
    // return <ProductSliderWithConfig {...props} />
  } else if (viewMode === 'celList') {
    // return <ProductSliderWithConfig {...props} />
  }
  return null
}
export { DynamicProductListing }
