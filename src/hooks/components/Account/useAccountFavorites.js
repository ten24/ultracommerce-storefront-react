import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getItemsForDefaultWishList } from '../../../selectors'
import { useGetProductsByEntityModified } from '../../useAPI'

const useAccountFavorites = () => {
  const items = useSelector(getItemsForDefaultWishList)
  const isListItemsLoaded = useSelector(state => state.userReducer.wishList.isListItemsLoaded)
  let [productList, setRequest] = useGetProductsByEntityModified()
  let [skuList, setSkuList] = useState(items)
  const [currentPage, setPage] = useState(1)
  const countToDisplay = 6

  if (isListItemsLoaded && !productList.isFetching && !productList.isLoaded) {
    setSkuList(items)
    setRequest({ ...productList, entity: 'product', params: { 'f:skus.skuID:in': items.join(), 'p:show': 250, includeImages: true }, makeRequest: true, isFetching: true, isLoaded: false })
  }

  if (skuList.length > 0 && skuList !== items) {
    setSkuList(items)
    setRequest({ ...productList, entity: 'product', params: { 'f:skus.skuID:in': items.join(), 'p:show': 250, includeImages: true }, makeRequest: true, isFetching: true, isLoaded: false })
  }
  const start = (currentPage - 1) * countToDisplay
  const end = start + countToDisplay
  const products = productList.data.slice(start, end)
  const totalPages = Math.ceil(products.length / countToDisplay)
  return { products, totalPages, setPage }
}
export { useAccountFavorites }
