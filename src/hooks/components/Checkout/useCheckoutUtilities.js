export const CREDIT_CARD = '444df303dedc6dab69dd7ebcc9b8036a'

export const PAYPAL_PAYMENT_CODE = 'braintree'
export const PAYPAL_COMMERCE_CODE = 'paypalcommerce'

export const CREDIT_CARD_CODE = 'creditCard'
export const GIFT_CARD_CODE = 'giftCard'
export const TERM_PAYMENT_CODE = 'termPayment'
export const CASH_PAYMENT_CODE = 'cash'
export const CHECK_PAYMENT_CODE = 'check'
export const EXTERNAL_PAYMENT_CODE = 'external'

export const SHIPPING_CODE = 'shipping'
export const PICKUP_CODE = 'pickup'
export const AUTO_CODE = 'auto'

const getBillingAccountAddressIDFromPaymentMethod = (accountAddresses, payment) => {
  const selectAccount = getBillingAccountAddressFromPaymentMethod(accountAddresses, payment)
  return !!selectAccount ? selectAccount.selectedAccountID : ''
}
const getBillingAccountAddressFromPaymentMethod = (accountAddresses, payment) => {
  return accountAddresses
    ?.filter(({ accountAddressID }) => {
      return accountAddressID === payment.billingAccountAddress.accountAddressID
    })
    ?.map(({ accountAddressID }) => {
      return accountAddressID
    })
    ?.at(0)
}
const getPaymentMethodByIDFromList = (eligiblePaymentMethodDetails, id) => {
  return eligiblePaymentMethodDetails.filter(({ paymentMethodID }) => id === paymentMethodID).at(0)
}

const useCheckoutUtilities = () => {
  const months = Array.from({ length: 12 }, (_, i) => {
    return { key: i + 1, value: i + 1 }
  }).map(month => {
    return {
      key: month.key,
      value: month.value.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }),
    }
  })
  const years = Array(10)
    .fill(new Date().getFullYear())
    .map((year, index) => {
      return { key: year + index, value: year + index }
    })

  return { getPaymentMethodByIDFromList, CHECK_PAYMENT_CODE, SHIPPING_CODE, PICKUP_CODE, AUTO_CODE, CREDIT_CARD, CREDIT_CARD_CODE, GIFT_CARD_CODE, TERM_PAYMENT_CODE, CASH_PAYMENT_CODE, EXTERNAL_PAYMENT_CODE, months, years, getBillingAccountAddressIDFromPaymentMethod, getBillingAccountAddressFromPaymentMethod, PAYPAL_PAYMENT_CODE, PAYPAL_COMMERCE_CODE }
}

export { useCheckoutUtilities }
