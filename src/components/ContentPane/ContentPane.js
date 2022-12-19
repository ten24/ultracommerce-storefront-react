import { Link } from 'react-router-dom'
import { useUtilities } from '../../hooks'

const ContentPane = props => {
  if (props.viewMode === 'vertical') return <VerticalContentPane {...props} />
  if (props.viewMode === 'horizontal') return <HorizontalContentPane {...props} />
  return null
}
const VerticalContentPane = props => {
  const { buildAttributeImageUrl, eventHandlerForWSIWYG } = useUtilities()
  const { siblingCount, imagePath, linkUrl, linkLabel, systemCode, viewMode, contentBody, contentHeading, stylingBackgroundColor, stylingFontColor } = props
  return (
    <div className={`${systemCode} ${viewMode} col-md-${12 / siblingCount} p-0 d-flex flex-column`}>
      <div className="image" style={{ backgroundImage: `url(${buildAttributeImageUrl({ fileName: imagePath })})`, backgroundColor: stylingBackgroundColor }}></div>
      <h4 style={{ background: stylingBackgroundColor, color: stylingFontColor }}>{contentHeading}</h4>
      <div className="text">
        <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: contentBody }} />
        {!!linkLabel && !!linkUrl && (
          <Link className="text-link link-carrot" to={linkUrl}>
            {linkLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
const HorizontalContentPane = props => {
  const { buildAttributeImageUrl, eventHandlerForWSIWYG } = useUtilities()
  const { imagePath, linkUrl, linkLabel, systemCode, viewMode, contentBody, contentHeading, stylingBackgroundColor, stylingFontColor } = props
  return (
    <div className={`d-md-flex p-0 ${systemCode} ${viewMode}`}>
      <div className="col-md-6 position-relative p-0">
        <div className="image" style={{ backgroundImage: `url(${buildAttributeImageUrl({ fileName: imagePath })})`, backgroundColor: stylingBackgroundColor }}></div>
        <div className="image-text">
          <h4 className="m-0 p-0" style={{ color: stylingFontColor }}>
            {contentHeading}
          </h4>
        </div>
      </div>
      <div className="col-md-6 p-0 d-flex">
        <div className="text">
          <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: contentBody }} />
        </div>
        {!!linkLabel && !!linkUrl && (
          <Link className="text-link link-carrot" to={linkUrl}>
            {linkLabel}
          </Link>
        )}
      </div>
    </div>
  )
}

export { ContentPane, VerticalContentPane, HorizontalContentPane }
