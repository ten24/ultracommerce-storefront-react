import { createContext, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { UltraCMSService } from '../services'

const ContentContext = createContext()

const ContentContextProvider = ({ children }) => {
  const { pathname } = useLocation('home')
  const routing = useSelector(state => state.configuration.router)
  const [pageData, setPageData] = useState({})
  useEffect(() => {
    let didCancel = false
    let props = { urlTitlePath: pathname?.substring(1) }

    if (pathname === '/') {
      props = { urlTitlePath: 'home' }
    } else if (!!routing.find(el => pathname.startsWith(`/${el.URLKey}`))) {
      props = { ...props, templateUrlTitlePath: routing.find(el => pathname.startsWith(`/${el.URLKey}`)).URLKey }
    } else {
      props = { ...props, templateUrlTitlePath: 'default' }
    }
    UltraCMSService.getPage(props).then(data => {
      if (data.hydrated?.urlTitlePath === 'default') {
        data.hydrated.is404 = true
      }
      if (!didCancel && data.hydrated) setPageData(data.hydrated)
    })
    return () => {
      didCancel = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return <ContentContext.Provider value={pageData}>{children}</ContentContext.Provider>
}

const useContentContext = () => {
  // get the context
  const context = useContext(ContentContext)

  // if `undefined`, throw an error
  if (!context === undefined) {
    throw new Error('useContentContext was used outside of its Provider')
  }

  return context
}
const useContentBodyContext = () => {
  // get the context
  const context = useContext(ContentContext)

  // if `undefined`, throw an error
  if (!context === undefined) {
    throw new Error('useContentContext was used outside of its Provider')
  }
  return context.contentElements?.filter(child => child.systemCode === 'cetBody')?.at(0)
}

/*
 * we return ContentContext because a user may want to bypass the API call if th
 * user got the Content data from another spot and wants to Hydrate Manually.
 */
export { ContentContext, ContentContextProvider, useContentContext, useContentBodyContext }
