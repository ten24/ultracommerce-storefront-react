import { useDispatch, useSelector } from 'react-redux'
import { addSkuToWishList, removeWishlistItem, createListAndAddItem } from '../../actions/'
import { getDefaultWishlist, getItemsForDefaultWishList } from '../../selectors/'
import { isAuthenticated } from '../../utils'

const HeartButton = ({ skuID, className = 'link btn-wishlist' }) => {
  const dispatch = useDispatch()
  const primaryColor = useSelector(state => state.configuration.theme.primaryColor)
  const defaultWishlist = useSelector(getDefaultWishlist)
  const isListLoaded = useSelector(state => state.userReducer.wishList.isListLoaded)
  const items = useSelector(getItemsForDefaultWishList)

  if (!isAuthenticated()) {
    return null
  }

  if (items.includes(skuID)) {
    return (
      <button
        className={className}
        onClick={e => {
          e.preventDefault()
          dispatch(removeWishlistItem(skuID, defaultWishlist?.value))
        }}
        type="button"
        data-toggle="tooltip"
        data-placement="left"
        title=""
        data-original-title="Remove from wishlist"
      >
        <i className="bi bi-heart-fill link" style={{ color: `#${primaryColor}` }}></i>
      </button>
    )
  } else {
    return (
      <button
        onClick={e => {
          e.preventDefault()
          if (isListLoaded && !defaultWishlist?.value) {
            dispatch(createListAndAddItem(skuID))
          } else {
            dispatch(addSkuToWishList(skuID, defaultWishlist?.value))
          }
        }}
        className={className}
        type="button"
        data-toggle="tooltip"
        data-placement="left"
        title=""
        data-original-title="Add to wishlist"
      >
        <i className="bi bi-heart"></i>
      </button>
    )
  }
}
export { HeartButton }
