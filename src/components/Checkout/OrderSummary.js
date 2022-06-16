import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useFormatCurrency } from '../../hooks/'
import { isVatCountry } from '../../selectors'

const OrderSummary = ({cart,disabled = false, onRemovePromoCode}) => {
  const [formatCurrency] = useFormatCurrency({})
  const showVat = useSelector(isVatCountry)
  const { t } = useTranslation()
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
              <strong>{cart.subTotalAfterItemDiscounts > 0 ? formatCurrency(cart.subTotalAfterItemDiscounts) : '--'}</strong>
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between ">
            <h6 className="my-0"> {t('frontend.cart.shippingDelivery')}</h6>
            <span className="float-end">
              <strong>{cart.fulfillmentChargeAfterDiscountTotal > 0 ? formatCurrency(cart.fulfillmentChargeAfterDiscountTotal) : '--'}</strong>
            </span>
          </li>
          {!showVat && (
            <li className="list-group-item d-flex justify-content-between">
              <h6 className="my-0">{t('frontend.cart.tax')}</h6>

              <span className="float-end">
                <strong>{cart.taxTotal > 0 ? formatCurrency(cart.taxTotal) : '--'}</strong>
              </span>
            </li>
          )}
          {cart.promotionCodes.length > 0 && (
            <>
              <li className="list-group-item d-flex justify-content-between bg-light">
                <div className="text-success">
                  <h6 className="my-0"> {t('frontend.cart.discount')}</h6>
                </div>
                <span className="float-end align-center">
                  <span className="text-success">{cart.discountTotal > 0 ? formatCurrency(cart.discountTotal) : '--'}</span>
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between bg-light">
                {cart.promotionCodes.map(promotionCodeItem => {
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
                        disabled={disabled}
                        onClick={(event) => onRemovePromoCode(event,promotionCode)}
                      >
                        <i className="bi bi-x"></i>
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
            <strong>{cart.total > 0 ? formatCurrency(cart.total) : '--'}</strong>
          </li>
          {showVat && (
            <li className="list-group-item d-flex justify-content-between ">
              <h6 className="my-0">{t('frontend.cart.vat')}</h6>
              <span className="float-end">
                <strong>{cart.VATTotal > 0 ? formatCurrency(cart.VATTotal) : '--'}</strong>
              </span>
            </li>
          )}
        </ul>
      </div>
    </>
  )
}

export { OrderSummary }
