import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useFormatCurrency } from '../../hooks/'
import { disableInteractionForOrderTemplateCheckoutSelector, isVatCountry } from '../../selectors'
import { removeOrderTemplatePromoCode } from '../../actions'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../utils'

const OrderTemplateSummary = () => {
  const { orderTemplateID, calculatedTotal, calculatedTaxTotal, calculatedVatTotal, calculatedSubTotal, calculatedDiscountTotal, calculatedFulfillmentDiscount, promotionCodes } = useSelector(state => state.subscriptionCart)
  const [formatCurrency] = useFormatCurrency({})
  const showVat = useSelector(isVatCountry)
  const { t } = useTranslation()
  const disableInteraction = useSelector(disableInteractionForOrderTemplateCheckoutSelector)
  const dispatch = useDispatch()
  
  return (
    <>
        {orderTemplateID && (
          <>
      <div className="card mb-4">
        <div className="card-header">
          <h4 className="mb-0">{t('frontend.cart.orderSummary')}</h4>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between ">
              <h6 className="my-0"> {t('frontend.checkout.subTotal')}</h6>
              <span className="float-end">
                <strong>{calculatedSubTotal > 0 ? formatCurrency(calculatedSubTotal) : '--'}</strong>
              </span>
          </li>
          <li className="list-group-item d-flex justify-content-between ">
            <h6 className="my-0"> {t('frontend.cart.shippingDelivery')}</h6>
            <span className="float-end">
              <strong>{calculatedFulfillmentDiscount > 0 ? formatCurrency(calculatedFulfillmentDiscount) : t('frontend.cart.shippingFree')}</strong>
            </span>
          </li>
          {!showVat && (
            <li className="list-group-item d-flex justify-content-between">
              <h6 className="my-0">{t('frontend.cart.tax')}</h6>

              <span className="float-end">
                <strong>{calculatedTaxTotal > 0 ? formatCurrency(calculatedTaxTotal) : '--'}</strong>
              </span>
            </li>
          )}
          {promotionCodes?.length > 0 && (
            <>
              <li className="list-group-item d-flex justify-content-between bg-light">
                <div className="text-success">
                  <h6 className="my-0"> {t('frontend.cart.discount')}</h6>
                </div>
                <span className="float-end align-center">
                  <span className="text-success">{calculatedDiscountTotal > 0 ? formatCurrency(calculatedDiscountTotal) : '--'}</span>
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between bg-light">
                {promotionCodes.map(({ promotionCode, promotionCodeID }) => {
                  //TODO: Review
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
                          dispatch(removeOrderTemplatePromoCode(promotionCodeID, orderTemplateID)).then(response => {
                            if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                            if (!Object.keys(response.success()?.errors || {}).length) {
                              toast.success(t('frontend.cart.promo_code_removed'))
                            }
                          })
                        }}
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
            <strong>{calculatedTotal > 0 ? formatCurrency(calculatedTotal) : '--'}</strong>
          </li>
          {showVat && (
            <li className="list-group-item d-flex justify-content-between ">
              <h6 className="my-0">{t('frontend.cart.vat')}</h6>
              <span className="float-end">
                <strong>{calculatedVatTotal > 0 ? formatCurrency(calculatedVatTotal) : '--'}</strong>
              </span>
            </li>
          )}
        </ul>
        
      </div>
      </>
        )}
    </>
  )
}

export { OrderTemplateSummary }
