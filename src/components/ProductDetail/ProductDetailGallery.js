import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import { SWImage } from '..'
import { useGetProductImageGallery } from '../../hooks'

/*
Probably should move to this eventually 
https://react-slick.neostack.com/docs/example/custom-paging
*/
const ProductDetailGallery = ({ productID, skuID, imageFile }) => {
  let [productImageGallery, setRequest] = useGetProductImageGallery()
  const [sliders, setSliders] = useState({
    nav1: null,
    nav2: null,
  })
  const slider1 = useRef()
  const slider2 = useRef()

  useEffect(() => {
    setSliders({
      nav1: slider1.current,
      nav2: slider2.current,
    })
    if (!productImageGallery.isLoaded && !productImageGallery.isFetching) {
      setRequest({ ...productImageGallery, isFetching: true, isLoaded: false, params: { productID, resizeSize: 'large,small' }, makeRequest: true })
    }
  }, [productImageGallery, setRequest, productID])

  let filterImages = []
  if (productImageGallery.isLoaded) {
    filterImages = productImageGallery.data.images.filter(({ ASSIGNEDSKUIDLIST = false, TYPE }) => {
      return TYPE === 'skuDefaultImage' || TYPE === 'productAlternateImage' || (ASSIGNEDSKUIDLIST && ASSIGNEDSKUIDLIST.includes(skuID))
    })
  }

  if (filterImages.length === 0) {
    filterImages = [{ ORIGINALPATH: '', NAME: '' }]
  }
  filterImages.unshift(
    filterImages.splice(
      filterImages.findIndex(item => item.ORIGINALFILENAME === imageFile),
      1
    )[0]
  )
  filterImages = filterImages.reverse()

  return (
    <div className="col-sm-6 col-md-4 mb-4 mb-md-0">
      <div className="row" data-mdb-zoom-effect="true" data-mdb-auto-height="true">
        <div className="preview-item active mb-3" id="first">
          <Slider arrows={false} asNavFor={sliders.nav2} ref={slider => (slider1.current = slider)}>
            {productImageGallery.isLoaded &&
              filterImages.map(({ RESIZEDIMAGEPATHS, NAME }) => {
                return <SWImage key={NAME} customPath="/" src={RESIZEDIMAGEPATHS[0]} className="image-zoom w-100 mx-auto" alt="Product" />
              })}
          </Slider>
        </div>
        <div className="slider_container" id="first">
          {filterImages.length > 1 && (
            <Slider arrows={false} infinite={filterImages.length > 4} asNavFor={sliders.nav1} ref={slider => (slider2.current = slider)} slidesToShow={4} swipeToSlide={true} focusOnSelect={true}>
              {productImageGallery.isLoaded &&
                filterImages.map(({ RESIZEDIMAGEPATHS, NAME }) => {
                  return <SWImage key={NAME} customPath="/" src={RESIZEDIMAGEPATHS[0]} className="image-zoom w-100 mx-auto mt-1" alt="Product" />
                })}
            </Slider>
          )}
        </div>
      </div>
    </div>
  )
}
export { ProductDetailGallery }
