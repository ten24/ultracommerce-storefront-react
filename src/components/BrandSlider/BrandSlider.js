import React from 'react'
import Slider from 'react-slick'
import { SimpleImage } from '..'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getBrandRoute } from '../../selectors/'

const BandSlide = ({ images, urlTitle = '', title }) => {
  const brand = useSelector(getBrandRoute)
  return (
    <div className="repeater">
      <div className="card-body">
        <Link to={`/${brand}/${urlTitle}`} className="brand-rounded-img shadow-sm">
          <SimpleImage src={!!images ? images?.at(0) : ''} alt={title} type="brand" />
        </Link>
      </div>
    </div>
  )
}

const BrandSlider = props => {
  const { t } = useTranslation()
  const { linkLabel, linkUrl, relatedBrands = [] } = props

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 6,
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
  if (!relatedBrands.length) return null
  return (
    <section className="content-spacer bg-light-blue brand-slider-sec">
      <div className="container">
        <header className="section-title">
          <h2>{t('frontend.home.shop_brands')}</h2>
        </header>
        <div className="card border-0 bg-transparent">
          <Slider {...settings}>
            {relatedBrands.map(slide => {
              return <BandSlide key={slide.brandID} {...slide} />
            })}
          </Slider>
        </div>
        <div className="text-center mt-5">
          <Link className="btn btn-primary" to={linkUrl}>
            {linkLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}

export { BrandSlider }
