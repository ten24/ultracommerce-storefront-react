import { useFormatDateTime, useFormatCurrency } from '../../../hooks/'
import { useSelector } from 'react-redux'
import { ShippingAddressDetails, BillingAddressDetails, TermPaymentDetails, GiftCardDetails, CCDetails, PickupLocationDetails } from '../../'
import { orderPayment } from '../../../selectors/'
import { useTranslation } from 'react-i18next'

const OrderDetails = ({ orderInfo, orderFulfillments, orderPayments }) => {
  const { orderOpenDateTime } = orderInfo
  const { orderFulfillment_shippingAddress_emailAddress, orderFulfillment_fulfillmentMethod_fulfillmentMethodType, orderFulfillment_shippingAddress_name, orderFulfillment_shippingAddress_streetAddress, orderFulfillment_shippingAddress_city, orderFulfillment_shippingAddress_stateCode, orderFulfillment_shippingAddress_postalCode, orderFulfillment_pickupLocation_locationName } = orderFulfillments
  const { calculatedTotal, calculatedSubTotal, calculatedTaxTotal, calculatedFulfillmentTotal, calculatedDiscountTotal } = orderInfo
  const { paymentMethod_paymentMethodType, paymentMethod_paymentMethodName, billingAddress_streetAddress, billingAddress_emailAddress, billingAddress_city, billingAddress_stateCode, billingAddress_postalCode, billingAddress_name, purchaseOrderNumber } = orderPayments
  const [formateDate] = useFormatDateTime({})
  const [formatCurrency] = useFormatCurrency({})
  const payment = useSelector(orderPayment)
  const { t } = useTranslation()

  return (
    <div className="row align-items-start mb-5 mr-3">
      <div className="col-md-7">
        <div className="row text-sm">
          <div className="col-6 ">
            {orderFulfillment_fulfillmentMethod_fulfillmentMethodType === 'shipping' && <ShippingAddressDetails className="" shippingAddress={{ name: orderFulfillment_shippingAddress_name, streetAddress: orderFulfillment_shippingAddress_streetAddress, city: orderFulfillment_shippingAddress_city, emailAddress: orderFulfillment_shippingAddress_emailAddress, stateCode: orderFulfillment_shippingAddress_stateCode, postalCode: orderFulfillment_shippingAddress_postalCode }} shippingAddressNickname={''} />}
            {orderFulfillment_fulfillmentMethod_fulfillmentMethodType === 'pickup' && <PickupLocationDetails className="" pickupLocation={{ locationName: orderFulfillment_pickupLocation_locationName }} />}
            <h3 className="h6">{t('frontend.account.order.datePlaced')}</h3>
            <p>{formateDate(orderOpenDateTime)}</p>
            <h3 className="h6">{t('frontend.order.OrderNo')}</h3>
            <p>{orderPayments.order_orderNumber}</p>
          </div>
          <div className="col-6">
            <BillingAddressDetails billingAddressNickname={''} orderPayment={{ billingAddress: { name: billingAddress_name, streetAddress: billingAddress_streetAddress, city: billingAddress_city, stateCode: billingAddress_stateCode, postalCode: billingAddress_postalCode, emailAddress: billingAddress_emailAddress } }} />
            {paymentMethod_paymentMethodType === 'termPayment' && <TermPaymentDetails termPayment={{ purchaseOrderNumber: purchaseOrderNumber, paymentMethod: { paymentMethodName: paymentMethod_paymentMethodName } }} />}
            {paymentMethod_paymentMethodType === 'giftCard' && <GiftCardDetails />}
            {paymentMethod_paymentMethodType === 'creditCard' && <CCDetails creditCardPayment={payment} />}
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
                <strong>{formatCurrency(calculatedSubTotal)}</strong>
              </span>
            </li>
            <li className="list-group-item">
              {t('frontend.cart.shippingDelivery')}
              <span className="float-end">
                <strong>{formatCurrency(calculatedFulfillmentTotal)}</strong>
              </span>
            </li>
            <li className="list-group-item">
              {t('frontend.cart.tax')}
              <span className="float-end">
                <strong>{formatCurrency(calculatedTaxTotal)}</strong>
              </span>
            </li>
            <li className="list-group-item">
              {t('frontend.cart.discount')}
              <span className="float-end">
                <span className="badge bg-success"> -{formatCurrency(calculatedDiscountTotal)}</span>
              </span>
            </li>
            <li className="list-group-item">
              {t('frontend.cart.total')}
              <span className="float-end">
                <strong>{formatCurrency(calculatedTotal)}</strong>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export { OrderDetails }
