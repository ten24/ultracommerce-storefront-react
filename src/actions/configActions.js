import { toast } from 'react-toastify'
import { SlatwalApiService } from '../services'
import { getErrorMessage } from '../utils'
import { receiveCart, requestCart } from './'
import { receiveSubscriptionCart, requestSubscriptionCart } from './subscriptionCartActions'
import { receiveUser, requestUser } from './userActions'
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

export const getConfiguration = (siteCode = localStorage.getItem('siteCode'), returnJSONObjects = 'cart,account,orderTemplateCart') => {
  return async (dispatch, getState) => {
    dispatch(requestConfiguration())
    dispatch(requestSubscriptionCart())
    dispatch(requestUser())
    dispatch(requestCart())

    return await SlatwalApiService.content
      .getConfiguration({
        siteCode: siteCode,
        returnJSONObjects,
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          let serverConfig = response.success().config
          // retail and local routes not found on the server
          // const legacyRoutes = localRoutes.filter(localRoute => serverConfig.router.filter(route => route.URLKeyType === localRoute.URLKeyType).length === 0)
          // serverConfig.router = [...serverConfig.router, ...legacyRoutes]
          dispatch(reciveConfiguration(serverConfig))
          dispatch(receiveUser(response.success().account))
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
