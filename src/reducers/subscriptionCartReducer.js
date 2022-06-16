import { REQUEST_SUBSCRIPTION_CART, RECEIVE_SUBSCRIPTION_CART, CLEAR_SUBSCRIPTION_CART } from '../actions'

const initState = {
  canceledDateTime: '',
  calculatedFulfillmentDiscount: 0,
  mostRecentError: '',
  orderTemplateItems: [],
  calculatedDiscountTotal: 0,
  paymentPendingFlag: false,
  orderTemplateNumber: '',
  calculatedVatTotal: 0,
  calculatedTaxTotal: 0,
  lastOrderPlacedDateTime: '',
  mostRecentErrorDateTime: '',
  activationDateTime: '',
  calculatedFulfillmentHandlingFeeTotal: 0,
  promotionCodes: [],
  scheduleOrderNextPlaceDateTime: '',
  calculatedSubTotal: 0,
  calculatedTotal: 0,
  orderTemplateID: '',
  orderTemplateName: '',
  frequencyTerm: {
    termID: '',
    termName: '',
  },
  shippingAccountAddress: {
    accountAddressID: '',
  },
  shippingMethod: {
    shippingMethodID: '',
  },
  calculatedFulfillmentTotal: 0,
  isFetching: false,
}

const subscriptionCartReducer = (state = initState, action) => {
  switch (action.type) {
    case REQUEST_SUBSCRIPTION_CART:
      return { ...state, isFetching: true }
    case RECEIVE_SUBSCRIPTION_CART:
      const { cart } = action
      return { ...state, ...cart, isFetching: false, err: null }
    case CLEAR_SUBSCRIPTION_CART:
      return { ...initState, isFetching: false, err: null }

    default:
      return { ...state }
  }
}

export default subscriptionCartReducer
