import { softLogout } from './authActions'
import { SlatwalApiService } from '../services'
import { toast } from 'react-toastify'
import { receiveCart } from './'
import { receiveSubscriptionCart } from './subscriptionCartActions'
import { getErrorMessage, isAuthenticated, getFailureMessageOnSuccess } from '../utils'

export const REQUEST_USER = 'REQUEST_USER'
export const RECEIVE_USER = 'RECEIVE_USER'

export const REQUEST_WISHLIST = 'REQUEST_WISHLIST'
export const RECEIVE_WISHLIST = 'RECEIVE_WISHLIST'
export const RECEIVE_WISHLIST_ITEMS = 'RECEIVE_WISHLIST_ITEMS'

export const RECEIVE_ACCOUNT_ORDERS = 'RECEIVE_ACCOUNT_ORDERS'
export const REQUEST_ACCOUNT_ORDERS = 'REQUEST_ACCOUNT_ORDERS'

export const CLEAR_USER = 'CLEAR_USER'
export const REQUEST_CREATE_USER = 'REQUEST_CREATE_USER'
export const RECEIVE_CREATE_USER = 'RECEIVE_CREATE_USER'
export const ERROR_CREATE_USER = 'ERROR_CREATE_USER'

export const REQUEST_CARTS_AND_QUOTES = 'REQUEST_CARTS_AND_QUOTES'
export const RECEIVE_CARTS_AND_QUOTES = 'RECEIVE_CARTS_AND_QUOTES'

export const REQUEST_REDEEM_GIFT_CARD = 'REQUEST_REDEEM_GIFT_CARD'
export const TOGGLE_GIFT_CARD_STATUS = 'TOGGLE_GIFT_CARD_STATUS'

export const requestAccountCartsAndQuotes = () => {
  return {
    type: REQUEST_CARTS_AND_QUOTES,
  }
}

export const receiveAccountCartsAndQuotes = cartsAndQuotesOnAccount => {
  return {
    type: RECEIVE_CARTS_AND_QUOTES,
    cartsAndQuotesOnAccount,
  }
}

export const requestWishlist = () => {
  return {
    type: REQUEST_WISHLIST,
  }
}

export const receiveWishlist = (lists = []) => {
  return {
    type: RECEIVE_WISHLIST,
    payload: lists,
  }
}
export const receiveWishlistItems = (items = []) => {
  return {
    type: RECEIVE_WISHLIST_ITEMS,
    payload: items,
  }
}

export const requestUser = () => {
  return {
    type: REQUEST_USER,
  }
}

export const receiveUser = (user = {}) => {
  return {
    type: RECEIVE_USER,
    user,
  }
}

export const clearUser = () => {
  return {
    type: CLEAR_USER,
  }
}

export const requestCreateUser = () => {
  return {
    type: REQUEST_CREATE_USER,
  }
}

export const receiveCreateUser = user => {
  return {
    type: RECEIVE_CREATE_USER,
    user,
  }
}

export const requestAccountOrders = () => {
  return {
    type: REQUEST_ACCOUNT_ORDERS,
  }
}

export const receiveAccountOrders = ordersOnAccount => {
  return {
    type: RECEIVE_ACCOUNT_ORDERS,
    ordersOnAccount,
  }
}

export const requestRedeemGiftCard = () => {
  return {
    type: REQUEST_REDEEM_GIFT_CARD,
  }
}

export const requestToggleGiftCardStatus = () => {
  return {
    type: TOGGLE_GIFT_CARD_STATUS,
  }
}

export const getUser = () => {
  return async (dispatch, getState) => {
    dispatch(requestUser())
    return await SlatwalApiService.account.get({ returnJSONObjects: 'cart,orderTemplateCart' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(softLogout())
        dispatch(receiveUser(response.success().account))
        dispatch(receiveCart(response.success().cart))
        dispatch(receiveSubscriptionCart(response.success().orderTemplateCart))
      } else {
        dispatch(softLogout())
      }
      return response
    })
  }
}

export const updateUser = user => {
  return async dispatch => {
    dispatch(requestUser())

    return await SlatwalApiService.account.update(user).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Update Successful')
        dispatch(receiveUser(response.success().account))
      } else {
        toast.error('Update Failed')
      }
      return response
    })
  }
}

export const getAccountOrders = (params = {}) => {
  return async dispatch => {
    dispatch(requestAccountOrders())
    return await SlatwalApiService.account.accountOrders(params).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveAccountOrders(response.success().ordersOnAccount.ordersOnAccount))
      } else {
        dispatch(receiveAccountOrders([]))
      }
      return response
    })
  }
}

export const getAccountCartsAndQuotes = (params = {}) => {
  return async dispatch => {
    dispatch(requestAccountOrders())

    return await SlatwalApiService.account.cartsAndQuotes(params).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveAccountOrders(response.success().cartsAndQuotesOnAccount.ordersOnAccount))
      } else {
        dispatch(receiveAccountOrders([]))
      }
      return response
    })
  }
}

export const orderDeliveries = (params = {}) => {
  return async () => {
    return await SlatwalApiService.account.orderDeliveries(params).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

export const addNewAccountAddress = address => {
  return async dispatch => {
    dispatch(requestUser())
    return await SlatwalApiService.account.addAddress({ ...address, returnJSONObjects: 'account' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Update Successful')
        dispatch(receiveUser(response.success().account))
      } else {
        dispatch(receiveUser({}))
        toast.error('Error')
      }
      return response
    })
  }
}

export const updateAccountAddress = user => {
  return async dispatch => {
    dispatch(requestUser())

    return await SlatwalApiService.account.updateAddress({ ...user, returnJSONObjects: 'account' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Update Successful')
        dispatch(receiveUser(response.success().account))
      } else {
        toast.error('Update Failed')
      }
      return response
    })
  }
}

