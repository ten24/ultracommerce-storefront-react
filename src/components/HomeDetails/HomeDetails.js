import React from 'react'
import { SimpleImage } from '..'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
//        local.homeContentColumns.addFilter("urlTitlePath","%content-columns/%","LIKE")

function HomeDetails() {
  const content = useSelector(state => state.content)
  let homeContent = []
  Object.keys(content).forEach(key => {
    if (key.includes('content-columns/')) {
      homeContent.push(content[key])
    }
  })
  const navigate = useNavigate()

  return (
    <div className="container">
      <div className="row text-center mt-5 mb-5">
        {homeContent &&
          homeContent.map((section, index) => {
            return (
              <div key={index} className="col-md">
                <SimpleImage className="mb-3" src={section.imagePath} />

                <h3 className="h3">{section.title}</h3>
                <p
                  onClick={event => {
                    event.preventDefault()
                    if (event.target.getAttribute('href')) {
                      navigate(event.target.getAttribute('href'))
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: section.contentBody }}
                />
              </div>
            )
          })}
      </div>
    </div>
  )
}

export { HomeDetails }
