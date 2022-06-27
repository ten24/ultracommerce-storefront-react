import { toast } from 'react-toastify'
import { axios, sdkURL, SlatwalApiService } from '../services'
import { getErrorMessage } from '../utils'
import { receiveCart, requestCart } from './'
import { requestUser, receiveUser, clearUser, getWishLists, evictAllPages, receiveSubscriptionCart, requestSubscriptionCart } from './'
import { isAuthenticated } from '../utils'

export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
export const ERROR_LOGIN = 'ERROR_LOGIN'
export const LOGOUT = 'LOGOUT'

export const requestLogin = () => {
  return {
    type: REQUEST_LOGIN,
  }
}

export const receiveLogin = isAuthenticanted => {
  return {
    type: RECEIVE_LOGIN,
    isAuthenticanted,
  }
}

export const errorLogin = () => {
  return {
    type: ERROR_LOGIN,
  }
}

export const requestLogOut = () => {
  return {
    type: LOGOUT,
  }
}
export const logout = (success = '', failure = '') => {
  return async dispatch => {
    dispatch(evictAllPages())
    return await axios({
      method: 'POST',
      withCredentials: true,
      url: `${sdkURL}api/scope/logout`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: { returnJSONObjects: 'cart,account' },
    }).then(response => {
      dispatch(softLogout())
      if (response?.status === 200) {
        dispatch(receiveUser(response.data.account))
        dispatch(receiveCart(response.data.cart))
        toast.success(success)
      } else {
        toast.error(failure)
      }
      return response
    })
  }
}

export const softLogout = () => {
  return async dispatch => {
    dispatch(requestLogOut())
    dispatch(clearUser())
    return new Promise((resolve, reject) => resolve({}))
  }
}

export const login = (email, password, success, failure) => {
  return async (dispatch, getState) => {
    let { accountID } = getState().userReducer
    if (!isAuthenticated() || !accountID.length) {
      dispatch(requestLogin())
      dispatch(requestUser())
      dispatch(requestCart())
      dispatch(requestSubscriptionCart())

      return await SlatwalApiService.auth
        .login({
          emailAddress: email,
          password: password,
          returnJSONObjects: 'account,cart,orderTemplateCart',
        })
        .then(response => {
          if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
          if (response.isSuccess()) {
            dispatch(receiveLogin({ isAuthenticanted: true }))
            dispatch(receiveUser(response.success().account))
            dispatch(receiveCart(response.success().cart))
            dispatch(receiveSubscriptionCart(response.success().orderTemplateCart))
            dispatch(getWishLists())
            toast.success(success)
          } else {
            toast.error(failure)
            dispatch(errorLogin())
          }
          return response
        })
    }
  }
}

export const createAccount = user => {
  return async dispatch => {}
}
