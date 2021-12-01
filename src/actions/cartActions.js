import { toast } from 'react-toastify'
import { SlatwalApiService } from '../services'
import { receiveUser, requestUser } from './userActions'
import { getErrorMessage } from '../utils'

export const REQUEST_CART = 'REQUEST_CART'
export const RECEIVE_CART = 'RECEIVE_CART'
export const CONFIRM_ORDER = 'CONFIRM_ORDER'
export const CLEAR_CART = 'CLEAR_CART'
export const ADD_TO_CART = 'ADD_TO_CART'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
export const SET_ERROR = 'SET_ERROR'

export const requestCart = () => {
  return {
    type: REQUEST_CART,
  }
}

export const receiveCart = cart => {
  return {
    type: RECEIVE_CART,
    cart,
  }
}
export const confirmOrder = (isPlaced = true) => {
  return {
    type: CONFIRM_ORDER,
    isPlaced,
  }
}
export const setError = (error = null) => {
  return {
    type: SET_ERROR,
    error,
  }
}

export const clearCart = () => {
  return {
    type: CLEAR_CART,
  }
}
export const setOrderOnCart = orderID => {
  return async dispatch => {
    dispatch(requestCart())

    const payload = {
      orderID,
      returnJSONObjects: 'cart',
    }

    await SlatwalApiService.cart.addCartToSession(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(receiveCart())
      }
    })
  }
}
export const getCart = () => {
  return async dispatch => {
    dispatch(requestCart())
    await SlatwalApiService.cart.get().then(response => {
      if (response.isSuccess()) {
        if (response.success().errors) toast.error(getErrorMessage(response.success().errors))
        dispatch(receiveCart(response.success().cart))
      }
    })
  }
}
export const clearCartData = () => {
  return async dispatch => {
    dispatch(requestCart())
    await SlatwalApiService.cart.clear({ returnJSONObjects: 'cart' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart(response.success().cart))
      }
    })
  }
}
export const addToCart = (skuID, quantity = 1) => {
  return async dispatch => {
    dispatch(requestCart())

    await SlatwalApiService.cart
      .addItem({
        skuID,
        quantity,
        returnJSONObjects: 'cart',
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          toast.success('Added to Cart')
          dispatch(receiveCart(response.success().cart))
        } else {
          dispatch(receiveCart())

          toast.error('Error')
        }
      })
  }
}

export const getEligibleFulfillmentMethods = () => {
  return async dispatch => {
    dispatch(requestCart())

    const payload = {}

    await SlatwalApiService.cart.eligibleFulfillmentMethods(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart({ eligibleFulfillmentMethods: response.success().eligibleFulfillmentMethods }))
      } else {
        dispatch(receiveCart())
      }
    })
  }
}

export const getPickupLocations = () => {
  return async dispatch => {
    dispatch(requestCart())

    await SlatwalApiService.location.getPickupLocations().then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart({ pickupLocations: response.success().locations }))
      } else {
        dispatch(receiveCart())
      }
    })
  }
}

export const clearOrderFulfillment = orderFulfillmentID => {
  return async dispatch => {
    dispatch(requestCart())

    const payload = { orderFulfillmentID, returnJSONObjects: 'cart' }

    await SlatwalApiService.cart.clearOrderFulfillment(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(receiveCart())
      }
    })
  }
}

export const addPickupLocation = params => {
  return async dispatch => {
    dispatch(requestCart())

    const payload = {
      ...params,
      returnJSONObjects: 'cart',
    }

    await SlatwalApiService.cart.addPickupLocation(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(receiveCart())
      }
    })
  }
}
export const setPickupDate = params => {
  return async dispatch => {
    dispatch(requestCart())

    const payload = {
      ...params,
      returnJSONObjects: 'cart',
    }

    await SlatwalApiService.cart.setPickupDate(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(receiveCart())
      }
    })
  }
}
export const updateOrderNotes = params => {
  return async dispatch => {
    dispatch(requestCart())

    const payload = {
      ...params,
      returnJSONObjects: 'cart',
    }

    await SlatwalApiService.cart.updateNotes(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(receiveCart())
      }
    })
  }
}
export const updateItemQuantity = (skuID, quantity = 1) => {
  return async dispatch => {
    dispatch(requestCart())
    const payload = {
      orderItem: {
        sku: {
          skuID,
        },
        qty: quantity,
      },
      returnJSONObjects: 'cart',
    }

    await SlatwalApiService.cart.updateItemQuantity(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Quantity Update')
        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(receiveCart())
      }
    })
  }
}

