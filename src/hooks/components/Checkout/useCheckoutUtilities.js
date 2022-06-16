export const CREDIT_CARD = '444df303dedc6dab69dd7ebcc9b8036a'
export const GIFT_CARD = '50d8cd61009931554764385482347f3a'
export const TERM_PAYMENT = '2c918084757eecb9017593c084e9001b'
export const CASH_PAYMENT = '2c918084757eecb9017593bff5a6001a'
export const PAYPAL_PAYMENT = '8ab194667c2874eb017c32f467860153'

export const CREDIT_CARD_CODE = 'creditCard'
export const GIFT_CARD_CODE = 'giftCard'
export const TERM_PAYMENT_CODE = 'termPayment'
export const CASH_PAYMENT_CODE = 'cash'
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

  return { SHIPPING_CODE, PICKUP_CODE, AUTO_CODE, CREDIT_CARD, CREDIT_CARD_CODE, GIFT_CARD, GIFT_CARD_CODE, TERM_PAYMENT, TERM_PAYMENT_CODE, CASH_PAYMENT, CASH_PAYMENT_CODE, PAYPAL_PAYMENT, EXTERNAL_PAYMENT_CODE, months, years, getBillingAccountAddressIDFromPaymentMethod, getBillingAccountAddressFromPaymentMethod }
}

export { useCheckoutUtilities }
