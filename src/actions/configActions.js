import { toast } from 'react-toastify'
import { SlatwalApiService } from '../services'
import { getCurrentSiteCode, getErrorMessage } from '../utils'
import { receiveCart, requestCart } from './'
import { receiveSubscriptionCart, requestSubscriptionCart } from './subscriptionCartActions'
import { getWishLists, receiveUser, requestUser } from './userActions'
// import { receiveCart } from './cartActions'
// import { receiveSubscriptionCart } from './subscriptionCartActions'
// import { receiveUser } from './userActions'

export const REQUEST_CONFIGURATION = 'REQUEST_CONFIGURATION'
export const RECIVE_CONFIGURATION = 'RECIVE_CONFIGURATION'
export const SET_TITLE = 'SET_TITLE'
export const SET_TITLE_META = 'SET_TITLE_META'

export const setTitle = (title = '') => {
  return {
    type: SET_TITLE,
    title,
  }
}
export const reciveConfiguration = config => {
  return {
    type: RECIVE_CONFIGURATION,
    config,
  }
}
export const requestConfiguration = () => {
  return {
    type: REQUEST_CONFIGURATION,
  }
}

export const getConfiguration = (siteCode = getCurrentSiteCode(), returnJSONObjects = 'cart,account,orderTemplateCart') => {
  return async (dispatch, getState) => {
    dispatch(requestConfiguration())
    dispatch(requestSubscriptionCart())
    dispatch(requestUser())
    dispatch(requestCart())

    return await SlatwalApiService.content
      .getConfiguration({
        returnJSONObjects,
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          let serverConfig = response.success().config
          // retail and local routes not found on the server
          // const legacyRoutes = localRoutes.filter(localRoute => serverConfig.router.filter(route => route.URLKeyType === localRoute.URLKeyType).length === 0)
          // serverConfig.router = [...serverConfig.router, ...legacyRoutes]

          let appConfiguration = { currentSite: process.env.REACT_APP_SITE_CODE, sites: [] }
          const currentConfiguration = JSON.parse(localStorage.getItem('appConfiguration') || '{}')
          // merge old settings with new only for sites that are still valid
          appConfiguration.sites = serverConfig?.sites?.map(site => {
            const cachedSite = currentConfiguration?.sites?.filter(cachedSite => cachedSite.siteCode === site.siteCode)?.at(0)
            // load new ==> overlay ==> cached ==> always favor new settings  // TODO: make this better one day
            if (!!cachedSite) return { ...site, ...cachedSite, settings: site?.settings }
            return site
          })
          // if we have a current site bring it over
          if (!!currentConfiguration.currentSite) appConfiguration.currentSite = currentConfiguration.currentSite
          // // if we have a current site bring it over
          // if (currentConfiguration?.currentSite != ) appConfiguration.currentSite = currentConfiguration.currentSite
          // validate currentSite is valid for list
          if (!!serverConfig?.site?.siteCode) appConfiguration.currentSite = serverConfig?.site?.siteCode // this is no default sitecode & domain validation
          if (!appConfiguration.sites.find(site => site.siteCode === appConfiguration.currentSite) && appConfiguration.sites.length) {
            appConfiguration.currentSite = appConfiguration.sites.at(0).siteCode
            serverConfig.site = appConfiguration.sites.at(0)
          }
          localStorage.setItem('appConfiguration', JSON.stringify(appConfiguration))
          dispatch(reciveConfiguration(serverConfig))
          dispatch(receiveUser(response.success().account))
          if (response.success()?.account?.accountID?.length) dispatch(getWishLists())
          dispatch(receiveCart(response.success().cart))
          if (response.success()?.orderTemplateCart) {
            dispatch(receiveSubscriptionCart(response.success()?.orderTemplateCart))
          } else {
            dispatch(receiveSubscriptionCart({}))
          }
        } else {
          dispatch(reciveConfiguration({}))
        }
        return response
      })
  }
}
