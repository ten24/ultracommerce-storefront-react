import { ProductPrice, ProductImage } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { updateItemQuantity, removeItem } from '../../actions/'
import { useFormatCurrency } from '../../hooks/'
import { getProductRoute } from '../../selectors/'
import queryString from 'query-string'

const CartLineItem = ({ orderItemID, isDisabled = false, setRemoveitem = () => {} }) => {
  const { isFetching, orderItems } = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const [formatCurrency] = useFormatCurrency({})
  const productRouting = useSelector(getProductRoute)
  const { t } = useTranslation()

  const orderItem = orderItems.filter(orderItem => {
    return orderItem.orderItemID === orderItemID
  })
  const { price, quantity, sku, extendedPriceAfterDiscount } = orderItem[0]
  const { skuID, skuCode, product, imageFile, skuPrices = [] } = sku
  const listPrice = skuPrices.map(price => price.listPrice).sort((a, b) => a - b)[0] || 0
  const { productName, urlTitle, brand } = product

  const isBackordered = false

  return (
    <div className="row border-bottom p-3">
      <div className="col-sm-2 col-3">
        <Link className="d-inline-block mx-auto mr-sm-4 image-width" to={urlTitle}>
          <ProductImage skuID={skuID} imageFile={imageFile} customClass="img-fluid img-placeholder  m-auto image_container" />
        </Link>
      </div>
      <div className="col-sm-4 col-9">
        <h5>
          <Link
            to={{
              pathname: `/${productRouting}/${urlTitle}`,
              search: queryString.stringify({ skuid: skuID }, { arrayFormat: 'comma' }),
              state: { ...product },
            }}
          >
            {productName}
          </Link>
        </h5>
        <div className="font-size-sm">
          {`${brand && brand.brandName} `}
          <span className="text-muted mr-2">{skuCode}</span>
        </div>
      </div>
      <div className="col-sm-12 col-md-6 d-none d-sm-block">
        <div className="row">
          <div className="col-sm-3">
            <ProductPrice salePrice={listPrice} listPrice={price} salePriceSuffixKey="frontend.core.each" accentSalePrice={false} />
          </div>
          {isBackordered && (
            <div className="col-sm-3">
              <i className="fal fa-exclamation-circle"></i>
              <p className="text-sm mb-0">{t('frontend.order.backorder')}</p>
            </div>
          )}
          {!isDisabled ? (
            <>
              <div className="col-sm-3">
                <input
                  className="form-control"
                  type="number"
                  id="quantity4"
                  defaultValue={quantity}
                  disabled={isFetching}
                  onChange={e => {
                    dispatch(updateItemQuantity(skuID, e.target.value))
                  }}
                />
              </div>
              <div className="col-sm-4">
                <h6>
                  <span className="text-muted">
                    <strong>{formatCurrency(extendedPriceAfterDiscount)}</strong>
                  </span>
                </h6>
              </div>
              <div className="col-sm-1">
                <span
                  className="bi bi-trash"
                  disabled={isFetching}
                  onClick={event => {
                    setRemoveitem(true)
                    event.preventDefault()
                    dispatch(removeItem(orderItemID))
                  }}
                ></span>
              </div>
            </>
          ) : (
            <div className="col-sm-3">{quantity}</div>
          )}
        </div>
        {isFetching && (
          <div className="alert alert-success p-2 my-2">
            <small> {t('frontend.cart.quantityUpdate')}</small>
          </div>
        )}
      </div>
    </div>
  )
}
export { CartLineItem }