export const deleteAccountAddress = accountAddressID => {
  return async dispatch => {
    return await SlatwalApiService.account.deleteAddress({ accountAddressID, returnJSONObjects: 'account' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Update Successful')
        dispatch(receiveUser(response.success().account))
      } else {
        toast.error('Update Failed')
      }
      return response
    })
  }
}

export const addPaymentMethod = paymentMethod => {
  return async dispatch => {
    return await SlatwalApiService.account.addPaymentMethod({ ...paymentMethod, returnJSONObjects: 'account' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        if (response.success()?.failureActions.length) {
          dispatch(receiveUser())
          toast.error(JSON.stringify(response.success().errors))
        } else {
          toast.success('New Card Saved')
          dispatch(receiveUser(response.success().account))
        }
      } else {
        toast.error('Save Failed')
      }
      return response
    })
  }
}

export const updatePaymentMethod = paymentMethod => {
  return async dispatch => {
    return await SlatwalApiService.account.updatePaymentMethod({ paymentMethod, returnJSONObjects: 'account' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Update Successful')
        dispatch(receiveUser(response.success().account))
      } else {
        toast.error('Update Failed')
      }
      return response
    })
  }
}

export const deletePaymentMethod = accountPaymentMethodID => {
  return async dispatch => {
    return await SlatwalApiService.account.deletePaymentMethod({ accountPaymentMethodID, returnJSONObjects: 'account' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      getFailureMessageOnSuccess(response,getErrorMessage(response.success().messages))
      if (response.isSuccess() && response.success()?.successfulActions.length > 0) {
        toast.success('Delete Successful')
        dispatch(receiveUser(response.success().account))
      }
      return response
    })
  }
}

export const getWishLists = (force = false) => {
  return async (dispatch, getState) => {
    dispatch(requestWishlist())
    if ((!getState().userReducer.wishList.isListLoaded || force) && isAuthenticated()) {
      dispatch(getWishListItems(true))

      return await SlatwalApiService.orderTemplate.getWishlists({}).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveWishlist(response.success().accountWishlistProducts))
        }
        return response
      })
    }
    return new Promise((resolve, reject) => resolve({}))
  }
}
export const getWishListItems = (force = false) => {
  return async (dispatch, getState) => {
    dispatch(requestWishlist())

    if ((!getState().userReducer.wishList.isListItemsLoaded || force) && isAuthenticated()) {
      return await SlatwalApiService.orderTemplate.getWishListItems({}).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveWishlistItems(response.success().accountWishlistProducts))
        } else {
          dispatch(receiveWishlistItems())
        }
        return response
      })
    }
    return new Promise((resolve, reject) => resolve({}))
  }
}

export const createListAndAddItem = (skuID = '') => {
  return async dispatch => {
    if (isAuthenticated()) {
      return await SlatwalApiService.orderTemplate.createAndAddItem({ skuID }).then(response => {
        if (response.isSuccess()) {
          dispatch(getWishLists(true))
        }
        return response
      })
    }
    return new Promise((resolve, reject) => resolve({}))
  }
}

export const addSkuToWishList = (skuID = '', orderTemplateID = null) => {
  return async dispatch => {
    if (isAuthenticated()) {
      return await SlatwalApiService.orderTemplate.addWishlistItem({ skuID, orderTemplateID }).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(getWishListItems(true))
        }
        return response
      })
    }
    return new Promise((resolve, reject) => resolve({}))
  }
}
export const removeWishlistItem = (removalSkuID = '', orderTemplateID) => {
  return async (dispatch, getState) => {
    dispatch(requestWishlist())
    if (isAuthenticated()) {
      return await SlatwalApiService.orderTemplate.removeWishlistItem({ removalSkuID, orderTemplateID }).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(getWishListItems(true))
        }
        return response
      })
    }
    return new Promise((resolve, reject) => resolve({}))
  }
}

export const redeemGiftCard = (payload) => {
  return async (dispatch) => {
    dispatch(requestRedeemGiftCard())
    if (isAuthenticated()) {
      return SlatwalApiService.account.addGiftCard({...payload, returnJSONObjects: 'account'}).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveUser(response.success().account))
        }
        return response
      })
    }
    return new Promise((resolve, reject) => resolve({}))
  }
}

export const toggleGiftCardStatus = (giftCardID, status) => {
  return async (dispatch) => {
    dispatch(requestToggleGiftCardStatus())
    if (isAuthenticated()) {
      const payload = { giftCardID, activeFlag: status, returnJSONObjects: 'account' }
      return SlatwalApiService.account.updateGiftCardStatus(payload).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveUser(response.success().account))
        }
      })
    }

    return new Promise((resolve, reject) => resolve({}))
  }
}

export const setPrimaryPaymentMethod = accountPaymentMethodID => {
  return async dispatch => {
    return await SlatwalApiService.account.sePrimaryPaymentMethod({ accountPaymentMethodID, returnJSONObjects: 'account' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveUser(response.success().account))
      }
      return response
    })
  }
}

export const setPrimaryAccountAddress = accountAddressID => {
  return async dispatch => {
    return await SlatwalApiService.account.setPrimaryAddress({ accountAddressID, returnJSONObjects: 'account' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveUser(response.success().account))
      }
      return response
    })
  }
}