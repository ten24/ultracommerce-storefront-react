import { useSelector } from 'react-redux'
import { getVerifiedAccountFlag } from '../../../selectors'
import { useUtilities } from '../../useUtilities'

const useProductPrice = ({ salePrice = 0, listPrice = 0, type = 'product', ShowPriceForUserType = 'All', ignoreDisplayRules = false }) => {
  const { isAuthenticated, isString } = useUtilities()
  const isAuthed = isAuthenticated()
  const isAccountVerified = useSelector(getVerifiedAccountFlag)

  const isValidSalePrice = salePrice > 0
  let salePriceDisplay = salePrice
  if (isString(salePrice)) {
    salePriceDisplay = salePrice.trim().length > 0 ? parseInt(salePrice) : 0
  }
  let listPriceDisplay = listPrice
  if (isString(listPrice)) {
    listPriceDisplay = listPrice.trim().length > 0 ? parseInt(listPrice) : 0
  }
  const isActionRequiredToShowPrice = (ShowPriceForUserType === 'Verified' ? !isAccountVerified : false) || (ShowPriceForUserType === 'Authenticated' ? !isAuthenticated() : false)
  /* showSalePrice
    --Show if the pricing is valid
  */
  const showSalePrice = isValidSalePrice && !isActionRequiredToShowPrice

  /*
  showMissingPrice
    - Never Display In cart
    -- show if we dont have a showSalePrice
  */
  const showMissingPrice = !showSalePrice && type === 'product' && !isActionRequiredToShowPrice

  /*
  showListPrice
    Never show list price if it is invalid or we are showing showMissingPrice CTA
    Only show if list is different than of is the user is not authenticated
  */
  const showListPrice = listPriceDisplay > 0 && salePriceDisplay < listPriceDisplay && salePriceDisplay !== listPriceDisplay && !isActionRequiredToShowPrice
  const showAddToCart = !(salePrice <= 0 && listPrice <= 0)

  return { showAddToCart, showMissingPrice, showListPrice, showSalePrice, isAuthed, isActionRequiredToShowPrice }
}

export { useProductPrice }
