import { ProductPrice, SimpleImage } from '../../components'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { requestSubscriptionCart, removeOrderTemplateItem, receiveSubscriptionCart } from '../../actions/'
import { useOrderTemplateCartLineItem, useFormatCurrency } from '../../hooks/'
import { getErrorMessage } from '../../utils'
import { SlatwalApiService } from '../../services'
import { useState } from 'react'
import { toast } from 'react-toastify'

const OrderTemplateCartLineItem = ({ orderTemplateID, orderTemplateItemID, isDisabled = false, setRemoveitem = () => {} }) => {
  const [formatCurrency] = useFormatCurrency({})
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { orderTemplateItem, productRouting, isFetching, isBackordered } = useOrderTemplateCartLineItem(orderTemplateItemID)
  const [itemCount, setItemCount] = useState(orderTemplateItem.quantity)

  const updateOrderTemplateItemQuantity = (orderTemplateItemID, itemCount) => {
    dispatch(requestSubscriptionCart())
    SlatwalApiService.orderTemplate.editOrderTemplateItem({ orderTemplateItemID: orderTemplateItemID, orderTemplateID: orderTemplateID, quantity: itemCount, returnJsonObjects: 'orderTemplateCart' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveSubscriptionCart(response.success().orderTemplateCart))
        toast.success(t('frontend.account.scheduled.delivery.detail.toolbar.subscriptionModal.successMessage'))
      } else {
        toast.error(t('frontend.core.error.network'))
      }
    })
  }

  return (
    <div className="row border-bottom py-3">
      <div className="col-sm-2 col-3">
        <Link className="d-inline-block mx-auto mr-sm-4 image-width" to={`/${productRouting}/${orderTemplateItem.sku.product.urlTitle}`}>
          {orderTemplateItem.sku.images && orderTemplateItem.sku.images?.length > 0 && <SimpleImage className="img-fluid  m-auto image_container productImage" src={orderTemplateItem.sku.images?.at(0)} alt={orderTemplateItem.sku.product.productName} type="product" />}
        </Link>
      </div>
      <div className="col-sm-4 col-9">
        <h5>
          <Link
            to={{
              pathname: `/${productRouting}/${orderTemplateItem.sku.product.urlTitle}`,
              state: { ...orderTemplateItem.sku.product },
            }}
            className="link"
          >
            {orderTemplateItem.sku.product.productName}
          </Link>
        </h5>
        <div className="font-size-sm">
          <span className="text-muted mr-2"> {orderTemplateItem.sku.product.brand && `${orderTemplateItem.sku.product.brand.brandName} `}</span>
        </div>
        <div className="font-size-sm">
          <span className="text-muted mr-2">{orderTemplateItem.sku.skuCode}</span>
        </div>
      </div>
      <div className="col-sm-12 col-md-6 d-none d-sm-block">
        <div className="row">
          <div className="col-sm-3">
            <ProductPrice type="cart" salePrice={orderTemplateItem.calculatedTotal / orderTemplateItem.quantity} listPrice={orderTemplateItem.calculatedTotal / orderTemplateItem.quantity} salePriceSuffixKey="frontend.core.each" accentSalePrice={false} />
          </div>
          {isBackordered && (
            <div className="col-sm-3">
              <i className="fal fa-exclamation-circle"></i>
              <p className="text-sm mb-0">{t('frontend.order.backorder')}</p>
            </div>
          )}
          {!isDisabled ? (
            <>
              <div className="col-sm-4">
                <input
                  type="number"
                  className="form-control"
                  value={itemCount}
                  disabled={isFetching && orderTemplateItem.sku.skuID}
                  onChange={e => {
                    setItemCount(e.target.value)
                  }}
                />
                <button
                  className="btn text-muted btn-link p-1 text-end"
                  onClick={() => {
                    updateOrderTemplateItemQuantity(orderTemplateItem.orderTemplateItemID, itemCount)
                  }}
                >
                  {t('frontend.account.scheduled.delivery.history.updateQuantity')}
                </button>
              </div>
              <div className="col-sm-4">
                <h6>
                  <span className="text-muted">
                    <strong>{formatCurrency(orderTemplateItem.calculatedTotal)}</strong>
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
                    dispatch(removeOrderTemplateItem(orderTemplateID, orderTemplateItem.orderTemplateItemID)).then(response => {
                      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                      if (response.isSuccess()) toast.success(t('frontend.cart.removeCartItem'))
                    })
                  }}
                ></span>
              </div>
            </>
          ) : (
            <>
              <div className="col-sm-3">
                <small>{t('frontend.cart.quantity')}</small> {orderTemplateItem.quantity}
              </div>
              <div className="col-sm-4">
                <h6>
                  <span className="text-muted">
                    <strong>{formatCurrency(orderTemplateItem.calculatedTotal)}</strong>
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
export { OrderTemplateCartLineItem }
