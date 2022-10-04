import { useSelector } from 'react-redux'
import { useFormatDateTime, useFormatCurrency, useSingleAccountOrderDetails, useCheckoutUtilities } from '../../../hooks/'
import { BillingAddressDetails, TermPaymentDetails, GiftCardDetails, CCDetails, ExternalPaymentDetails, CashPaymentDetails, CheckPaymentDetails } from '../../'
import { useTranslation } from 'react-i18next'
import { isVatCountry } from '../../../selectors'
import { Link } from 'react-router-dom'

const OrderDetails = ({ orderInfo, orderFulfillments, orderPayments }) => {
  const [formateDate] = useFormatDateTime({})
  const [formatCurrency] = useFormatCurrency({})
  const showVat = useSelector(isVatCountry)
  const { t } = useTranslation()
  const { CREDIT_CARD_CODE, CHECK_PAYMENT_CODE, GIFT_CARD_CODE, TERM_PAYMENT_CODE, CASH_PAYMENT_CODE, EXTERNAL_PAYMENT_CODE } = useCheckoutUtilities()
  const { calculatedGuestAccountFlag = false } = useSelector(state => state.userReducer)
  const { billingAddressDetails, termPaymentDetails, externalPaymentDetails, creditCardPaymentDetails, paymentMethodType, cashPaymentDetails, checkPaymentDetails } = useSingleAccountOrderDetails({ orderInfo, orderFulfillments, orderPayments })
  return (
    <div className="row align-items-start mb-5 mr-3">
      <div className="col-md-7">
        <div className="row text-sm">
          <div className="col-6 d-flex flex-column">
            <h6 className="h6">{t('frontend.account.order.datePlaced')}</h6>
            <p>{formateDate(orderInfo.orderOpenDateTime)}</p>
          </div>
          <div className="col-6">
            <BillingAddressDetails billingAddressNickname={''} orderPayment={billingAddressDetails} />
            {paymentMethodType === TERM_PAYMENT_CODE && <TermPaymentDetails termPayment={termPaymentDetails} />}
            {paymentMethodType === GIFT_CARD_CODE && <GiftCardDetails />}
            {paymentMethodType === CREDIT_CARD_CODE && <CCDetails creditCardPayment={creditCardPaymentDetails} />}
            {paymentMethodType === EXTERNAL_PAYMENT_CODE && <ExternalPaymentDetails payment={externalPaymentDetails} />}
            {paymentMethodType === CASH_PAYMENT_CODE && <CashPaymentDetails cashPayment={cashPaymentDetails} />}
            {paymentMethodType === CHECK_PAYMENT_CODE && <CheckPaymentDetails payment={checkPaymentDetails} />}
          </div>
        </div>
        {calculatedGuestAccountFlag && (
          <div className="row text-sm">
            <div className="col-12">
              <Link to="/checkout/createGuestAccount">{t('frontend.cart.create.account')}</Link>
            </div>
          </div>
        )}
      </div>

      <div className="col-md-5 ">
        <div className="card mb-4">
          <div className="card-header">
            <h4 className="mb-0">{t('frontend.cart.orderSummary')}</h4>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              {t('frontend.cart.itemTotal')}
              <span className="float-end">
                <strong>{formatCurrency(orderInfo.calculatedSubTotal)}</strong>
              </span>
            </li>
            {showVat && (
              <li className="list-group-item">
                {t('frontend.cart.shippingDelivery')}
                <span className="float-end">
                  <strong>{formatCurrency(orderInfo.calculatedFulfillmentTotal + orderInfo.calculatedVATTotal)}</strong>
                </span>
              </li>
            )}
            {!showVat && (
              <>
                <li className="list-group-item">
                  {t('frontend.cart.shippingDelivery')}
                  <span className="float-end">
                    <strong>{formatCurrency(orderInfo.calculatedFulfillmentTotal)}</strong>
                  </span>
                </li>
                <li className="list-group-item">
                  {t('frontend.cart.tax')}
                  <span className="float-end">
                    <strong>{formatCurrency(orderInfo.calculatedTaxTotal)}</strong>
                  </span>
                </li>
              </>
            )}
            {orderInfo.calculatedDiscountTotal > 0 && (
              <li className="list-group-item">
                {t('frontend.cart.discount')}
                <span className="float-end">
                  <span className="badge bg-success"> -{formatCurrency(orderInfo.calculatedDiscountTotal)}</span>
                </span>
              </li>
            )}
            <li className="list-group-item">
              {t('frontend.cart.total')}
              <span className="float-end">
                <strong>{formatCurrency(orderInfo.calculatedTotal)}</strong>
              </span>
            </li>
            {showVat && (
              <li className="list-group-item">
                {t('frontend.cart.vat')}
                <span className="float-end">
                  <strong>{formatCurrency(orderInfo.calculatedVATTotal)}</strong>
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export { OrderDetails }
