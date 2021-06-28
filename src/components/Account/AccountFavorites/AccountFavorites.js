import React, { useState } from 'react'
// import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useGetProductsByEntity } from '../../../hooks/'
import { ListingPagination, Grid, AccountLayout } from '../../'
import { getItemsForDefaultWishList } from '../../../selectors/'
import { useTranslation } from 'react-i18next'

const AccountFavorites = () => {
  const items = useSelector(getItemsForDefaultWishList)
  const isListItemsLoaded = useSelector(state => state.userReducer.wishList.isListItemsLoaded)
  let [productList, setRequest] = useGetProductsByEntity()
  let [skuList, setSkuList] = useState(items)
  const [currentPage, setPage] = useState(1)
  const countToDisplay = 6

  if (isListItemsLoaded && !productList.isFetching && !productList.isLoaded) {
    setSkuList(items)
    setRequest({ ...productList, entity: 'product', params: { 'f:skus.skuID:in': items.join(), 'p:show': 250 }, makeRequest: true, isFetching: true, isLoaded: false })
  }

  if (skuList !== items) {
    setSkuList(items)
    setRequest({ ...productList, entity: 'product', params: { 'f:skus.skuID:in': items.join(), 'p:show': 250 }, makeRequest: true, isFetching: true, isLoaded: false })
  }
  const start = (currentPage - 1) * countToDisplay
  const end = start + countToDisplay
  const { t } = useTranslation()
  return (
    <AccountLayout>
      <h2 className="h3 mb-3">{t('frontend.account.favorites.title')}</h2>
      <Grid
        isFetching={productList.isFetching}
        products={productList.data.slice(start, end).map(({ urlTitle, productID, productName, defaultSku_imageFile, calculatedSalePrice, defaultSku_listPrice, defaultSku_skuID }) => {
          return { urlTitle, productID, calculatedSalePrice, productName, sku_imageFile: defaultSku_imageFile, sku_price: defaultSku_listPrice, skuID: defaultSku_skuID }
        })}
      />
      <ListingPagination recordsCount={productList.data.length} totalPages={Math.ceil(productList.data.length / countToDisplay)} setPage={setPage} />
    </AccountLayout>
  )
}

export { AccountFavorites }
