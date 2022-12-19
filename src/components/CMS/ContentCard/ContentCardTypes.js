import { useUtilities } from '../../../hooks'
import { toBoolean } from '../../../utils'

const BasicCard = props => {
  let { eventHandlerForWSIWYG, buildAttributeImageUrl } = useUtilities()
  const { stylingCustomClasses = '', imagePosition = 'top', contentElementID, contentCardImage, contentHeading = '', contentSubHeading = '', contentBody = '' } = props
  const { linkLabel = '', linkUrl = '', openLinkInNewTab = '0' } = props
  return (
    <div className={['card overflow-hidden swBasicCard', stylingCustomClasses].join(' ')} id={contentElementID}>
      {imagePosition === 'top' && contentCardImage?.trim()?.length > 0 && <img src={buildAttributeImageUrl({ fileName: contentCardImage, attributeName: 'contentCardImage' })} className="card-img-top" alt="" />}
      <div className="card-body" onClick={eventHandlerForWSIWYG}>
        {contentHeading?.trim()?.length > 0 && <h5 className="card-title text-uppercase font-weight-bold">{contentHeading}</h5>}
        {contentSubHeading?.trim()?.length > 0 && <h6 className="card-subtitle font-weight-bold mb-2 text-muted">{contentSubHeading}</h6>}
        {contentBody?.trim()?.length > 0 && <div className="card-text" dangerouslySetInnerHTML={{ __html: contentBody }} />}
        {linkLabel?.trim()?.length > 0 && (
          <a className="btn btn-gray mt-4" rel="noreferrer" href={linkUrl} target={toBoolean(openLinkInNewTab) ? '_blank' : ''}>
            {linkLabel}
          </a>
        )}
      </div>
      {imagePosition === 'bottom' && contentCardImage?.trim()?.length > 0 && <img src={buildAttributeImageUrl({ fileName: contentCardImage, attributeName: 'contentCardImage' })} className="card-img-bottom" alt="" />}
    </div>
  )
}

const HorizontalCard = props => {
  let { eventHandlerForWSIWYG, buildAttributeImageUrl } = useUtilities()
  const { imagePosition = 'left', contentElementID, contentCardImage, contentHeading = '', contentSubHeading = '', contentBody = '' } = props
  const { linkLabel = '', linkUrl = '', openLinkInNewTab = '0' } = props

  return (
    <div className="card overflow-hidden" id={contentElementID}>
      <div className="row g-0" style={{ flex: '1' }}>
        {imagePosition === 'left' && <div className="col-md-4 d-flex">{contentCardImage?.trim()?.length > 0 && <img src={buildAttributeImageUrl({ fileName: contentCardImage, attributeName: 'contentCardImage' })} className="img-fluid" style={{ objectFit: 'cover' }} alt="" />}</div>}
        <div className="col-md-8">
          <div className="card-body" onClick={eventHandlerForWSIWYG}>
            {contentHeading?.trim()?.length > 0 && <h5 className="card-title text-uppercase font-weight-bold">{contentHeading}</h5>}
            {contentSubHeading?.trim()?.length > 0 && <h6 className="card-subtitle font-weight-bold mb-2">{contentSubHeading}</h6>}
            {contentBody?.trim()?.length > 0 && <div onClick={eventHandlerForWSIWYG} className="card-text" dangerouslySetInnerHTML={{ __html: contentBody }} />}
            {linkLabel?.trim()?.length > 0 && (
              <a className="btn btn-gray mt-4" rel="noreferrer" href={linkUrl} target={toBoolean(openLinkInNewTab) ? '_blank' : ''}>
                {linkLabel}
              </a>
            )}
          </div>
        </div>
        {imagePosition === 'right' && <div className="col-md-4 d-flex">{contentCardImage?.trim()?.length > 0 && <img src={buildAttributeImageUrl({ fileName: contentCardImage, attributeName: 'contentCardImage' })} className="img-fluid" style={{ objectFit: 'cover' }} alt="" />}</div>}
      </div>
    </div>
  )
}

const OverlayCard = props => {
  let { eventHandlerForWSIWYG, buildAttributeImageUrl } = useUtilities()
  const { overlayType = 'left', contentElementID, contentCardImage, contentHeading = '', contentSubHeading = '', contentBody = '' } = props
  const { linkLabel = '', linkUrl = '', openLinkInNewTab = '0' } = props

  return (
    <div className={`card overflow-hidden card-${overlayType}`} id={contentElementID}>
      <div className="card-img-container">
        {contentCardImage?.trim()?.length > 0 && <img src={buildAttributeImageUrl({ fileName: contentCardImage, attributeName: 'contentCardImage' })} className="card-img-overlay" alt="" />}
      </div>
      <div className={`card-overlay card-overlay-${overlayType}`} onClick={eventHandlerForWSIWYG}>
        {contentHeading?.trim()?.length > 0 && <h5 className="card-title text-uppercase font-weight-bold">{contentHeading}</h5>}
        {contentSubHeading?.trim()?.length > 0 && <h6 className="card-subtitle font-weight-bold mb-2">{contentSubHeading}</h6>}
        {contentBody?.trim()?.length > 0 && <div className="card-text" dangerouslySetInnerHTML={{ __html: contentBody }} />}
        {linkLabel?.trim()?.length > 0 && (
          <a className="btn btn-gray mt-4" rel="noreferrer" href={linkUrl} target={toBoolean(openLinkInNewTab) ? '_blank' : ''}>
            {linkLabel}
          </a>
        )}
      </div>
    </div>
  )
}

export { BasicCard, OverlayCard, HorizontalCard }
