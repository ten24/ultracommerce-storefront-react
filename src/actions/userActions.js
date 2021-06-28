import { softLogout } from './authActions'
import { SlatwalApiService } from '../services'
import { toast } from 'react-toastify'
import { receiveCart } from './cartActions'
import { getErrorMessage, isAuthenticated } from '../utils'

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

export const getUser = () => {
  return async dispatch => {
    dispatch(requestUser())
    const payload = { returnJSONObjects: 'cart' }
    await SlatwalApiService.account.get(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        if (response.success().account.accountID.length) {
          dispatch(receiveUser(response.success().account))
        } else {
          dispatch(softLogout())
        }

        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(softLogout())
      }
    })
  }
}

export const updateUser = user => {
  return async dispatch => {
    dispatch(requestUser())

    const payload = { ...user }

    await SlatwalApiService.account.update(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Update Successful')
        dispatch(receiveUser(response.success().account))
      } else {
        toast.error('Update Failed')
      }
    })
  }
}

export const getAccountOrders = () => {
  return async dispatch => {
    dispatch(requestAccountOrders())

    const payload = {}

    await SlatwalApiService.account.accountOrders(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveAccountOrders(response.success().ordersOnAccount.ordersOnAccount))
      } else {
        dispatch(receiveAccountOrders([]))
      }
    })
  }
}

export const getAccountCartsAndQuotes = () => {
  return async dispatch => {
    dispatch(requestAccountOrders())
    const payload = {}

    await SlatwalApiService.account.cartsAndQuotes(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveAccountOrders(response.success().cartsAndQuotesOnAccount.ordersOnAccount))
      } else {
        dispatch(receiveAccountOrders([]))
      }
    })
  }
}

export const orderDeliveries = () => {
  return async () => {
    const payload = {}

    await SlatwalApiService.account.orderDeliveries(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
      } else {
      }
    })
  }
}

export const addNewAccountAddress = address => {
  return async dispatch => {
    dispatch(requestUser())

    const payload = { ...address, returnJSONObjects: 'account' }

    await SlatwalApiService.account.addAddress(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Update Successful')
        dispatch(receiveUser(response.success().account))
      } else {
        dispatch(receiveUser({}))
        toast.error('Error')
      }
    })
  }
}

export const updateAccountAddress = user => {
  return async dispatch => {
    dispatch(requestUser())

    const payload = { ...user, returnJSONObjects: 'account' }

    await SlatwalApiService.account.updateAddress(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Update Successful')
        dispatch(receiveUser(response.success().account))
      } else {
        toast.error('Update Failed')
      }
    })
  }
}

export const deleteAccountAddress = accountAddressID => {
  return async dispatch => {
    const payload = { accountAddressID, returnJSONObjects: 'account' }

    await SlatwalApiService.account.deleteAddress(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Update Successful')
        dispatch(receiveUser(response.success().account))
      } else {
        toast.error('Update Failed')
      }
    })
  }
}

export const addPaymentMethod = paymentMethod => {
  return async dispatch => {
    const payload = { ...paymentMethod, returnJSONObjects: 'account' }

    await SlatwalApiService.account.addPaymentMethod(payload).then(response => {
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
    })
  }
}

export const updatePaymentMethod = paymentMethod => {
  return async dispatch => {
    const payload = { paymentMethod, returnJSONObjects: 'account' }

    await SlatwalApiService.account.updatePaymentMethod(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Update Successful')
        dispatch(receiveUser(response.success().account))
      } else {
        toast.error('Update Failed')
      }
    })
  }
}

export const deletePaymentMethod = accountPaymentMethodID => {
  return async dispatch => {
    const payload = { accountPaymentMethodID, returnJSONObjects: 'account' }

    await SlatwalApiService.account.deletePaymentMethod(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Delete Successful')
        dispatch(receiveUser(response.success().account))
      } else {
        toast.error('Delete Failed')
      }
    })
  }
}

export const getWishLists = (force = false) => {
  return async (dispatch, getState) => {
    dispatch(requestWishlist())
    if ((!getState().userReducer.wishList.isListLoaded || force) && isAuthenticated()) {
      dispatch(getWishListItems(true))

      const payload = {}

      await SlatwalApiService.orderTemplate.getWishlists(payload).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveWishlist(response.success().accountWishlistProducts))
        } else {
        }
      })
    }
  }
}
export const getWishListItems = (force = false) => {
  return async (dispatch, getState) => {
    dispatch(requestWishlist())

    if ((!getState().userReducer.wishList.isListItemsLoaded || force) && isAuthenticated()) {
      const payload = {}

      await SlatwalApiService.orderTemplate.getWishListItems(payload).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveWishlistItems(response.success().accountWishlistProducts))
        } else {
          dispatch(receiveWishlistItems())
        }
      })
    }
  }
}

export const createListAndAddItem = (skuID = '') => {
  return async dispatch => {
    if (isAuthenticated()) {
      const payload = { skuID }

      await SlatwalApiService.orderTemplate.createAndAddItem(payload).then(response => {
        if (response.isSuccess()) {
          dispatch(getWishLists(true))
        }
      })
    }
  }
}

export const addSkuToWishList = (skuID = '', orderTemplateID = null) => {
  return async dispatch => {
    if (isAuthenticated()) {
      const payload = { skuID, orderTemplateID }

      await SlatwalApiService.orderTemplate.addWishlistItem(payload).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(getWishListItems(true))
        }
      })
    }
  }
}
export const removeWishlistItem = (removalSkuID = '', orderTemplateID) => {
  return async (dispatch, getState) => {
    dispatch(requestWishlist())
    if (isAuthenticated()) {
      const payload = { removalSkuID, orderTemplateID }

      await SlatwalApiService.orderTemplate.removeWishlistItem(payload).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(getWishListItems(true))
        }
      })
    }
  }
}
