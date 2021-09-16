import { ProductPrice, ProductImage } from '../../components'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { updateItemQuantity, removeItem } from '../../actions/'
import { useCartLineItem, useFormatCurrency } from '../../hooks/'

const CartLineItem = ({ orderItemID, isDisabled = false, setRemoveitem = () => {} }) => {
  const [formatCurrency] = useFormatCurrency({})
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { orderItem, listPrice, productRouting, isFetching, isBackordered } = useCartLineItem(orderItemID)
  return (
    <div className="row border-bottom py-3">
      <div className="col-sm-2 col-3">
        <Link className="d-inline-block mx-auto mr-sm-4 image-width" to={`/${productRouting}/${orderItem.sku.product.urlTitle}`}>
          <ProductImage skuID={orderItem.sku.skuID} imageFile={orderItem.sku.imageFile} fallbackFileName={orderItem.sku.product.imageFallbackFileName} customClass="img-fluid  m-auto image_container" />
        </Link>
      </div>
      <div className="col-sm-4 col-9">
        <h5>
          <Link
            to={{
              pathname: `/${productRouting}/${orderItem.sku.product.urlTitle}`,
              state: { ...orderItem.sku.product },
            }}
            className="link"
          >
            {orderItem.sku.product.productName}
          </Link>
        </h5>
        <div className="font-size-sm">
          <span className="text-muted mr-2"> {orderItem.sku.product.brand && `${orderItem.sku.product.brand.brandName} `}</span>
        </div>
        <div className="font-size-sm">
          <span className="text-muted mr-2">{orderItem.sku.skuCode}</span>
        </div>
      </div>
      <div className="col-sm-12 col-md-6 d-none d-sm-block">
        <div className="row">
          <div className="col-sm-3">
            <ProductPrice type="cart" salePrice={orderItem.price} listPrice={listPrice} salePriceSuffixKey="frontend.core.each" accentSalePrice={false} />
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
                  defaultValue={orderItem.quantity}
                  disabled={isFetching && orderItem.sku.skuID}
                  onBlur={e => {
                    dispatch(updateItemQuantity(orderItem.sku.skuID, e.target.value))
                  }}
                  // onClick={e => {
                  //   dispatch(updateItemQuantity(orderItem.sku.skuID, e.target.value))
                  // }}
                />
              </div>
              <div className="col-sm-4">
                <h6>
                  <span className="text-muted">
                    <strong>{formatCurrency(orderItem.extendedPriceAfterDiscount)}</strong>
                  </span>
                </h6>
              </div>
              <div className="col-sm-1">
                <span
                  className="bi bi-trash clickable"
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
            <>
              <div className="col-sm-3">
                <small>{t('frontend.cart.quantity')}</small> {orderItem.quantity}
              </div>
              <div className="col-sm-4">
                <h6>
                  <span className="text-muted">
                    <strong>{formatCurrency(orderItem.extendedPriceAfterDiscount)}</strong>
                  </span>
                </h6>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export { CartLineItem }
