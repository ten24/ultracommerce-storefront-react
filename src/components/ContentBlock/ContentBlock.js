import React from 'react'
import { useUtilities } from '../../hooks'
import { SimpleImage } from '../SWImage/SWImage'
const ContentBlock = ({ contentBody = '', title = '', imagePath }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  if (!contentBody.length) {
    return null
  }
  return (
    <div className="custom-card card bg-light border-0 shadow m-3">
      <div className="max-height-img">{imagePath && <SimpleImage src={imagePath} />}</div>

      <div className="card-body px-5 pt-4">
        {title && <h3 className="mb-3 mt-1 fw-light">{title}</h3>}
        <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: contentBody }} />
      </div>
    </div>
  )
}

export { ContentBlock }
