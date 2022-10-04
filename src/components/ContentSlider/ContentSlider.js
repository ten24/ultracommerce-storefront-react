import React, { useEffect } from 'react'
import { useUtilities } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { SimpleImage } from '..'

import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min'

const ContentSlider = ({ innerElements: slides, systemCode }) => {
  const { t } = useTranslation()
  let { eventHandlerForWSIWYG } = useUtilities()
  const generateUrlString = urlString => {
    if (urlString !== undefined && urlString.length > 0) {
      if (urlString.indexOf('http') === -1) {
        return '/' + urlString
      } else {
        return urlString
      }
    } else {
      return '/#'
    }
  }

  useEffect(() => {
    if (!!slides?.length) {
      var carousel = new bootstrap.Carousel(document.getElementById('carousel'), {
        interval: 5000,
        ride: true,
        pause: false,
      })
      carousel.cycle()
    }
  }, [slides?.length])
  if (!slides?.length) return null
  return (
    <div className={`hero content-slider ${systemCode}`}>
      {!!slides?.length && (
        <div id="carousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {slides?.map(({ title }, idx) => {
              return <button key={title} type="button" data-bs-target="#carousel" data-bs-slide-to={idx} className={idx === 0 ? 'active' : ''} aria-current="true" aria-label={`Slide ${idx}`}></button>
            })}
          </div>
          <div className="carousel-inner">
            {slides?.map(({ systemCode, contentBody, title, imagePath, linkUrl, linkLabel }, key) => {
              return (
                <div key={title} className={key === 0 ? `carousel-item active ${systemCode}` : `carousel-item ${systemCode}`}>
                  <div className="carousel-image">
                    <SimpleImage src={imagePath} alt="carouselImage" />
                  </div>
                  <div className="carousel-caption">
                    <h2 className="display-3">{title}</h2>
                    <p onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: contentBody }} />
                    {linkLabel?.trim()?.length > 0 && (
                      <a onClick={eventHandlerForWSIWYG} href={generateUrlString(linkUrl)} className="btn btn-primary text-white px-4 rounded-pill">
                        {linkLabel}
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {!!slides?.length && (
            <>
              <button className="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon " aria-hidden="true"></span>
                <span className="visually-hidden">{t('frontend.core.previous')}</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">{t('frontend.core.next')}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
export { ContentSlider }
