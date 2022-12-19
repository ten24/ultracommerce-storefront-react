import { useNavigate } from 'react-router-dom'
import Slider from 'react-slick'
import { AttributeImage } from '../../SWImage/SWImage'
const settings = JSON.stringify({
  dots: true,
  infinite: true,
  slidesToShow: 4,
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
})

const CarouselImage = props => {
  const navigate = useNavigate()
  const { imagePath, contentHeading = '', linkUrl, linkLabel } = props
  const showLink = linkLabel?.length > 0 && linkUrl?.length > 0
  return (
    <div className="repeater d-flex flex-column" style={{ height: '100%' }}>
      <div
        className="card-body"
        onClick={() => {
          if (showLink && linkUrl.includes('http')) window.location = linkUrl
          if (showLink && !linkUrl.includes('http')) navigate(linkUrl)
        }}
      >
        {/* <Link to={`/${brand}/${urlTitle}`} className="brand-rounded-img shadow-sm"> */}
        <AttributeImage fileName={imagePath} alt={contentHeading} />
        {/* </Link> */}
      </div>

      {showLink && (
        <a href={linkUrl}>
          <p className="text-center">{linkLabel}</p>
        </a>
      )}
      {!showLink && contentHeading?.length > 0 && <p className="text-center">{contentHeading}</p>}
    </div>
  )
}

const ImageSlider = props => {
  const { innerElements = [], sliderConfiguration = settings, contentHeading = '', contentBody = '' } = props
  if (innerElements.length < 1) return null
  return (
    <section className="content-spacer bg-light-blue brand-slider-sec ImageSlider">
      <div className="text-center">
        {contentHeading?.trim()?.length > 0 && <h1 className="text-center">{contentHeading}</h1>}
        {contentBody?.trim()?.length > 0 && <p className="text-center">{contentBody}</p>}
      </div>
      <div className="container">
        <div className="card border-0 bg-transparent">
          <Slider {...JSON.parse(sliderConfiguration)}>
            {innerElements
              ?.filter(el => el?.contentElementTypeCode === 'cetImage')
              ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
              .map((slide, idx) => {
                return <CarouselImage key={idx} {...slide} />
              })}
          </Slider>
        </div>
        {/* <div className="text-center mt-5">
        <Link className="btn btn-primary" to={linkUrl}>
          {linkLabel}
        </Link>
      </div> */}
      </div>
    </section>
  )
}

export { ImageSlider }
