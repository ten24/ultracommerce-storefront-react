import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { getWishLists, getPageContent, getContentByType, receiveContent, requestContent } from '../../../actions'
import { getBlogRoute, getProductRoute } from '../../../selectors'
import { SlatwallCMSService } from '../../../services'

const useCMSWrapper = () => {
  const { pathname } = useLocation('home')
  const history = useHistory()
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)
  const conData = useSelector(state => state.content)
  const cmsProvider = useSelector(state => state.configuration.cmsProvider)
  const blogRoute = useSelector(getBlogRoute)
  const productRoute = useSelector(getProductRoute)

  const dispatch = useDispatch()
  const requestUltraPageContent = payload => {
    if (payload.productUrlTitle && payload.urlTitle) {
    } else if (payload.productUrlTitle) {
      if (conData[`${payload.productRoute}/${payload.productUrlTitle}`]) {
        return
      }
    } else if (payload.urlTitle) {
      if (conData[payload.urlTitle]) {
        return
      }
    }
    dispatch(requestContent())
    SlatwallCMSService.getEntryBySlug(payload).then(({ hydrated }) => {
      dispatch(receiveContent(hydrated))
    })
  }
  const requestKontentContent = basePath => {
    dispatch(
      getContentByType(
        {
          'f:urlTitlePath:like': `header%`,
          includeSettings: true,
        },
        'header',
        'header'
      )
    )
    dispatch(
      getPageContent(
        {
          'f:urlTitlePath:like': `404%`,
          includeSettings: true,
        },
        '404'
      )
    )
    dispatch(
      getContentByType(
        {
          'f:urlTitlePath:like': `footer%`,
          includeSettings: true,
        },
        'footer',
        'footer'
      )
    )
    dispatch(
      getPageContent(
        {
          'f:urlTitlePath:like': `${basePath}%`,
          includeSettings: true,
        },
        basePath
      )
    )
  }
  const requestContentfulContent = basePath => {
    dispatch(
      getContentByType(
        {
          'f:urlTitlePath:like': `header%`,
          includeSettings: true,
        },
        'header',
        'header'
      )
    )
    dispatch(
      getPageContent(
        {
          'f:urlTitlePath:like': `404%`,
          includeSettings: true,
        },
        '404'
      )
    )
    dispatch(
      getContentByType(
        {
          'f:urlTitlePath:like': `footer%`,
          includeSettings: true,
        },
        'footer',
        'footer'
      )
    )
    dispatch(
      getPageContent(
        {
          'f:urlTitlePath:like': `${basePath}%`,
          includeSettings: true,
        },
        basePath
      )
    )
  }

  useEffect(() => {
    if (!isLoaded) {
      let basePath = pathname.split('/')[1].toLowerCase()
      basePath = basePath.length ? basePath : 'home'
      dispatch(getWishLists())
      if (cmsProvider === 'slatwallCMS') {
        if (basePath === blogRoute) {
          requestUltraPageContent({
            urlTitle: '404',
            'p:show': 500,
            includeImages: true,
            includeCategories: true,
            includeGlobalContent: true,
            includeAllBrand: true,
            includeAllCategory: true,
            includeAllProductType: true,
            includeHeader: true,
            includeFooter: true,
            restRequestFlag: 1,
            enforceAuthorization: true,
            useAuthorizedPropertiesAsDefaultColumns: true,
            setDisplayPropertiesSearchable: true,
          })
        } else if (basePath === productRoute) {
          const productUrlTitle = pathname.split('/').reverse()[0].toLowerCase()

          requestUltraPageContent({
            urlTitle: '404',
            productUrlTitle,
            productRoute,
            'p:show': 500,
            includeImages: true,
            includeCategories: true,
            includeGlobalContent: true,
            includeAllBrand: true,
            includeAllCategory: true,
            includeAllProductType: true,
            includeHeader: true,
            includeFooter: true,
            restRequestFlag: 1,
            enforceAuthorization: true,
            useAuthorizedPropertiesAsDefaultColumns: true,
            setDisplayPropertiesSearchable: true,
          })
        } else {
          requestUltraPageContent({
            urlTitle: pathname !== '/' ? basePath : 'home',
            includeGlobalContent: true,
            includeAllBrand: true,
            includeAllCategory: true,
            includeAllProductType: true,
            includeHeader: true,
            'p:show': 500,
            includeFooter: true,
            includeImages: true,
            includeCategories: true,
          })
          requestUltraPageContent({
            urlTitle: '404',
            'p:show': 500,
            includeImages: true,
            includeCategories: true,
          })
        }
      } else if (cmsProvider === 'kontent') {
        requestKontentContent(basePath)
      } else if (cmsProvider === 'contentful') {
        requestContentfulContent(basePath)
      }

      setIsLoaded(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const unload = history.listen(location => {
      if (location.pathname !== currentPath) {
        let newPath = location.pathname.split('/')[1].toLowerCase()
        newPath = newPath.length ? newPath : 'home'
        setCurrentPath(location.pathname)
        if (cmsProvider === 'slatwallCMS') {
          if (newPath === productRoute) {
            const productUrlTitle = location.pathname.split('/').reverse()[0].toLowerCase()
            requestUltraPageContent({
              productUrlTitle,
              productRoute,
              'p:show': 500,
              includeImages: true,
              includeCategories: true,
            })
          } else {
            requestUltraPageContent({
              urlTitle: location.pathname !== '/' ? newPath : 'home',
              'p:show': 500,
              includeImages: true,
              includeCategories: true,
            })
          }
        } else if (cmsProvider === 'kontent') {
          dispatch(
            getPageContent(
              {
                'f:urlTitlePath:like': `${newPath}%`,
                includeSettings: true,
              },
              newPath
            )
          )
        } else if (cmsProvider === 'contentful') {
          dispatch(
            getPageContent(
              {
                'f:urlTitlePath:like': `${newPath}%`,
                includeSettings: true,
              },
              newPath
            )
          )
        }
      }
    })
    return () => {
      unload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath])

  return {}
}

export { useCMSWrapper }
