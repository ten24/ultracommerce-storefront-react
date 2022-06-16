const transformBillingAddressDetails = (orderInfo, orderPayment) => {
  return { billingAddress: { name: orderInfo.billingAddress_name || orderPayment.billingAddress_name, streetAddress: orderInfo.billingAddress_streetAddress || orderPayment.billingAddress_streetAddress, city: orderInfo.billingAddress_city || orderPayment.billingAddress_city, stateCode: orderInfo.billingAddress_stateCode || orderPayment.billingAddress_stateCode, postalCode: orderInfo.billingAddress_postalCode || orderPayment.billingAddress_postalCode, emailAddress: orderInfo.billingAddress_emailAddress || orderPayment.billingAddress_emailAddress } }
}
const transformShipping = orderFulfillment => {
  return { name: orderFulfillment.orderFulfillment_shippingAddress_name, streetAddress: orderFulfillment.orderFulfillment_shippingAddress_streetAddress, city: orderFulfillment.orderFulfillment_shippingAddress_city, emailAddress: orderFulfillment.orderFulfillment_shippingAddress_emailAddress, stateCode: orderFulfillment.orderFulfillment_shippingAddress_stateCode, postalCode: orderFulfillment.orderFulfillment_shippingAddress_postalCode, shippingMethod: orderFulfillment.orderFulfillment_shippingMethod_shippingMethodName }
}
const transformPickup = orderFulfillment => {
  return { locationName: orderFulfillment.orderFulfillment_pickupLocation_locationName }
}
const transformCreditCardPayment = orderPayment => {
  return { ...orderPayment, paymentMethod: { paymentMethodName: orderPayment.paymentMethod_paymentMethodName } }
}
const transformGiftCardPayment = (orderPayment = {}) => {
  return orderPayment
}
const transformCashPayment = (orderPayment = {}) => {
  return orderPayment
}
const transformTermPayment = orderPayment => {
  return { purchaseOrderNumber: orderPayment.purchaseOrderNumber, paymentMethod: { paymentMethodName: orderPayment.paymentMethod_paymentMethodName } }
}
const transformExternalPayment = orderPayment => {
  return { ...orderPayment, paymentMethod: { paymentMethodName: orderPayment.paymentMethod_paymentMethodName } }
}

const useSingleAccountOrderDetails = ({ orderInfo, orderFulfillments, orderPayments }) => {
  const { orderFulfillment_shippingAddress_emailAddress, orderFulfillment_fulfillmentMethod_fulfillmentMethodType: fulfillmentMethodType, orderFulfillment_shippingAddress_name, orderFulfillment_shippingAddress_streetAddress, orderFulfillment_shippingAddress_city, orderFulfillment_shippingAddress_stateCode, orderFulfillment_shippingMethod_shippingMethodName, orderFulfillment_shippingAddress_postalCode, orderFulfillment_pickupLocation_locationName } = orderFulfillments
  const { paymentMethod_paymentMethodType, paymentMethod_paymentMethodName, purchaseOrderNumber } = orderPayments
  const billingAddressDetails = { billingAddress: { name: orderInfo.billingAddress_name || orderPayments.billingAddress_name, streetAddress: orderInfo.billingAddress_streetAddress || orderPayments.billingAddress_streetAddress, city: orderInfo.billingAddress_city || orderPayments.billingAddress_city, stateCode: orderInfo.billingAddress_stateCode || orderPayments.billingAddress_stateCode, postalCode: orderInfo.billingAddress_postalCode || orderPayments.billingAddress_postalCode, emailAddress: orderInfo.billingAddress_emailAddress || orderPayments.billingAddress_emailAddress } }

  let shippingAddressDetails = {}
  let pickupLocationDetails = {}
  let termPaymentDetails = {}
  let creditCardPaymentDetails = {}
  let giftCardPaymentDetails = {}
  let cashPaymentDetails = {}
  let externalPaymentDetails = {}

  if (fulfillmentMethodType === 'shipping') {
    shippingAddressDetails = { name: orderFulfillment_shippingAddress_name, streetAddress: orderFulfillment_shippingAddress_streetAddress, city: orderFulfillment_shippingAddress_city, emailAddress: orderFulfillment_shippingAddress_emailAddress, stateCode: orderFulfillment_shippingAddress_stateCode, postalCode: orderFulfillment_shippingAddress_postalCode, shippingMethod: orderFulfillment_shippingMethod_shippingMethodName }
  }
  if (fulfillmentMethodType === 'pickup') {
    pickupLocationDetails = { locationName: orderFulfillment_pickupLocation_locationName }
  }
  if (paymentMethod_paymentMethodType === 'creditCard') {
    creditCardPaymentDetails = { ...orderPayments, paymentMethod: { paymentMethodName: orderPayments.paymentMethod_paymentMethodName } }
  }

  if (paymentMethod_paymentMethodType === 'giftCard') {
    giftCardPaymentDetails = {}
  }

  if (paymentMethod_paymentMethodType === 'cash') {
    cashPaymentDetails = {
      paymentMethod: {
        paymentMethodName: 'Cash',
      },
    }
  }

  if (paymentMethod_paymentMethodType === 'termPayment') {
    termPaymentDetails = { purchaseOrderNumber: purchaseOrderNumber, paymentMethod: { paymentMethodName: paymentMethod_paymentMethodName } }
  }

  if (paymentMethod_paymentMethodType === 'external') {
    externalPaymentDetails = { ...orderPayments, paymentMethod: { paymentMethodName: orderPayments.paymentMethod_paymentMethodName } }
  }

  return { billingAddressDetails, shippingAddressDetails, pickupLocationDetails, termPaymentDetails, creditCardPaymentDetails, externalPaymentDetails, giftCardPaymentDetails, cashPaymentDetails, paymentMethodType: paymentMethod_paymentMethodType, fulfillmentMethodType }
}

export { useSingleAccountOrderDetails, transformBillingAddressDetails, transformShipping, transformPickup, transformCreditCardPayment, transformGiftCardPayment, transformCashPayment, transformTermPayment, transformExternalPayment }
