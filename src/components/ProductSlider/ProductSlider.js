import Slider from 'react-slick'
import { ProductCard } from '../'
import { useGetProductsByEntity } from '../../hooks/'
import { useEffect } from 'react'

const ProductSlider = ({ children, params = {}, settings, title, slidesToShow = 4 }) => {
  let [request, setRequest] = useGetProductsByEntity()

  useEffect(() => {
    let didCancel = false
    if (!didCancel && !request.isFetching && !request.isLoaded) {
      setRequest({
        ...request,
        params,
        entity: 'product',
        makeRequest: true,
        isFetching: true,
        isLoaded: false,
      })
    }
    return () => {
      didCancel = true
    }
  }, [request, setRequest, params])
  if (!request.data.length) {
    return null
  }
  settings = settings
    ? settings
    : {
        dots: false,
        infinite: request.data && request.data.length >= slidesToShow,
        // infinite: true,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 800,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      }

  return (
    <div className="container">
      <header className="section-title">
        <h2>{title}</h2>
      </header>
      <div className="card border-0 bg-transparent">
        {children}
        <Slider {...settings}>
          {request.isLoaded &&
            request.data.map(slide => {
              return (
                <div className="repeater" key={slide.defaultSku_skuID}>
                  {/*Fixed the slider design issue */}
                  <div className="card-body">
                    <ProductCard {...slide} imageFile={slide.defaultSku_imageFile} skuID={slide.defaultSku_skuID} calculatedSalePrice={slide.defaultSku_skuPrices_price} listPrice={slide.defaultSku_skuPrices_listPrice} key={slide.defaultSku_skuID} />
                  </div>
                </div>
              )
            })}
        </Slider>
      </div>
    </div>
  )
}

export { ProductSlider }
