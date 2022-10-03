
import { useEffect, useState } from 'react'
import { sdkURL, axios } from '../../services'
import { Navigate } from 'react-router'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'
import { receiveCart, requestCart } from '../../actions'
import queryString from 'query-string'

const AffiliateUser = () => {

  const loc = useLocation()
  const params = queryString.parse(loc.search)
  const settings = useSelector(state => state.configuration.site.settings)
  let siteAffiliateCookieExpDays = settings.siteAffiliateCookieExpDays === undefined || settings.siteAffiliateCookieExpDays === '' ? +30 : settings.siteAffiliateCookieExpDays
  const dispatch = useDispatch()
  const [, setCookie] = useCookies()
  const [shouldRedirect, setShouldRedirect] = useState(false)
  useEffect(() => {
    if (Object.keys(settings).length > 1) {
      dispatch(requestCart())
      let source = axios.CancelToken.source()
      let expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + +siteAffiliateCookieExpDays)
      axios({
        method: 'POST',
        withCredentials: true,
        url: `${sdkURL}api/scope/setAffiliate`,
        cancelToken: source.token,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          affiliateCode: params.affiliateCode,
          skuCode: params.product,
          returnJSONObjects: 'cart',
        },
      }).then(response => {
        if (response?.status === 200) {
          dispatch(receiveCart(response.data.cart))
          let cookieParams = { path: '/', expires: expirationDate }
          if (settings.siteCookieDomain !== undefined) {
            cookieParams['domain'] = settings.siteCookieDomain
          }
          setCookie('affiliateCode', params.affiliateCode, cookieParams)
        }
        setShouldRedirect(true)
      })
      return () => {
        source.cancel()
      }
    }
  }, [params.affiliateCode, params.product, siteAffiliateCookieExpDays, settings, setCookie, dispatch])

  if (params.redirect !== undefined && shouldRedirect && Object.keys(settings).length > 1) {
    return <Navigate to={params.redirect} />
  } else if (params.product !== undefined && shouldRedirect && Object.keys(settings).length > 1) {
    return <Navigate to="/shopping-cart" />
  } else if (shouldRedirect && Object.keys(settings).length > 1) {
    return <Navigate to="/" />
  }

  return null
}

export default AffiliateUser
