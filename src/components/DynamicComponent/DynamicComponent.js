import React from 'react'
import { useComponentContext } from '../../contexts/ComponentContext'

/*
 * This single function will build our whole page
 * we just need to supply a list of all possible
 * components it will recursivly render everything.
 *
 * Another cool thing about this is client overrides
 * are easy to inject because it is just a list.
 */

const DynamicComponent = ({ el }) => {
  const componentList = useComponentContext()
  //console.log('componentList', componentList)
  if (el?.contentElementTypeCode in componentList && !!componentList[el?.contentElementTypeCode]) {
    if (!!el?.innerElements?.length) {
      return React.createElement(
        componentList[el?.contentElementTypeCode],
        el,
        el?.innerElements
          ?.filter((child, idx) => {
            if (child?.contentElementTypeCode in componentList && !!componentList[child?.contentElementTypeCode]) return child
            console.log(`${child?.contentElementTypeCode} in not a supported component yet!`)
            return false
          })
          ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
          ?.map((child, idx) => {
            return React.createElement(DynamicComponent, { el: child, key: idx })
          })
      )
    } else {
      return React.createElement(componentList[el?.contentElementTypeCode], el)
    }
  } else {
    console.log(`${el?.contentElementTypeCode} in not a supported component yet!`)
  }

  return null
}
export { DynamicComponent }
