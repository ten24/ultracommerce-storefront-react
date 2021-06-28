import React from 'react'
import { useSelector } from 'react-redux'
import { useUtilities } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { getMainBannerSlides } from '../../selectors/contentSelectors'

const ContentSlider = () => {
  const homeMainBanner = useSelector(getMainBannerSlides)
  const { convertToFullPath } = useUtilities()
  const { t } = useTranslation()

  return (
    <div className="hero content-slider">
      {homeMainBanner && homeMainBanner.length > 0 && (
        <div id="carousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {homeMainBanner.map(({ title }, idx) => {
              return <button key={title} type="button" data-bs-target="#carousel" data-bs-slide-to={idx} className={idx === 0 ? 'active' : ''} aria-current="true" aria-label={`Slide ${idx}`}></button>
            })}
          </div>
          <div className="carousel-inner">
            {homeMainBanner.map(({ customBody, title, associatedImage, linkUrl, linkLabel }, key) => {
              return (
                <div key={title} className={key === 0 ? 'carousel-item active' : 'carousel-item'}>
                  <img src={convertToFullPath(associatedImage)} className="d-block w-100" alt="carouselImage" />
                  <div className="carousel-caption d-none d-md-block">
                    <a target="blank" href={linkUrl ? linkUrl : '#'} className="link-button">
                      <h5 className="text-white">{linkLabel}</h5>
                    </a>
                    {customBody}
                  </div>
                </div>
              )
            })}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">{t('frontend.core.previous')}</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">{t('frontend.core.next')}</span>
          </button>
        </div>
      )}
    </div>
  )
}
export { ContentSlider }
