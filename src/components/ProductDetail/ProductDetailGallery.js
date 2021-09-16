import Slider from 'react-slick'
import { SWImage } from '..'
import { useProductDetailGallery } from '../../hooks'

/*
Probably should move to this eventually
https://react-slick.neostack.com/docs/example/custom-paging
*/
const ProductDetailGallery = ({ productID, skuID, imageFile }) => {
  const { sliders, slider1, slider2, filterImages, isFetching } = useProductDetailGallery({ productID, skuID, imageFile })
  if (isFetching || !productID) return null
  return (
    <div className="row" data-mdb-zoom-effect="true" data-mdb-auto-height="true">
      <div className="preview-item active mb-3" id="first">
        <Slider arrows={false} asNavFor={sliders.nav2} ref={slider => (slider1.current = slider)}>
          {!!filterImages &&
            filterImages.map(({ RESIZEDIMAGEPATHS, ORIGINALFILENAME }) => {
              return <SWImage key={ORIGINALFILENAME} customPath="/" src={RESIZEDIMAGEPATHS[2]} className="image-zoom w-100 mx-auto" alt="Product" style={{ maxWidth: '500px' }} />
            })}
        </Slider>
      </div>
      <div className="slider_container" id="first">
        {!!filterImages && (
          <Slider arrows={false} infinite={filterImages.length > 4} asNavFor={sliders.nav1} ref={slider => (slider2.current = slider)} slidesToShow={4} swipeToSlide={true} focusOnSelect={true}>
            {filterImages.map(({ RESIZEDIMAGEPATHS, ORIGINALFILENAME }) => {
              return <SWImage key={ORIGINALFILENAME} customPath="/" src={RESIZEDIMAGEPATHS[2]} className="w-100 mx-auto clickable" alt="Product" style={{ maxWidth: '100px' }} />
            })}
          </Slider>
        )}
      </div>
    </div>
  )
}
export { ProductDetailGallery }
