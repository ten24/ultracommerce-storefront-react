import React from 'react'
import { SWImage } from '../SWImage/SWImage'
const ContentBlock = ({ customBody = '', title = '', associatedImage, fileName }) => {
  if (!customBody.length) {
    return null
  }
  return (
    <div className="custom-card card bg-light border-0 shadow m-3">
      <div className="img-container">
        {fileName && <SWImage className="img-fluid" customPath="/custom/assets/files/associatedimage/" src={fileName} />}
        {associatedImage && <img src={associatedImage} className="img-fluid" alt="Shop" />}
      </div>

      <div className="card-body px-5 pt-4">
        {title && <h3 className="mb-3 mt-1 fw-light">{title}</h3>}
        <div dangerouslySetInnerHTML={{ __html: customBody }} />
      </div>
    </div>
  )
}

export { ContentBlock }
