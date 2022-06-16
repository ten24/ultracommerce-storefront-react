import { toast } from 'react-toastify'
import { axios, sdkURL, SlatwalApiService } from '../services'
import { getErrorMessage } from '../utils'
import {
  requestCart,
  receiveCart,
  addToOrder,
  addMultipleItemsToOrder,
  removeOrderItem,
  getOrder,
  clearOrderData,
  getEligibleOrderFulfillmentMethods,
  getAllPickupLocations,
  clearFulfillmentOnOrder,
  addPickupLocationToOrderFulfillment,
  setPickupDateToOrderFulfillment,
  updateNotesOnOrder,
  updateOrderItemQuantity,
  addShippingAddressToOrderFulfillment,
  addShippingAddressUsingAccountAddressToOrderFulfillment,
  addShippingMethodToOrderFulfillment,
  updateOrderFulfillment,
  applyPromoCodeToOrder,
  removePromoCodeFromOrder,
  addBillingAddressToOrderFulfillment,
  addPaymentToOrder,
  removeOrderPayment,
  placeMyOrder,
  addNewAddressAndAttachAsShippingOnOrderFulfillment,
  changeFulfillmentOnOrder,
  addBillingAddressUsingAccountAddressOnOrderFulfillment,
  addNewAccountAndSetAsBillingOnOrderFulfillment,
  addAddressAndAttachAsBillingOnOrderFulfillment,
  addAddressAndPaymentAndThenAddToOrder,
} from './orderActions'

const setOrderOnCart = (orderID, successMsg = '') => {
  return async dispatch => {
    dispatch(requestCart())

    return await SlatwalApiService.cart
      .addCartToSession({
        orderID,
        returnJSONObjects: 'cart',
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveCart(response.success().cart))
          if (successMsg !== '' && !Object.keys(response.success()?.errors || {}).length) {
            toast.success(successMsg)
          }
        }
        return response
      })
  }
}
const getCart = () => {
  return async dispatch => {
    return dispatch(getOrder({})).then(response => {
      if (response.isSuccess() && response.success().errors) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}
const clearCartData = () => {
  return async dispatch => {
    return dispatch(clearOrderData({})).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

const getCookie = cname => {
  let name = cname + '='
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
const addToCart = (skuID, quantity = 1) => {
  return async (dispatch, getState) => {
    const accountCode = getState().cartReducer?.affiliateAccount?.accountCode
    const affiliateAccountCookie = getCookie('affiliateCode')

    if (!accountCode?.length && affiliateAccountCookie.length) {
      const codePair = affiliateAccountCookie.split('=')
      dispatch(addAffiliate(codePair[1], '', false))
    }

    return dispatch(
      addToOrder({
        params: {
          skuID,
          quantity,
        },
      })
    ).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) toast.success('Added to Cart')
      if (!response.isSuccess()) toast.error('Error')

      return response
    })
  }
}

const addMultipleItemsToCart = (skuIDs, quantities) => {
  return async (dispatch, getState) => {
    const accountCode = getState().cartReducer?.affiliateAccount?.accountCode
    const affiliateAccountCookie = getCookie('affiliateCode')

    if (!accountCode?.length && affiliateAccountCookie.length) {
      const codePair = affiliateAccountCookie.split('=')
      dispatch(addAffiliate(codePair[1], '', false))
    }
    dispatch(
      addMultipleItemsToOrder({
        params: {
          skuIDs,
          quantities,
        },
      })
    ).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) toast.success('Added to Cart')
      if (!response.isSuccess()) toast.error('Error')
      return response
    })
  }
}

const addAffiliate = (affiliateCode, skuCode, requestCartRefresh = true) => {
  return async dispatch => {
    if (requestCartRefresh) dispatch(requestCart())
    return await axios({
      method: 'POST',
      withCredentials: true,
      url: `${sdkURL}api/scope/setAffiliate`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        affiliateCode: affiliateCode,
        skuCode: skuCode,
        returnJSONObjects: requestCartRefresh ? 'cart' : '',
      },
    }).then(response => {
      if (response?.status === 200) {
        if (requestCartRefresh) dispatch(receiveCart(response.data.cart))
      }
      return response
    })
  }
}

