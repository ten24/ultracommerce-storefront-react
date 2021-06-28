import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useFormatCurrency } from '../../hooks/'
import { disableInteractionSelector } from '../../selectors'
import { removePromoCode } from '../../actions/cartActions'

const OrderSummary = () => {
  const cart = useSelector(state => state.cart)
  const { total, taxTotal, subtotal, discountTotal, fulfillmentChargeAfterDiscountTotal } = cart
  const [formatCurrency] = useFormatCurrency({})
  const { t } = useTranslation()
  const promotionCodes = useSelector(state => state.cart.promotionCodes)
  const disableInteraction = useSelector(disableInteractionSelector)
  const dispatch = useDispatch()
  return (
    <>
      <div className="card mb-4">
        <div className="card-header">
          <h4 className="mb-0">{t('frontend.cart.orderSummary')}</h4>
        </div>
        <ul className="list-group list-group-flush ">
          <li className="list-group-item d-flex justify-content-between ">
            <h6 className="my-0"> {t('frontend.checkout.subTotal')}</h6>
            <span className="float-end">
              <strong>{subtotal > 0 ? formatCurrency(subtotal) : '--'}</strong>
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between ">
            <h6 className="my-0"> {t('frontend.cart.shippingDelivery')}</h6>
            <span className="float-end">
              <strong>{fulfillmentChargeAfterDiscountTotal > 0 ? formatCurrency(fulfillmentChargeAfterDiscountTotal) : '--'}</strong>
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between ">
            <h6 className="my-0"> {t('frontend.cart.tax')}</h6>

            <span className="float-end">
              <strong>{taxTotal > 0 ? formatCurrency(taxTotal) : '--'}</strong>
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between bg-light">
            <div className="text-success">
              <h6 className="my-0"> {t('frontend.cart.discount')}</h6>
            </div>
            <span className="float-end align-center">
              <span className="badge bg-success "> {discountTotal > 0 ? formatCurrency(discountTotal) : '--'}</span>
            </span>
          </li>

          <li className="list-group-item d-flex justify-content-between bg-light">
            <div className="text-success">
              <h6 className="my-0">{t(`frontend.order.promo.promo_code`)}</h6>
              {promotionCodes.length > 0 &&
                promotionCodes.map(promotionCodeItem => {
                  const { promotionCode, promotion } = promotionCodeItem
                  const { promotionName } = promotion
                  return (
                    <div key={promotionCode}>
                      <span
                        className="badge bg-success"
                        onClick={event => {
                          event.preventDefault()
                          dispatch(removePromoCode(promotionCode))
                        }}
                      >
                        {promotionName} &times;
                      </span>
                      <button
                        className="btn btn-link px-0 text-danger"
                        type="button"
                        key={promotionCode}
                        disabled={disableInteraction}
                        onClick={event => {
                          event.preventDefault()
                          dispatch(removePromoCode(promotionCode))
                        }}
                      >
                        <i className="bi bi-times-circle"></i>
                        <span className="font-size-sm"> {promotionName}</span>
                      </button>
                    </div>
                  )
                })}
            </div>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <h6 className="my-0">{t('frontend.cart.total')}</h6>
            <strong>{total > 0 ? formatCurrency(total) : '--'}</strong>
          </li>
        </ul>
      </div>
    </>
  )
}

export { OrderSummary }
