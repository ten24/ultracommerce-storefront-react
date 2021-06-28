import React, { useEffect, useState } from 'react'
import { SlatwalApiService } from '../../services'
import { renameKeysInArrayOfObjects } from '../../utils'
import { useTranslation } from 'react-i18next'
import Slider from 'react-slick'
import { ProductCard } from '..'

const RelatedProductsSlider = ({ productID, slidesToShow = 4 }) => {
  const { t } = useTranslation()
  const [relatedProducts, setRelatedProducts] = useState({ products: [], isLoaded: false, err: '', productID })
  if (relatedProducts.productID !== productID) {
    setRelatedProducts({ products: [], isLoaded: false, err: '', productID })
  }
  useEffect(() => {
    let didCancel = false
    if (!relatedProducts.isLoaded) {
      SlatwalApiService.products.getRelatedProducts({ productID }).then(response => {
        if (response.isSuccess() && !didCancel) {
          let newProducts = response.success().relatedProducts

          renameKeysInArrayOfObjects(newProducts, 'relatedProduct_', '')
          setRelatedProducts({
            ...relatedProducts,
            isLoaded: true,
            products: newProducts,
          })
        } else {
          setRelatedProducts({
            ...relatedProducts,
            isLoaded: true,
            err: 'oops',
          })
        }
      })
    }

    return () => {
      didCancel = true
    }
  }, [relatedProducts, setRelatedProducts, productID])
  if (!relatedProducts.products.length) {
    return null
  }
  const settings = {
    dots: false,
    infinite: relatedProducts.products && relatedProducts.products.length >= slidesToShow,
    // infinite: true,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
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
      <hr />
      <header className="section-title">
        <h3>{t('frontend.product.related')}</h3>
      </header>
      <div className="card border-0 bg-transparent">
        <Slider {...settings}>
          {relatedProducts.isLoaded &&
            relatedProducts.products.map(slide => {
              return (
                <div className="repeater" key={slide.defaultSku_skuID}>
                  {/*Fixed the slider design issue */}
                  <div className="card-body">
                    <ProductCard {...slide} imageFile={slide.defaultSku_imageFile} skuID={slide.defaultSku_skuID} listPrice={slide.defaultSku_listPrice} key={slide.defaultSku_skuID} />
                  </div>
                </div>
              )
            })}
        </Slider>
      </div>
    </div>
  )
}
export { RelatedProductsSlider }
