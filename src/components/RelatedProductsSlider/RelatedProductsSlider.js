import React, { useEffect, useState } from 'react'
import { SlatwalApiService } from '../../services'
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
          const products = response.success().relatedProducts.map(sku => {
            return { ...sku, productName: sku.relatedProduct_productName, productCode: sku.relatedProduct_productCode, urlTitle: sku.relatedProduct_urlTitle, brandName: sku.relatedProduct_brand_brandName, brandUrlTitle: sku.relatedProduct_brand_urlTitle, imageFile: sku.relatedProduct_defaultSku_imageFile, skuID: sku.relatedProduct_defaultSku_skuID, skuCode: sku.relatedProduct_defaultSku_skuCode }
          })
          setRelatedProducts({
            ...relatedProducts,
            isLoaded: true,
            products: products,
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
    <section className="content-spacer">
      <div className="container">
        <header className="section-title mb-5 pb-2">
          <h2 className="mb-5">{t('frontend.product.related')}</h2>
        </header>
        <div className="card border-0 bg-transparent">
          <Slider {...settings}>
            {relatedProducts.isLoaded &&
              relatedProducts.products.map(product => {
                return (
                  <div className="repeater" key={product.productCode}>
                    <ProductCard {...product} />
                  </div>
                )
              })}
          </Slider>
        </div>
      </div>
    </section>
  )
}
export { RelatedProductsSlider }