import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import { evictAllPages, getUser, getWishLists } from '@ultracommerce/ultracommerce-storefront-react/actions'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import App from './App'

const AppSwitcher = () => {
  const { t } = useTranslation()
  const { pathname, search } = useLocation()
  const [safeToLoad, setSafeToLoad] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (pathname.startsWith('/ssoLogin')) {
      const authCode = new URLSearchParams(search).get('token')
      const redirect = new URLSearchParams(search).get('redirect') || '/my-account/overview'
      localStorage.setItem('token', authCode)
      dispatch(evictAllPages())
      dispatch(getUser()).then(() => {
        dispatch(getWishLists())
        history.push(redirect)
        toast.success(t('frontend.account.auth.success'))
        setSafeToLoad(true)
      })
    } else {
      setSafeToLoad(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (safeToLoad) return <App />
  return null
}

export { AppSwitcher }
