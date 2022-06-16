import { SlatwalApiService } from '../services'
import { receiveUser, requestUser } from './userActions'

const REQUEST_CART = 'REQUEST_CART'
const RECEIVE_CART = 'RECEIVE_CART'
const CONFIRM_ORDER = 'CONFIRM_ORDER'
const CLEAR_CART = 'CLEAR_CART'
const ADD_TO_CART = 'ADD_TO_CART'
const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
const SET_ERROR = 'SET_ERROR'
const requestCart = () => {
  return {
    type: REQUEST_CART,
  }
}

const receiveCart = cart => {
  return {
    type: RECEIVE_CART,
    cart,
  }
}

const confirmOrder = (isPlaced = true) => {
  return {
    type: CONFIRM_ORDER,
    isPlaced,
  }
}
const setError = (error = null) => {
  return {
    type: SET_ERROR,
    error,
  }
}

const clearCart = () => {
  return {
    type: CLEAR_CART,
  }
}

const setUpPayload = ({ payload = {}, isQuote = false, returnQuote = true }) => {
  if (isQuote) delete payload['returnJSONObjects']
  if (isQuote && returnQuote) payload['returnQuote'] = true
  return payload
}

const addToOrder = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addItem(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const addMultipleItemsToOrder = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addItems(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const getOrder = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].get(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const clearOrderData = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].clear(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())

      return response
    })
  }
}

const getEligibleOrderFulfillmentMethods = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = isQuote
      ? setUpPayload({
          payload: {
            returnJSONObjects: 'cart',
            ...params,
          },
          isQuote,
          returnQuote,
        })
      : {}
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].eligibleFulfillmentMethods(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart({ eligibleFulfillmentMethods: response.success().eligibleFulfillmentMethods }))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const getAllPickupLocations = ({ isQuote = false }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    return await SlatwalApiService.location.getPickupLocations().then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart({ pickupLocations: response.success().locations }))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const clearFulfillmentOnOrder = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].clearOrderFulfillment(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}
const addPickupLocationToOrderFulfillment = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addPickupLocation(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const setPickupDateToOrderFulfillment = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].setPickupDate(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const updateNotesOnOrder = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].updateNotes(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const updateOrderItemQuantity = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].updateItemQuantity(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const removeOrderItem = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })

    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].removeItem(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}
const addShippingAddressToOrderFulfillment = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addShippingAddress(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const addShippingAddressUsingAccountAddressToOrderFulfillment = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addShippingAddressUsingAccountAddress(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const addShippingMethodToOrderFulfillment = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addShippingMethod(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const updateOrderFulfillment = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].updateFulfillment(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}
const applyPromoCodeToOrder = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })

    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].applyPromoCode(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const removePromoCodeFromOrder = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].removePromoCode(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const addBillingAddressToOrderFulfillment = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addBillingAddress(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const addPaymentToOrder = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart,account',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    if (isQuote) payload['returnJSONObjects'] = 'account'
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addPayment(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      if (response.isSuccess()) dispatch(receiveUser(response.success().account))
      return response
    })
  }
}

const removeOrderPayment = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].removePayment(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}

const placeMyOrder = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })

    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].placeOrder(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      if (!response.isSuccess() && !isQuote) dispatch(confirmOrder())
      return response
    })
  }
}

const addNewAddressAndAttachAsShippingOnOrderFulfillment = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    dispatch(requestUser())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart,account',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    if (isQuote) payload['returnJSONObjects'] = 'account'
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addNewAddressAndAttachAsShipping(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      if (response.isSuccess()) dispatch(receiveUser(response.success().account))
      if (!response.isSuccess()) dispatch(receiveUser())
      return response
    })
  }
}
const changeFulfillmentOnOrder = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].updateFulfillment(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      return response
    })
  }
}
const addBillingAddressUsingAccountAddressOnOrderFulfillment = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    dispatch(requestUser())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart,account',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    if (isQuote) payload['returnJSONObjects'] = 'account'
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addBillingAddressUsingAccountAddress(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      if (response.isSuccess()) dispatch(receiveUser(response.success().account))
      if (!response.isSuccess()) dispatch(receiveUser())
      return response
    })
  }
}

const addNewAccountAndSetAsBillingOnOrderFulfillment = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    dispatch(requestUser())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart,account',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    if (isQuote) payload['returnJSONObjects'] = 'account'

    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addNewAccountAndSetAsBillingAddress(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      if (response.isSuccess()) dispatch(receiveUser(response.success().account))
      if (!response.isSuccess()) dispatch(receiveUser())
      return response
    })
  }
}

const addAddressAndAttachAsBillingOnOrderFulfillment = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    dispatch(requestUser())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart,account',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    if (isQuote) payload['returnJSONObjects'] = 'account'
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addEditAccountAndSetAsBillingAddress(payload).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      if (response.isSuccess()) dispatch(receiveUser(response.success().account))
      if (!response.isSuccess()) dispatch(receiveUser())
      return response
    })
  }
}
const addAddressAndPaymentAndThenAddToOrder = ({ params = {}, isQuote = false, returnQuote = true }) => {
  return async dispatch => {
    if (!isQuote) dispatch(requestCart())
    dispatch(requestUser())
    const payload = setUpPayload({
      payload: {
        returnJSONObjects: 'cart,account',
        ...params,
      },
      isQuote,
      returnQuote,
    })
    if (isQuote) payload['returnJSONObjects'] = 'account'
    return await SlatwalApiService[isQuote ? 'quotes' : 'cart'].addAccountPaymentMethod({ returnJsonObjects: 'cart,account', ...params }).then(response => {
      if (response.isSuccess() && !isQuote) dispatch(receiveCart(response.success().cart))
      if (!response.isSuccess() && !isQuote) dispatch(receiveCart())
      if (response.isSuccess()) dispatch(receiveUser(response.success().account))
      if (!response.isSuccess()) dispatch(receiveUser())
      return response
    })
  }
}

export {
  REQUEST_CART,
  RECEIVE_CART,
  CONFIRM_ORDER,
  CLEAR_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_ERROR,
  requestCart,
  receiveCart,
  confirmOrder,
  setError,
  addToOrder,
  addMultipleItemsToOrder,
  clearCart,
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
}
