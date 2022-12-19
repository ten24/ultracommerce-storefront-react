import { useEffect, useState } from 'react'
import { useUtilities } from '../../hooks'
import { Button, AttributeImage, Modal } from '..'

import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min'
import { useTranslation } from 'react-i18next'

const GallerySlider = ({ initialSlide = 0, innerElements: slides, systemCode, ...rest }) => {
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!!slides?.length) {
      var carousel = new bootstrap.Carousel(document.getElementById('carousel_' + rest?.contentElementID), {
        interval: 5000,
        ride: true,
        pause: 'hover',
      })
      carousel.to(initialSlide)
      carousel.cycle()
    }
    setLoaded(true)
    return () => {
      if (carousel) carousel.dispose()
    }
    //eslint-disable-next-line
  }, [])
  if (!slides?.length || !loaded) return null

  return (
    <div className={`hero content-slider ${systemCode}`}>
      {!!slides?.length && (
        <div id={`carousel_` + rest?.contentElementID} className="carousel slide" data-bs-ride={`carousel_` + rest?.contentElementID}>
          <div className="carousel-indicators">
            {slides?.length > 1 &&
              slides?.map((_, idx) => {
                return <button key={idx} type="button" data-bs-target={`#carousel_` + rest?.contentElementID} data-bs-slide-to={idx} className={idx === initialSlide ? 'active' : ''} aria-current="true" aria-label={`Slide ${idx}`}></button>
              })}
          </div>
          <div className="carousel-inner">
            {slides?.map(({ systemCode, contentBody, title, imagePath, linkUrl, linkLabel }, key) => {
              return (
                <div key={key} className={key === initialSlide ? `carousel-item active ${systemCode}` : `carousel-item ${systemCode}`}>
                  <div className=" flex-column">
                    <div className="carousel-image">
                      <AttributeImage fileName={imagePath} alt="carouselImage" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {slides?.length > 1 && (
            <>
              <button className="carousel-control-prev" type="button" data-bs-target={`#carousel_` + rest?.contentElementID} data-bs-slide="prev">
                <span className="carousel-control-prev-icon " aria-hidden="true"></span>
                <span className="visually-hidden">{t('frontend.core.previous')}</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target={`#carousel_` + rest?.contentElementID} data-bs-slide="next">
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
const ImageGallery = props => {
  const { buildAttributeImageUrl } = useUtilities()
  const [imageGroupSelected, setSelected] = useState([])
  const [showModal, setModal] = useState(false)
  const [startingImage, setStartingImage] = useState()
  const { contentElementName, innerElements } = props

  return (
    <section>
      <div className="container py-3">
        <div className="row m-2 m-md-5">
          <h5 className="text-black float-start">
            <b>{contentElementName}</b>
          </h5>
          <div className="container py-3">
            <div className="justify-content grid ">
              {innerElements?.map((innerElement, idx) => {
                const attributeName = 'imagePath'
                return (
                  <div key={idx} className="g-col-12 g-col-sm-6 g-col-lg-4">
                    <div className="galleryBox">
                      <Button
                        onClick={() => {
                          setModal(true)
                          setSelected(innerElements)
                          setStartingImage(idx)
                        }}
                        classList="border-0 bg-transparent"
                        data-lightbox="gallery-set1"
                      >
                        <img alt="" className="galleryImage  p-3 border" src={buildAttributeImageUrl({ fileName: innerElement?.imagePath, attributeName })} width="100%" style={{ maxHeight: '300px' }} />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
            <Modal
              show={showModal}
              setShow={() => {
                setModal(false)
                setSelected([])
              }}
              title=""
              modalClass="imageGalleryModal"
              size="large"
            >
              <div className="container p-0">
                <GallerySlider initialSlide={startingImage} innerElements={imageGroupSelected} contentElementID={innerElements?.at(0)?.contentElementID} />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  )
}

export { ImageGallery }
