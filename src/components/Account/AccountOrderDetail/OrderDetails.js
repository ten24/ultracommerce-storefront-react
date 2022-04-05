import { useSelector } from 'react-redux'
import { useFormatDateTime, useFormatCurrency, useSingleAccountOrderDetails } from '../../../hooks/'
import { ShippingAddressDetails, BillingAddressDetails, TermPaymentDetails, GiftCardDetails, CCDetails, ExternalPaymentDetails, PickupLocationDetails } from '../../'
import { useTranslation } from 'react-i18next'
import { isVatCountry } from '../../../selectors'

const OrderDetails = ({ orderInfo, orderFulfillments, orderPayments }) => {
  const [formateDate] = useFormatDateTime({})
  const [formatCurrency] = useFormatCurrency({})
  const showVat = useSelector(isVatCountry)
  const { t } = useTranslation()
  const { billingAddressDetails, shippingAddressDetails, pickupLocationDetails, termPaymentDetails, externalPaymentDetails, creditCardPaymentDetails, paymentMethodType, fulfillmentMethodType } = useSingleAccountOrderDetails({ orderInfo, orderFulfillments, orderPayments })
  return (
    <div className="row align-items-start mb-5 mr-3">
      <div className="col-md-7">
        <div className="row text-sm">
          <div className="col-6 d-flex flex-column justify-content-between">
            {fulfillmentMethodType === 'shipping' && <ShippingAddressDetails className="" shippingAddress={shippingAddressDetails} shippingAddressNickname={''} />}
            {fulfillmentMethodType === 'pickup' && <PickupLocationDetails className="" pickupLocation={pickupLocationDetails} />}
            <h6 className="h6">{t('frontend.account.order.datePlaced')}</h6>
            <p>{formateDate(orderInfo.orderOpenDateTime)}</p>
          </div>
          <div className="col-6">
            <BillingAddressDetails billingAddressNickname={''} orderPayment={billingAddressDetails} />
            {paymentMethodType === 'termPayment' && <TermPaymentDetails termPayment={termPaymentDetails} />}
            {paymentMethodType === 'giftCard' && <GiftCardDetails />}
            {paymentMethodType === 'creditCard' && <CCDetails creditCardPayment={creditCardPaymentDetails} />}
            {paymentMethodType === 'external' && <ExternalPaymentDetails payment={externalPaymentDetails} />}
            
          </div>
        </div>
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
