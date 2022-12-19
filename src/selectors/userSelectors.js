import { createSelector } from 'reselect'
import { toBoolean } from '../utils'

const getAllAccountPaymentMethods = state => state.userReducer.accountPaymentMethods
const getAllAccountAddresses = state => state.userReducer.accountAddresses
const getPrimaryAddress = state => state.userReducer.primaryAddress
const getWishlists = state => state.userReducer.wishList.lists
const getWishlistsItems = state => state.userReducer.wishList.items
const getVerifiedAccountFlag = state => toBoolean(state.userReducer.verifiedAccountFlag)

const creditCardTypePaypal = 'PayPal'

const accountPaymentMethods = createSelector(getAllAccountPaymentMethods, (accountPaymentMethods = []) => {
  return accountPaymentMethods.map(({ accountPaymentMethodName, creditCardType, creditCardLastFour, accountPaymentMethodID }) => {
    return { name: `${accountPaymentMethodName} | ${creditCardType} - *${creditCardLastFour}`, value: accountPaymentMethodID }
  })
})
const getSavedCreditCardMethods = createSelector(getAllAccountPaymentMethods, (accountPaymentMethods = []) => {
  return accountPaymentMethods
    .filter(accountPayment => ![creditCardTypePaypal].includes(accountPayment.creditCardType))
    .filter(accountPayment => accountPayment.creditCardLastFour !== '' || accountPayment.creditCardLastFour !== null || accountPayment.creditCardLastFour !== 'undefined')
    .map(({ accountPaymentMethodName, creditCardType, creditCardLastFour, accountPaymentMethodID }) => {
      return { name: `${accountPaymentMethodName} | ${creditCardType} - *${creditCardLastFour}`, value: accountPaymentMethodID }
    })
})
const getSavedPaypalMethods = createSelector(getAllAccountPaymentMethods, (accountPaymentMethods = []) => {
  return accountPaymentMethods
    .filter(accountPayment => accountPayment.creditCardType === creditCardTypePaypal)
    .map(({ accountPaymentMethodName, creditCardType, accountPaymentMethodID }) => {
      return { name: `${accountPaymentMethodName} | ${creditCardType}`, value: accountPaymentMethodID }
    })
})

const getDefaultWishlist = createSelector(getWishlists, (lists = []) => {
  return lists.length > 0 ? lists?.at(0) : {}
})

const getItemsForDefaultWishList = createSelector(getDefaultWishlist, getWishlistsItems, (defaultWishlist = {}, items = []) => {
  return items
    .filter(item => {
      return item.orderTemplate_orderTemplateID === defaultWishlist?.value
    })
    .map(item => item.sku_skuID)
})
export { getItemsForDefaultWishList, getAllAccountPaymentMethods, getAllAccountAddresses, getPrimaryAddress, getWishlists, getWishlistsItems, getVerifiedAccountFlag, accountPaymentMethods, getSavedCreditCardMethods, getSavedPaypalMethods, getDefaultWishlist }
