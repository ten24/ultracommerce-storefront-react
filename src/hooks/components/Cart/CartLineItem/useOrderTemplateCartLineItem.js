import { useSelector } from 'react-redux'
import { getProductRoute } from '../../../../selectors'

const useOrderTemplateCartLineItem = orderItemID => {
  const { isFetching, orderTemplateItems } = useSelector(state => state.subscriptionCart)
  const productRouting = useSelector(getProductRoute)

  const orderTemplateItem = orderTemplateItems.filter(orderTemplateItem => {
    return orderTemplateItem.orderTemplateItemID === orderItemID
  })[0]
  const { skuPrices = [] } = orderTemplateItem.sku
  const listPrice = skuPrices.map(price => price.listPrice).sort((a, b) => a - b)[0] || 0

  const isBackordered = false
  return { orderTemplateItem, listPrice, productRouting, isFetching, isBackordered }
}
export { useOrderTemplateCartLineItem }
