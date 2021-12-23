import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useFormatCurrency } from '../../hooks/'
import { disableInteractionSelector, isVatCountry } from '../../selectors'
import { removePromoCode } from '../../actions/cartActions'

const OrderSummary = () => {
  const cart = useSelector(state => state.cart)
  const { total, taxTotal, VATTotal, subtotal, discountTotal, fulfillmentChargeAfterDiscountTotal, promotionCodes } = cart
  const [formatCurrency] = useFormatCurrency({})
  const showVat = useSelector(isVatCountry)
  const { t } = useTranslation()
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
              <strong>{fulfillmentChargeAfterDiscountTotal > 0 ? formatCurrency(fulfillmentChargeAfterDiscountTotal) : t('frontend.cart.shippingFree')}</strong>
            </span>
          </li>
          {showVat && (
            <li className="list-group-item d-flex justify-content-between ">
              <h6 className="my-0">{t('frontend.cart.vat')}</h6>

              <span className="float-end">
                <strong>{VATTotal > 0 ? formatCurrency(VATTotal) : '--'}</strong>
              </span>
            </li>
          )}
          {!showVat && (
            <li className="list-group-item d-flex justify-content-between">
              <h6 className="my-0">{t('frontend.cart.tax')}</h6>

              <span className="float-end">
                <strong>{taxTotal > 0 ? formatCurrency(taxTotal) : '--'}</strong>
              </span>
            </li>
          )}
          {promotionCodes.length > 0 && (
            <>
              <li className="list-group-item d-flex justify-content-between bg-light">
                <div className="text-success">
                  <h6 className="my-0"> {t('frontend.cart.discount')}</h6>
                </div>
                <span className="float-end align-center">
                  <span className="text-success">{discountTotal > 0 ? formatCurrency(discountTotal) : '--'}</span>
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between bg-light">
                {promotionCodes.map(promotionCodeItem => {
                  //TODO: Review
                  const { promotionCode } = promotionCodeItem
                  return (
                    <div key={promotionCode}>
                      <button
                        className="btn badge bg-success promo-btn"
                        type="button"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Remove Promotion"
                        key={promotionCode}
                        disabled={disableInteraction}
                        onClick={event => {
                          event.preventDefault()
                          dispatch(removePromoCode(promotionCode, undefined, t('frontend.cart.promo_code_removed')))
                        }}
                      >
                        <i class="bi bi-x"></i>
                        <span className="font-size-sm">{promotionCode}</span>
                      </button>
                    </div>
                  )
                })}
              </li>
            </>
          )}
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
