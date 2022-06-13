import { SlatwalApiService } from '../services'

export const REQUEST_SUBSCRIPTION_CART = 'REQUEST_SUBSCRIPTION_CART'
export const RECEIVE_SUBSCRIPTION_CART = 'RECEIVE_SUBSCRIPTION_CART'
export const CLEAR_SUBSCRIPTION_CART = 'CLEAR_SUBSCRIPTION_CART'
export const ADD_TO_SUBSCRIPTION_CART = 'ADD_TO_SUBSCRIPTION_CART'
export const REMOVE_FROM_SUBSCRIPTION_CART = 'REMOVE_FROM_SUBSCRIPTION_CART'

export const requestSubscriptionCart = () => {
  return {
    type: REQUEST_SUBSCRIPTION_CART,
  }
}

export const receiveSubscriptionCart = cart => {
  return {
    type: RECEIVE_SUBSCRIPTION_CART,
    cart,
  }
}

export const clearSubscriptionCart = () => {
  return {
    type: CLEAR_SUBSCRIPTION_CART,
  }
}

export const removeOrderTemplateItem = (orderTemplateID, orderTemplateItemID) => {
  return async dispatch => {
    dispatch(requestSubscriptionCart())

    return await SlatwalApiService.orderTemplate
      .removeItem({
        orderTemplateID,
        orderTemplateItemID,
        returnJSONObjects: 'orderTemplateCart',
      })
      .then(response => {
        if (response.isSuccess()) dispatch(receiveSubscriptionCart(response.success().orderTemplateCart))
        return response
      })
  }
}

export const applyOrderTemplatePromoCode = (promotionCode, orderTemplateID, successMsg = '') => {
  return async dispatch => {
    dispatch(requestSubscriptionCart())
    return await SlatwalApiService.orderTemplate
      .addPromotionCode({
        promotionCode,
        orderTemplateID,
        returnJSONObjects: 'orderTemplateCart',
      })
      .then(response => {
        if (response.isSuccess()) dispatch(receiveSubscriptionCart(response.success().orderTemplateCart))
        return response
      })
  }
}

export const removeOrderTemplatePromoCode = (promotionCodeID, orderTemplateID) => {
  return async dispatch => {
    dispatch(requestSubscriptionCart())
    return await SlatwalApiService.orderTemplate
      .removePromotionCode({
        promotionCodeID,
        orderTemplateID,
        returnJSONObjects: 'orderTemplateCart',
      })
      .then(response => {
        if (response.isSuccess()) {
          dispatch(receiveSubscriptionCart(response.success().orderTemplateCart))
        }
        return response
      })
  }
}