export const removeItem = orderItemID => {
  return async dispatch => {
    dispatch(requestCart())
    const payload = {
      orderItemID,
      returnJSONObjects: 'cart',
    }
    await SlatwalApiService.cart.removeItem(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart(response.success().cart))
      }
    })
  }
}

export const addShippingAddress = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())

    await SlatwalApiService.cart.addShippingAddress(params).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart(response.success().cart))
      }
    })
  }
}
export const addShippingAddressUsingAccountAddress = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())

    await SlatwalApiService.cart
      .addShippingAddressUsingAccountAddress({
        ...params,
        returnJSONObjects: 'cart',
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveCart(response.success().cart))
        }
      })
  }
}
export const addShippingMethod = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())

    await SlatwalApiService.cart
      .addShippingMethod({
        ...params,
        returnJSONObjects: 'cart',
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveCart(response.success().cart))
        }
      })
  }
}

export const updateFulfillment = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())

    await SlatwalApiService.cart.updateFulfillment(params).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart(response.success().cart))
      }
    })
  }
}

export const applyPromoCode = promotionCode => {
  return async dispatch => {
    dispatch(requestCart())
    await SlatwalApiService.cart
      .applyPromoCode({
        promotionCode,
        returnJSONObjects: 'cart',
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveCart(response.success().cart))
        } else {
        }
      })
  }
}
export const removePromoCode = (promotionCode, promotionCodeID) => {
  return async dispatch => {
    dispatch(requestCart())
    await SlatwalApiService.cart
      .removePromoCode({
        promotionCode,
        promotionCodeID,
        returnJSONObjects: 'cart',
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveCart(response.success().cart))
        } else {
        }
      })
  }
}

export const addBillingAddress = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())

    await SlatwalApiService.cart.addBillingAddress(params).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart(response.success().cart))
      }
    })
  }
}

export const addPayment = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())
    await SlatwalApiService.cart
      .addPayment({
        ...params,
        returnJSONObjects: 'cart,account',
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveCart(response.success().cart))
          dispatch(receiveUser(response.success().account))
        } else {
          dispatch(receiveCart({}))
          toast.error('An Error Occured')
        }
      })
  }
}

export const removePayment = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())

    await SlatwalApiService.cart.removePayment({ ...params, returnJSONObjects: 'cart' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart({ ...response.success().cart }))
      } else {
      }
    })
  }
}

export const placeOrder = () => {
  return async dispatch => {
    dispatch(requestCart())

    await SlatwalApiService.cart.placeOrder({ returnJSONObjects: 'cart' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart(response.success().cart))
        dispatch(confirmOrder())
      } else {
      }
    })
  }
}

export const addNewAddressAndAttachAsShipping = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())
    dispatch(requestUser())

    const payload = { returnJsonObjects: 'cart,account', ...params }

    await SlatwalApiService.cart.addNewAddressAndAttachAsShipping(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveUser(response.success().account))
        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(receiveCart())
        dispatch(receiveUser())
      }
    })
  }
}

export const changeOrderFulfillment = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())

    await SlatwalApiService.cart.updateFulfillment({ returnJsonObjects: 'cart', ...params }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(receiveCart())
      }
    })
  }
}

export const addBillingAddressUsingAccountAddress = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())
    dispatch(requestUser())

    const payload = { returnJsonObjects: 'cart', ...params }

    await SlatwalApiService.cart.addBillingAddressUsingAccountAddress(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveUser(response.success().account))
        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(receiveUser())
        dispatch(receiveCart())
      }
    })
  }
}

export const addNewAccountAndSetAsBilling = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())
    dispatch(requestUser())

    const payload = { returnJsonObjects: 'cart,account', ...params }

    await SlatwalApiService.cart.addNewAccountAndSetAsBillingAddress(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveUser(response.success().account))
        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(receiveCart())
        dispatch(receiveUser())
      }
    })
  }
}

export const addAddressAndAttachAsBilling = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())
    dispatch(requestUser())

    const payload = { returnJsonObjects: 'cart,account', ...params }

    await SlatwalApiService.cart.addEditAccountAndSetAsBillingAddress(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveUser(response.success().account))
        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(receiveCart())
        dispatch(receiveUser())
      }
    })
  }
}

export const addAddressAndPaymentAndAddToOrder = (params = {}) => {
  return async dispatch => {
    dispatch(requestCart())
    dispatch(requestUser())

    await SlatwalApiService.cart.addAccountPaymentMethod({ returnJsonObjects: 'cart,account', ...params }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveUser(response.success().account))
        dispatch(receiveCart(response.success().cart))
      } else {
        dispatch(receiveCart())
        dispatch(receiveUser())
      }
    })
  }
}
