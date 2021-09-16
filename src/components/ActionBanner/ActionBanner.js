import React from 'react'
import { Link } from 'react-router-dom'
import { useUtilities } from '../../hooks'

const ActionBanner = ({ data }) => {
  let { eventHandlerForWSIWYG } = useUtilities()

  if (!data) {
    return null
  }

  return (
    <div className="bg-light-blue p-5">
      <div className="container">
        <div className="row">
          <div className="col-0 col-md-2" />
          <div className="col-md-8 text-center">
            {data.title && (
              <header className="section-title">
                <h2>{data.title}</h2>
              </header>
            )}
            <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: data.customBody }} />
            <Link className="btn btn-primary" to={data.linkUrl}>
              {data.linkLabel}
            </Link>
          </div>
          <div className="col-0 col-md-2" />
        </div>
      </div>
    </div>
  )
}

export { ActionBanner }
