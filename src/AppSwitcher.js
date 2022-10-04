import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { evictAllPages, getConfiguration, getUser, getWishLists, ContentContextProvider, ComponentContextProvider, ElementContextProvider, Theme } from '@ultracommerce/ultracommerce-storefront-react/global'
import App from './App'

const AppSwitcher = () => {
  const { t } = useTranslation()
  const { pathname, search } = useLocation()
  const themeKey = useSelector(state => state.configuration.theme.themeKey)
  const [safeToLoad, setSafeToLoad] = useState(false)
  const [configurationLoaded, setConfigurationLoaded] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (pathname.startsWith('/ssoLogin')) {
      const authCode = new URLSearchParams(search).get('token')
      const redirect = new URLSearchParams(search).get('redirect') || '/my-account/overview'
      localStorage.setItem('token', authCode)
      dispatch(evictAllPages())
      dispatch(getUser()).then(() => {
        dispatch(getWishLists())
        navigate(redirect)
        toast.success(t('frontend.account.auth.success'))
        setSafeToLoad(true)
      })
    } else {
      setSafeToLoad(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (safeToLoad) {
      dispatch(getConfiguration()).then(response => {
        setConfigurationLoaded(true)
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeToLoad])

  if (safeToLoad && configurationLoaded)
    return (
      <ElementContextProvider>
        <ComponentContextProvider>
          <ContentContextProvider>
            <div className={`${themeKey}`}>
              <Theme>
                <App />
              </Theme>
            </div>
          </ContentContextProvider>
        </ComponentContextProvider>
      </ElementContextProvider>
    )
  return null
}

export { AppSwitcher }
