import { useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { SlideNavigation, CartLineItem, GiftCardDetails, PickupLocationDetails, ShippingAddressDetails, CheckPaymentDetails, TermPaymentDetails, BillingAddressDetails, CCDetails, ExternalPaymentDetails, CashPaymentDetails } from '../..'
import { getAllOrderFulfillments, orderPayment } from '../../../selectors'
import { useTranslation } from 'react-i18next'
import { useCheckoutUtilities } from '../../../hooks'
import { CHECK_PAYMENT_CODE } from '../../../hooks/components/Checkout/useCheckoutUtilities'

const ReviewSlide = ({ currentStep }) => {
  const cart = useSelector(state => state.cart)
  const orderFulfillments = useSelector(getAllOrderFulfillments)
  const payment = useSelector(orderPayment)
  const { t } = useTranslation()
  const { SHIPPING_CODE, PICKUP_CODE, CREDIT_CARD_CODE, GIFT_CARD_CODE, TERM_PAYMENT_CODE, CASH_PAYMENT_CODE, EXTERNAL_PAYMENT_CODE } = useCheckoutUtilities()

  if (cart.isPlaced) {
    return <Navigate to={'order-confirmation'} />
  }

  return (
    <>
      <div className="row bg-lightgray p-3 rounded mb-5">
        {orderFulfillments.map(orderFulfillment => {
          return (
            <div className="col" key={orderFulfillment.orderFulfillmentID}>
              {orderFulfillment.fulfillmentMethod.fulfillmentMethodType === SHIPPING_CODE && <ShippingAddressDetails orderFulfillment={orderFulfillment} />}
              {orderFulfillment.fulfillmentMethod.fulfillmentMethodType === PICKUP_CODE && <PickupLocationDetails pickupLocation={orderFulfillment.pickupLocation} />}
            </div>
          )
        })}

        {payment?.billingAddress?.addressID?.length > 0 && payment.paymentMethod.paymentMethodType !== CHECK_PAYMENT_CODE && (
          <div className="col">
            <BillingAddressDetails orderPayment={payment} />
          </div>
        )}

        <div className="col">
          {payment.paymentMethod.paymentMethodType === CREDIT_CARD_CODE && <CCDetails creditCardPayment={payment} />}
          {payment.paymentMethod.paymentMethodType === GIFT_CARD_CODE && <GiftCardDetails />}
          {payment.paymentMethod.paymentMethodType === TERM_PAYMENT_CODE && <TermPaymentDetails termPayment={payment} />}
          {payment.paymentMethod.paymentMethodType === CASH_PAYMENT_CODE && <CashPaymentDetails cashPayment={payment} />}
          {payment.paymentMethod.paymentMethodType === CHECK_PAYMENT_CODE && <CheckPaymentDetails payment={payment} />}
          {payment.paymentMethod.paymentMethodType === EXTERNAL_PAYMENT_CODE && <ExternalPaymentDetails payment={payment} />}
          <Link to="/checkout/payment" className="text-link link">
            {t('frontend.core.edit')}
          </Link>
        </div>
      </div>

      <h2 className="h3 pt-1 pb-3 mb-3 border-bottom">{t('frontend.checkout.review.order')}</h2>
      {cart.orderItems &&
        cart.orderItems
          .filter(item => item.parentOrderItemID === '')
          .map(orderItem => {
            return <CartLineItem key={orderItem.orderItemID} orderItem={orderItem} isDisabled={true} childBundleItems={cart.orderItems?.filter(item => item?.parentOrderItemID === orderItem.orderItemID)} /> // this cannot be index or it wont force a rerender
          })}

      <SlideNavigation currentStep={currentStep} />
    </>
  )
}

export { ReviewSlide }
