import React from 'react'
import { useUtilities } from '../../hooks'
import { AttributeImage } from '../SWImage/SWImage'
const ContentBlock = props => {
  const { stylingCustomClasses = '', contentBody = '', imagePath, linkLabel, linkUrl, systemCode, contentHeading, children } = props
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <div className={[`custom-card card bg-light border-0 shadow`, stylingCustomClasses, systemCode].join(' ')}>
      {imagePath && imagePath.trim().length > 0 && (
        <div className="max-height-img">
          <AttributeImage fileName={imagePath} alt={contentHeading} />
        </div>
      )}

      <div className="card-body">
        <h3 className="mb-3 mt-1 fw-light">{contentHeading}</h3>
        <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: contentBody }} />
        {linkLabel && linkLabel.trim().length > 0 && linkUrl.trim().length > 0 && (
          <div className="text-center">
            <a onClick={eventHandlerForWSIWYG} href={`${linkUrl}`} className="btn btn-primary btn-lg text-white px-4 mt-4">
              {linkLabel}
            </a>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export { ContentBlock }
