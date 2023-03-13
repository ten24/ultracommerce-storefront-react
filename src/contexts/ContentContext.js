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
    setPageData(page => {
      page.contentElements = page?.contentElements?.filter(el => {
        return el.contentElementTypeCode === 'cetHeader' || el.contentElementTypeCode === 'cetFooter'
      })

      return page
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    let didCancel = false
    const urlTitlePath = pathname?.substring(1)
    const [templateUrlTitlePath] = urlTitlePath?.split('/')
    const isRestrictedPath = routing?.find(el => el.URLKey === templateUrlTitlePath)

    let props = { urlTitlePath }

    if (pathname === '/') {
      props = { urlTitlePath: 'home' }
    } else if (isRestrictedPath) {
      //   http://localhost:3006/product-type/door-jambs
      props = { ...props, templateUrlTitlePath }
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

const usePageTypeContext = () => {
  // get the context
  const context = useContext(ContentContext)

  // if `undefined`, throw an error
  if (!context === undefined) {
    throw new Error('useContentContext was used outside of its Provider')
  }

  return context?.contentPageType_systemCode
}
const useContentBodyContext = () => {
  // get the context
  const context = useContext(ContentContext)

  // if `undefined`, throw an error
  if (!context === undefined) {
    throw new Error('useContentContext was used outside of its Provider')
  }
  return context?.contentElements?.filter(child => child.systemCode === 'cetBody')?.at(0)
}

/*
 * we return ContentContext because a user may want to bypass the API call if th
 * user got the Content data from another spot and wants to Hydrate Manually.
 */
export { ContentContext, ContentContextProvider, useContentContext, useContentBodyContext, usePageTypeContext }
