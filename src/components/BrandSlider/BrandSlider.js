import React from 'react'
import Slider from 'react-slick'
import { SWImage } from '..'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGetEntity } from '../../hooks/'
import { useEffect } from 'react'
import { getBrandRoute, getShopBy } from '../../selectors/'

const BandSlide = ({ brandLogo, urlTitle = '', title, customPath = '/custom/assets/files/associatedimage/' }) => {
  const brand = useSelector(getBrandRoute)
  return (
    <div className="repeater">
      <div className="card-body">
        <Link to={`/${brand}/${urlTitle}`}>
          <SWImage className="img-fluid img-placeholder d-block m-auto image_container" customPath={customPath} src={brandLogo} alt={title} type="brand" />
        </Link>
      </div>
    </div>
  )
}

const BrandSlider = ({ params }) => {
  const { t } = useTranslation()
  let [request, setRequest] = useGetEntity()
  const shopBy = useSelector(getShopBy)
  useEffect(() => {
    let didCancel = false
    if (!request.isFetching && !request.isLoaded && !didCancel) {
      setRequest({ ...request, isFetching: true, isLoaded: false, entity: 'brand', params, makeRequest: true })
    }
    return () => {
      didCancel = true
    }
  }, [request, setRequest, params])

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
  return (
    <div className="container">
      <header className="section-title">
        <h2>{t('frontend.home.shop_brands')}</h2>
      </header>
      <div className="card border-0 bg-transparent">
        <Slider {...settings}>
          {request.isLoaded &&
            request.data.map(slide => {
              return <BandSlide key={slide.brandID} {...slide} customPath="/custom/assets/images/brand/logo/" brandLogo={slide.imageFile} />
            })}
        </Slider>
      </div>
      <div className="text-center mt-3">
        {/* TODO: need to navigate */}
        <Link className="btn btn-primary" to={shopBy.linkUrl}>
          {t('frontend.home.more_brands')}
        </Link>
      </div>
    </div>
  )
}

export { BrandSlider }
