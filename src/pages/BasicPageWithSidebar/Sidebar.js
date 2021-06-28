import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAllSidebars } from '../../selectors'

const Sidebar = () => {
  let history = useHistory()
  let loc = useLocation()
  const path = loc.pathname.split('/').reverse()[0]
  // Get All contnent of type sidebar
  let allSidebar = useSelector(getAllSidebars)
  allSidebar = allSidebar
    .map(content => {
      return content.key.includes(`${path}/`) ? content : null
    })
    .filter(item => {
      return item
    })
  return (
    <aside className="col-lg-4 pt-4 pt-lg-0">
      <div className="rounded-lg box-shadow-lg p-4 mb-5">
        {allSidebar &&
          allSidebar
            .sort((a, b) => {
              return a.sortOrder - b.sortOrder
            })
            .map((item, index) => {
              return (
                <div key={index}>
                  <div
                    onClick={event => {
                      if (event.target.getAttribute('href')) {
                        event.preventDefault()
                        history.push(event.target.getAttribute('href'))
                      }
                    }}
                    dangerouslySetInnerHTML={{
                      __html: item.customBody,
                    }}
                  />
                  {item.customSummary.length && <iframe title="location Map" src={item.customSummary.replace(/(<([^>]+)>)/gi, '')} width="400" height="250" frameBorder="0" style={{ border: 0 }} aria-hidden="false" tabIndex="0" />}
                </div>
              )
            })}
      </div>
    </aside>
  )
}
export default Sidebar