const getEligibleFulfillmentMethods = () => {
  return async dispatch => {
    return dispatch(getEligibleOrderFulfillmentMethods({})).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

const getPickupLocations = () => {
  return async dispatch => {
    return dispatch(getAllPickupLocations({})).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

const clearOrderFulfillment = orderFulfillmentID => {
  return async dispatch => {
    return dispatch(clearFulfillmentOnOrder({ params: { orderFulfillmentID } })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

const addPickupLocation = params => {
  return async dispatch => {
    return dispatch(addPickupLocationToOrderFulfillment({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}
const setPickupDate = params => {
  return async dispatch => {
    return dispatch(setPickupDateToOrderFulfillment({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}
const updateOrderNotes = params => {
  return async dispatch => {
    return dispatch(updateNotesOnOrder({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}
const updateItemQuantity = (skuID, quantity = 1) => {
  return async dispatch => {
    dispatch(
      updateOrderItemQuantity({
        orderItem: {
          sku: {
            skuID,
          },
          qty: quantity,
        },
      })
    ).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) toast.success('Quantity Update')
      return response
    })
  }
}

const removeItem = orderItemID => {
  return async dispatch => {
    return dispatch(removeOrderItem({ params: { orderItemID } })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

const addShippingAddress = (params = {}) => {
  return async dispatch => {
    return dispatch(addShippingAddressToOrderFulfillment({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}
const addShippingAddressUsingAccountAddress = (params = {}) => {
  return async dispatch => {
    return dispatch(addShippingAddressUsingAccountAddressToOrderFulfillment({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

const addShippingMethod = (params = {}) => {
  return async dispatch => {
    return dispatch(addShippingMethodToOrderFulfillment({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

const updateFulfillment = (params = {}) => {
  return async dispatch => {
    return dispatch(updateOrderFulfillment({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

const applyPromoCode = (promotionCode, successMsg = '') => {
  return async dispatch => {
    dispatch(
      applyPromoCodeToOrder({
        params: {
          promotionCode,
          returnJSONObjects: 'cart',
        },
      })
    ).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        if (successMsg !== '' && !Object.keys(response.success()?.errors || {}).length) {
          toast.success(successMsg)
        }
      }
      return response
    })
  }
}

const removePromoCode = (promotionCode, promotionCodeID, successMsg = '') => {
  return async dispatch => {
    return dispatch(
      removePromoCodeFromOrder({
        params: {
          promotionCode,
          promotionCodeID,
        },
      })
    ).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        if (successMsg !== '' && !Object.keys(response.success()?.errors || {}).length) {
          toast.success(successMsg)
        }
      }
      return response
    })
  }
}

const addBillingAddress = (params = {}) => {
  return async dispatch => {
    return dispatch(addBillingAddressToOrderFulfillment({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))

      return response
    })
  }
}

const addPayment = (params = {}) => {
  return async dispatch => {
    return dispatch(addPaymentToOrder({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (!response.isSuccess()) toast.error('An Error Occured')

      return response
    })
  }
}

const removePayment = (params = {}) => {
  return async dispatch => {
    return dispatch(removeOrderPayment({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))

      return response
    })
  }
}

const placeOrder = () => {
  return async dispatch => {
    return dispatch(placeMyOrder({})).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

const addNewAddressAndAttachAsShipping = (params = {}) => {
  return async dispatch => {
    return dispatch(addNewAddressAndAttachAsShippingOnOrderFulfillment({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

const changeOrderFulfillment = (params = {}) => {
  return async dispatch => {
    return dispatch(changeFulfillmentOnOrder({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))

      return response
    })
  }
}

const addBillingAddressUsingAccountAddress = (params = {}) => {
  return async dispatch => {
    return dispatch(addBillingAddressUsingAccountAddressOnOrderFulfillment({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))

      return response
    })
  }
}

const addNewAccountAndSetAsBilling = (params = {}) => {
  return async dispatch => {
    return dispatch(addNewAccountAndSetAsBillingOnOrderFulfillment({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

const addAddressAndAttachAsBilling = (params = {}) => {
  return async dispatch => {
    return dispatch(addAddressAndAttachAsBillingOnOrderFulfillment({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      return response
    })
  }
}

const addAddressAndPaymentAndAddToOrder = (params = {}) => {
  return async dispatch => {
    dispatch(addAddressAndPaymentAndThenAddToOrder({ params })).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))

      return response
    })
  }
}
export { getCart, setOrderOnCart, clearCartData, addMultipleItemsToCart, addToCart, addAffiliate, getEligibleFulfillmentMethods, getPickupLocations, addPickupLocation, setPickupDate, updateOrderNotes, updateItemQuantity, removeItem, addShippingAddress, addShippingAddressUsingAccountAddress, addShippingMethod, updateFulfillment, applyPromoCode, removePromoCode, addBillingAddress, addPayment, removePayment, placeOrder, addNewAddressAndAttachAsShipping, changeOrderFulfillment, addBillingAddressUsingAccountAddress, addNewAccountAndSetAsBilling, addAddressAndPaymentAndAddToOrder, clearOrderFulfillment, addAddressAndAttachAsBilling }
