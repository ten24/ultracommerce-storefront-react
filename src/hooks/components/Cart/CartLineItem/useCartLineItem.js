import { useSelector } from 'react-redux'
import { getProductRoute } from '../../../../selectors'

const useCartLineItem = orderItemID => {
  const { isFetching, orderItems } = useSelector(state => state.cart)
  const productRouting = useSelector(getProductRoute)

  const orderItem = orderItems.filter(orderItem => {
    return orderItem.orderItemID === orderItemID
  })[0]
  const { skuPrices = [] } = orderItem.sku
  const listPrice = skuPrices.map(price => price.listPrice).sort((a, b) => a - b)[0] || 0

  const isBackordered = false
  return { orderItem, listPrice, productRouting, isFetching, isBackordered }
}
export { useCartLineItem }
