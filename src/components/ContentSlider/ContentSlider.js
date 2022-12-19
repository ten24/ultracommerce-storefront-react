import React, { useEffect } from 'react'
import { useUtilities } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { AttributeImage } from '..'

import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min'

const calculateViewMode = (parentMode, childMode) => (childMode?.trim()?.length > 0 ? childMode?.trim() : parentMode?.trim()?.length > 0 ? parentMode?.trim() : 'slider-overlay-full')

const ContentSlider = ({ innerElements: slides, systemCode, ...parent }) => {
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
      var carousel = new bootstrap.Carousel(document.getElementById('carousel_' + parent?.contentElementID), {
        interval: 5000,
        ride: true,
        pause: 'hover',
      })
      carousel.cycle()
    }
    //eslint-disable-next-line
  }, [slides?.length])
  if (!slides?.length) return null
  return (
    <div className={`hero content-slider ${systemCode}`}>
      {!!slides?.length && (
        <div id={`carousel_` + parent?.contentElementID} className="carousel slide" data-bs-ride={`carousel_` + parent?.contentElementID}>
          <div className="carousel-indicators">
            {slides?.length > 1 &&
              slides?.map((_, idx) => {
                return <button key={idx} type="button" data-bs-target={`#carousel_` + parent?.contentElementID} data-bs-slide-to={idx} className={idx === 0 ? 'active' : ''} aria-current="true" aria-label={`Slide ${idx}`}></button>
              })}
          </div>
          <div className="carousel-inner">
            {slides?.map(({ systemCode, contentBody, title, imagePath, linkUrl, linkLabel, slideLayoutMode }, key) => {
              return (

                <div key={key} className={['carousel-item', `${key === 0 ? 'active' : ''}`, systemCode, calculateViewMode(parent.slideLayoutMode, slideLayoutMode)].join(' ')}>
                    <div className="carousel-image">
                      <AttributeImage fileName={imagePath} alt="carouselImage" />
                    </div>
                    {(title?.trim()?.length > 0 || contentBody?.trim()?.length > 0) && (
                      <div className="carousel-caption">
                        <div className="caption-container">
                          <h2>{title}</h2>
                          <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: contentBody }} />
                          {linkLabel?.trim()?.length > 0 && (
                            <a onClick={eventHandlerForWSIWYG} href={generateUrlString(linkUrl)} className="btn btn-primary text-white px-4 rounded-pill">
                              {linkLabel}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )
            })}
          </div>

          {slides?.length > 1 && (
            <>
              <button className="carousel-control-prev" type="button" data-bs-target={`#carousel_` + parent?.contentElementID} data-bs-slide="prev">
                <span className="carousel-control-prev-icon " aria-hidden="true"></span>
                <span className="visually-hidden">{t('frontend.core.previous')}</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target={`#carousel_` + parent?.contentElementID} data-bs-slide="next">
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
