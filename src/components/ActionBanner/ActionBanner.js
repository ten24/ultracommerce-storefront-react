import React from 'react'
import { Link } from 'react-router-dom'
import { useUtilities } from '../../hooks'

const ActionBanner = ({ title, contentBody = '', linkLabel = '', linkUrl = '', systemCode }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  if (!title && !contentBody) return null
  return (
    <div className={`${systemCode} bg-light-blue p-5 action-banner-sec`}>
      <div className="container">
        <div className="row">
          <div className="col-0 col-md-2" />
          <div className="col-md-8 text-center">
            {!!title && (
              <header className="section-title">
                <h2>{title}</h2>
              </header>
            )}
            <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: contentBody }} />
            <Link className="btn btn-primary" to={linkUrl}>
              {linkLabel}
            </Link>
          </div>
          <div className="col-0 col-md-2" />
        </div>
      </div>
    </div>
  )
}

export { ActionBanner }
