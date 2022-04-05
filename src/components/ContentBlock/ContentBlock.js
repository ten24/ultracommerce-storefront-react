import React from 'react'
import { useUtilities } from '../../hooks'
import { SimpleImage } from '../SWImage/SWImage'
const ContentBlock = ({ contentBody = '', title = '', imagePath, linkLabel, linkUrl }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  if (!contentBody.length) {
    return null
  }
  return (
    <div className="custom-card card bg-light border-0 shadow m-3">
      {imagePath && imagePath.trim().length > 0 && (
        <div className="max-height-img">
          <SimpleImage src={imagePath} />
        </div>
      )}

      <div className="card-body px-5 pt-4">
        {title && <h3 className="mb-3 mt-1 fw-light">{title}</h3>}
        <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: contentBody }} />
        {linkLabel && linkLabel.trim().length > 0 && linkUrl.trim().length > 0 && (
          <div className="text-center">
            <a onClick={eventHandlerForWSIWYG} href={`/${linkUrl}`} className="btn btn-primary btn-lg text-white px-4 mt-4">
              {linkLabel}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export { ContentBlock }
