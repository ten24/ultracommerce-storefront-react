import { useSelector } from 'react-redux'
import { useUtilities } from '../../useUtilities'

const useProductPrice = ({ salePrice = 0, listPrice = 0, type = 'product' }) => {
  const { isAuthenticated, isString } = useUtilities()
  const isAuthed = isAuthenticated()
  const loginRequiredForPrice = useSelector(state => state.configuration.products.loginRequiredForPrice) && !isAuthed

  const isValidSalePrice = salePrice > 0
  let salePriceDisplay = salePrice
  if (isString(salePrice)) {
    salePriceDisplay = salePrice.trim().length > 0 ? parseInt(salePrice) : 0
  }
  let listPriceDisplay = listPrice
  if (isString(listPrice)) {
    listPriceDisplay = listPrice.trim().length > 0 ? parseInt(listPrice) : 0
  }
  /* showSalePrice
    Show if the pricing i
    s valid
  */
  const showSalePrice = isValidSalePrice && !loginRequiredForPrice

  /*
  showMissingPrice
    - Never Display In cart
    -- show if we dont have a showSalePrice
  */
  const showMissingPrice = !showSalePrice && type === 'product' && !loginRequiredForPrice
  /*
  showListPrice
    Never show list price if it is invalid or we are showing showMissingPrice CTA
    Only show if list is different than of is the user is not authenticated
  */
  const showListPrice = listPriceDisplay > 0 && salePriceDisplay < listPriceDisplay && salePriceDisplay !== listPriceDisplay && !loginRequiredForPrice

  return { showMissingPrice, showListPrice, showSalePrice, isAuthed, loginRequiredForPrice }
}

export { useProductPrice }
