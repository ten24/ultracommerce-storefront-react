import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { getWishLists, getPageContent, getContentByType } from '../../../actions'

const useCMSWrapper = () => {
  const dispatch = useDispatch()
  const { pathname } = useLocation('home')
  const history = useHistory()
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)

  useEffect(() => {
    if (!isLoaded) {
      let basePath = pathname.split('/')[1].toLowerCase()
      basePath = basePath.length ? basePath : 'home'
      dispatch(getWishLists())
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
      setIsLoaded(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const unload = history.listen(location => {
      if (location.pathname !== currentPath) {
        let newPath = location.pathname.split('/').reverse()[0].toLowerCase()
        newPath = newPath.length ? newPath : 'home'
        setCurrentPath(location.pathname)
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
    })
    return () => {
      unload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {}
}

export { useCMSWrapper }
