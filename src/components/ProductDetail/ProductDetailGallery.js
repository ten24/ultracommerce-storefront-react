import Slider from 'react-slick'
import { SWImage } from '..'
import { useProductDetailGallery } from '../../hooks'

/*
Probably should move to this eventually
https://react-slick.neostack.com/docs/example/custom-paging
*/
const ProductDetailGallery = ({ productUrlTitle, skuID, imageFile }) => {
  const { sliders, slider1, slider2, filterImages, isFetching } = useProductDetailGallery({ productUrlTitle, skuID, imageFile })
  if (isFetching || !productUrlTitle) return null
  return (
    <div className="row" data-mdb-zoom-effect="true" data-mdb-auto-height="primaryProductImage">
      <div className="preview-item active mb-3" id="first">
        <Slider arrows={false} asNavFor={sliders.nav2} ref={slider => (slider1.current = slider)}>
          {!!filterImages &&
            filterImages.map(({ RESIZEDIMAGEPATHS, ORIGINALFILENAME }, index) => {
              return <SWImage key={`${ORIGINALFILENAME}-${index}`} customPath="/" src={RESIZEDIMAGEPATHS[0]} className="image-zoom w-100 mx-auto" alt="Product" style={{ maxWidth: '500px' }} />
            })}
        </Slider>
      </div>
      <div className="slider_container" id="primaryProductImageRow">
        {!!filterImages && filterImages.length > 1 && (
          <Slider arrows={false} infinite={filterImages.length > 4} asNavFor={sliders.nav1} ref={slider => (slider2.current = slider)} slidesToShow={4} swipeToSlide={true} focusOnSelect={true}>
            {filterImages.map(({ RESIZEDIMAGEPATHS, ORIGINALFILENAME }, index) => {
              return <SWImage key={`${ORIGINALFILENAME}-${index}`} customPath="/" src={RESIZEDIMAGEPATHS[1]} className="w-100 mx-auto clickable" alt="Product" style={{ maxWidth: '100px' }} />
            })}
          </Slider>
        )}
      </div>
    </div>
  )
}
export { ProductDetailGallery }
