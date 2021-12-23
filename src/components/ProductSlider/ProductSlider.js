import Slider from 'react-slick'
import { ProductCard } from '../'
import { useGetProductsByEntityModified } from '../../hooks/'
import { useEffect } from 'react'
import { sorting } from '../../utils'

const ProductSlider = ({ children, settings, title, slidesToShow = 4, products = [] }) => {
  settings = settings
    ? settings
    : {
        dots: false,
        infinite: products.length >= slidesToShow,
        // infinite: true,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 5000,
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
          {products.map(slide => {
            return (
              <div className="repeater" key={slide.defaultSku_skuID}>
                {/*Fixed the slider design issue */}
                <div className="card-body h-100">
                  <ProductCard {...slide} imageFile={slide.defaultSku_imageFile} skuID={slide.defaultSku_skuID} salePrice={slide.salePrice} listPrice={slide.listPrice} key={slide.defaultSku_skuID} />
                </div>
              </div>
            )
          })}
        </Slider>
      </div>
    </div>
  )
}

const ProductSliderWithList = ({ children, params = {}, settings, title, slidesToShow, productList = [] }) => {
  let [request, setRequest] = useGetProductsByEntityModified()

  useEffect(() => {
    let didCancel = false
    if (!didCancel && !request.isFetching && !request.isLoaded && productList.length) {
      setRequest({
        ...request,
        params: { ...params, includeImages: true, 'f:ProductID:in': productList.join(',') },
        entity: 'product',
        makeRequest: true,
        isFetching: true,
        isLoaded: false,
      })
    }
    return () => {
      didCancel = true
    }
  }, [request, setRequest, params, productList])
  if (!request.data.length || productList.length === 0) {
    return null
  }
  const sortedProducts = sorting(request.data, productList, 'productCode')

  return (
    <ProductSlider products={sortedProducts} settings={settings} title={title} slidesToShow={slidesToShow}>
      {children}
    </ProductSlider>
  )
}

const ProductSliderWithConfig = ({ children, params = {}, settings, title, slidesToShow }) => {
  let [request, setRequest] = useGetProductsByEntityModified()

  useEffect(() => {
    let didCancel = false
    if (!didCancel && !request.isFetching && !request.isLoaded) {
      setRequest({
        ...request,
        params: { includeImages: true, ...params },
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

  return (
    <ProductSlider products={request.data} settings={settings} title={title} slidesToShow={slidesToShow}>
      {children}
    </ProductSlider>
  )
}

export { ProductSlider, ProductSliderWithConfig, ProductSliderWithList }
