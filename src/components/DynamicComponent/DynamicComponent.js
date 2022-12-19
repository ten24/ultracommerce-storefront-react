import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useComponentContext } from '../../contexts/ComponentContext'

/*
 * This will allow each cms component to Error and us catch it
 */

const DynamicComponentErrorBoundary = props => {
  const { componentID, componentCode, el } = props
  return (
    <ErrorBoundary
      fallbackRender={() => <></>}
      onError={(_, info) => {
        console.log(`Error in - ${componentCode} - ${componentID}`, info.componentStack)
      }}
    >
      {el}
    </ErrorBoundary>
  )
}

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
      const parentComponent = React.createElement(
        componentList[el?.contentElementTypeCode],
        { ...el, __DynamicComponent: DynamicComponent },
        el?.innerElements
          ?.filter((child, idx) => {
            if (child?.contentElementTypeCode in componentList && !!componentList[child?.contentElementTypeCode]) return child
            console.log(`${child?.contentElementTypeCode} in not a supported component yet!`)
            return false
          })
          ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
          ?.map((child, idx) => {
            return React.createElement(DynamicComponent, { el: { ...child, __DynamicComponent: DynamicComponent }, key: idx })
          })
      )
      return <DynamicComponentErrorBoundary componentID={el?.contentElementID} componentCode={el?.contentElementTypeCode} el={parentComponent} />
    } else {
      return <DynamicComponentErrorBoundary componentID={el?.contentElementID} componentCode={el?.contentElementTypeCode} el={React.createElement(componentList[el?.contentElementTypeCode], { ...el, __DynamicComponent: DynamicComponent })} />
    }
  } else {
    console.log(`${el?.contentElementTypeCode} in not a supported component yet!`)
  }

  return null
}
export { DynamicComponent, DynamicComponentErrorBoundary }
