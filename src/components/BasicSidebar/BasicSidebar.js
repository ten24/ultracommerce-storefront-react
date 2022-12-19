import React from 'react'
import { useUtilities } from '../../hooks'

const BasicSidebar = ({ children }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  if (!children?.length) return null
  return (
    <div onClick={eventHandlerForWSIWYG} className="pageSidebar rounded-lg box-shadow-lg p-4 mb-5">
      {children}
    </div>
  )
}
export { BasicSidebar }
