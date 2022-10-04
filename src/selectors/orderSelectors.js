import { createSelector } from 'reselect'
import { AUTO_CODE } from '../hooks/components/Checkout/useCheckoutUtilities'

export const getAllOrderFulfillments = state => {
  if (state.cart.orderFulfillments?.length > 1) {
    return state.cart.orderFulfillments.filter(fulfillment => fulfillment.fulfillmentMethod.fulfillmentMethodType !== AUTO_CODE)
  }
  return state.cart.orderFulfillments
}
const getAllAccountAddresses = state => state.userReducer.accountAddresses
const getAllAccountPaymentMethods = state => state.userReducer.accountPaymentMethods
export const getAllPickupLocations = state => state.cart.pickupLocations
export const getAllOrderPayments = state => state.cart.orderPayments?.filter(({ creditCardType, orderPaymentStatusType }) => creditCardType !== 'Invalid' && orderPaymentStatusType.systemCode !== 'opstRemoved')
export const getAllEligiblePaymentMethodDetails = state => state.cart.eligiblePaymentMethodDetails
export const getAllEligibleFulfillmentMethods = state => state.cart.eligibleFulfillmentMethods
export const getAllOrderItems = state => state.cart.orderItems
export const isFetching = state => state.cart.isFetching
export const getAllOrderTemplateItems = state => state.subscriptionCart.orderTemplateItems
export const isOrderTemplateFetching = state => state.subscriptionCart.isFetching

export const isAllowedToSwitchFulfillmentMethod = createSelector([getAllOrderFulfillments, getAllEligibleFulfillmentMethods], (orderFulfillments, eligibleFulfillmentMethods) => {
  return orderFulfillments?.length === 1 && orderFulfillments.filter(fulfillment => fulfillment.fulfillmentMethod.fulfillmentMethodType !== AUTO_CODE)?.length === 1 && eligibleFulfillmentMethods?.length > 1
})

export const hasOrderItems = createSelector(getAllOrderItems, orderItems => {
  return orderItems.length ? true : false
})

export const orderItemsCountSelector = createSelector(getAllOrderItems, orderItems => {
  return orderItems.length
})

export const disableInteractionSelector = createSelector([hasOrderItems, isFetching], (validOI, fetching) => {
  return !(validOI && !fetching)
})

export const hasOrderTemplateItems = createSelector(getAllOrderTemplateItems, orderTemplateItems => {
  return orderTemplateItems.length ? true : false
})

export const disableInteractionForOrderTemplateCheckoutSelector = createSelector([hasOrderTemplateItems, isOrderTemplateFetching], (validOI, fetching) => {
  return !(validOI && !fetching)
})

export const fulfillmentMethodSelector = createSelector(getAllOrderFulfillments, orderFulfillments => {
  let selectedFulfillmentMethod = { fulfillmentMethodID: '' }
  if (orderFulfillments?.at(0) && orderFulfillments?.at(0).fulfillmentMethod) {
    selectedFulfillmentMethod = orderFulfillments?.at(0).fulfillmentMethod
  }
  return selectedFulfillmentMethod
})

export const fulfillmentSelector = createSelector(getAllOrderFulfillments, orderFulfillments => {
  let selectedFulfillment = { fulfillmentMethodID: '', fulfillmentMethod: { fulfillmentMethodType: '' } }
  if (orderFulfillments?.at(0)) {
    selectedFulfillment = orderFulfillments?.at(0)
  }
  return selectedFulfillment
})

export const shippingAddressSelector = createSelector(fulfillmentSelector, orderFulfillment => {
  return orderFulfillment.shippingAddress || {}
})

export const shippingMethodSelector = createSelector(getAllOrderFulfillments, orderFulfillments => {
  let selectedFulfillmentMethod = { shippingMethodID: '' }
  if (orderFulfillments?.at(0) && orderFulfillments?.at(0).shippingMethod) {
    selectedFulfillmentMethod = orderFulfillments?.at(0).shippingMethod
  }
  return selectedFulfillmentMethod
})

export const accountAddressSelector = createSelector([getAllAccountAddresses, getAllOrderFulfillments], (accountAddresses, orderFulfillments) => {
  let selectedAccountID = ''
  if (orderFulfillments.length && accountAddresses.length && orderFulfillments?.at(0).accountAddress) {
    const selectAccount = accountAddresses
      .filter(({ accountAddressID }) => {
        return accountAddressID === orderFulfillments?.at(0).accountAddress.accountAddressID
      })
      .map(({ accountAddressID }) => {
        return accountAddressID
      })
    selectedAccountID = selectAccount.length ? selectAccount?.at(0) : ''
  }

  return selectedAccountID
})

export const pickupLocationOptions = createSelector(getAllPickupLocations, (locations = []) => {
  return locations.map(location => {
    return { name: location['NAME'], value: location['VALUE'] }
  })
})

export const pickupLocationSelector = createSelector(fulfillmentSelector, fulfillment => {
  let location = { locationID: '' }
  if (fulfillment.pickupLocation) {
    location = fulfillment.pickupLocation
  }
  return location
})

export const orderPayment = createSelector(getAllOrderPayments, orderPayments => {
  let orderPayment = { paymentMethod: { paymentMethodID: '' }, accountPaymentMethod: { accountPaymentMethodID: '' } }
  if (orderPayments.length) {
    orderPayment = orderPayments?.at(0)
  }
  return orderPayment
})

export const eligiblePaymentMethodDetailSelector = createSelector(getAllEligiblePaymentMethodDetails, (eligiblePaymentMethodDetails = []) => {
  return eligiblePaymentMethodDetails.map(({ paymentMethod }) => {
    return { ...paymentMethod, name: paymentMethod.paymentMethodName, value: paymentMethod.paymentMethodID }
  })
})

export const billingAccountAddressSelector = createSelector([getAllAccountAddresses, orderPayment], (accountAddresses, paymentOnOrder) => {
  let selectedAccountID = ''
  if (accountAddresses.length && paymentOnOrder && paymentOnOrder.billingAccountAddress) {
    const selectAccount = accountAddresses
      .filter(({ accountAddressID }) => {
        return accountAddressID === paymentOnOrder.billingAccountAddress.accountAddressID
      })
      .map(({ accountAddressID }) => {
        return accountAddressID
      })
    selectedAccountID = selectAccount.length ? selectAccount?.at(0) : ''
  }

  return selectedAccountID
})

export const billingAddressNickname = createSelector([getAllAccountPaymentMethods, orderPayment], (accountPaymentMethods, payment) => {
  let billingAddressNickname = ''
  if (payment && payment.accountPaymentMethod) {
    billingAddressNickname = accountPaymentMethods
      .filter(({ accountPaymentMethodID }) => {
        return accountPaymentMethodID === payment.accountPaymentMethod.accountPaymentMethodID
      })
      .map(({ accountPaymentMethodName }) => {
        return accountPaymentMethodName
      })
    billingAddressNickname = billingAddressNickname.length ? billingAddressNickname?.at(0) : ''
  }
  return billingAddressNickname
})
export const shippingAddressNicknameSelector = createSelector([fulfillmentSelector, getAllAccountAddresses], (fulfillment, accountAddresses = []) => {
  let shippingAddressNickname = accountAddresses
    .filter(accountAddress => {
      return fulfillment.shippingAddress && accountAddress.address.addressID === fulfillment.shippingAddress.addressID
    })
    .map(({ accountAddressName }) => {
      return accountAddressName
    })
  shippingAddressNickname = shippingAddressNickname.length ? shippingAddressNickname?.at(0) : ''

  return shippingAddressNickname
})
