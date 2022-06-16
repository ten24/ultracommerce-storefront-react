import { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'
import queryString from 'query-string'
import { receiveCart, requestCart } from '../../actions'
import { sdkURL, axios } from '../../services'

const AffiliateUser = () => {
  const loc = useLocation()
  const params = queryString.parse(loc.search)
  let { siteAffiliateCookieExpDays } = useSelector(state => state.configuration.site)
  siteAffiliateCookieExpDays = siteAffiliateCookieExpDays === undefined || siteAffiliateCookieExpDays === '' ? +30 : siteAffiliateCookieExpDays
  const dispatch = useDispatch()
  const [, setCookie] = useCookies()
  const [shouldRedirect, setShouldRedirect] = useState(false)
  useEffect(() => {
    dispatch(requestCart())
    let source = axios.CancelToken.source()
    let expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + siteAffiliateCookieExpDays)
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
        setCookie('affiliateCode', params.affiliateCode, { path: '/', expires: expirationDate })
      }
      setShouldRedirect(true)
    })
    return () => {
      source.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.affiliateCode, params.product, siteAffiliateCookieExpDays])

  if (params.product !== undefined && shouldRedirect) {
    return <Redirect to="/shopping-cart" />
  } else if (shouldRedirect) {
    return <Redirect to="/affiliate-landing" />
  }

  return null
}

export default AffiliateUser
