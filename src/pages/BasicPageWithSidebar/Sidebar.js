import React from 'react'
import { useUtilities } from '../../hooks'

const Sidebar = ({ data }) => {
  let { eventHandlerForWSIWYG } = useUtilities()

  return (
    <aside className=" col-lg-4 pt-4 pt-lg-0">
      <div className="pageSidebar rounded-lg box-shadow-lg p-4 mb-5">
        {data &&
          data
            .sort((a, b) => {
              return a.sortOrder - b.sortOrder
            })
            .map((item, index) => {
              return (
                <div key={index}>
                  <div
                    onClick={eventHandlerForWSIWYG}
                    dangerouslySetInnerHTML={{
                      __html: item.contentBody,
                    }}
                  />
                </div>
              )
            })}
      </div>
    </aside>
  )
}
export default Sidebar
