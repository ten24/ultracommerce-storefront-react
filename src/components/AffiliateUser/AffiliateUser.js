import { Redirect } from 'react-router';
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCookies } from 'react-cookie';
import {addAffiliate} from '../../actions'
import queryString from 'query-string'


const AffiliateUser = () => {
    const loc = useLocation()
    const params = queryString.parse(loc.search)
    let { siteAffiliateCookieExpDays } = useSelector(state => state.configuration.site);
    siteAffiliateCookieExpDays = siteAffiliateCookieExpDays === undefined || siteAffiliateCookieExpDays === '' ? +30 : siteAffiliateCookieExpDays;
    const dispatch = useDispatch()  
    const [, setCookie] = useCookies();
    dispatch(addAffiliate(params.affiliateCode, params.product, params.product !== undefined))
    let expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + siteAffiliateCookieExpDays)
    setCookie('affiliateCode', params.affiliateCode, {path: '/', expires: expirationDate})
    
    if(params.product !== undefined) {
        return <Redirect to="/shopping-cart" />
    } else {
        return <Redirect to="/" />
    }    
}

export default AffiliateUser;