import { useSelector } from 'react-redux'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { SlideNavigation, CartLineItem, GiftCardDetails, PickupLocationDetails, ShippingAddressDetails, TermPaymentDetails, BillingAddressDetails, CCDetails } from '../..'
import { fulfillmentSelector, shippingAddressSelector, orderPayment, billingAddressNickname, shippingAddressNicknameSelector, shippingMethodSelector, pickupLocationSelector } from '../../../selectors/orderSelectors'
import { useTranslation } from 'react-i18next'
import { useCheckoutUtilities } from '../../../hooks'
import { CashPaymentDetails } from './CashPaymentDetails'

const ReviewSlide = ({ currentStep }) => {
  const cart = useSelector(state => state.cart)
  const { fulfillmentMethod } = useSelector(fulfillmentSelector)
  const payment = useSelector(orderPayment)
  const shippingAddress = useSelector(shippingAddressSelector)
  const shippingMethod = useSelector(shippingMethodSelector)
  const pickupLocation = useSelector(pickupLocationSelector)
  let billingNickname = useSelector(billingAddressNickname)
  const { t } = useTranslation()
  const { SHIPPING_CODE, PICKUP_CODE, CREDIT_CARD_CODE, GIFT_CARD_CODE, TERM_PAYMENT_CODE, CASH_PAYMENT_CODE } = useCheckoutUtilities()

  let shippingAddressNickname = useSelector(shippingAddressNicknameSelector)
  if (cart.isPlaced) {
    return <Redirect to={'/order-confirmation'} />
  }

  return (
    <>
      <div className="row bg-lightgray p-3 rounded mb-5">
        {fulfillmentMethod.fulfillmentMethodType === SHIPPING_CODE && (
          <div className="col-md-4">
            <ShippingAddressDetails shippingAddress={shippingAddress} shippingAddressNickname={shippingAddressNickname} />
            <Link to="/checkout/shipping" className="text-link link mb-4 d-block">
              {t('frontend.core.edit')}
            </Link>

            <h6 className="h6">{t('frontend.checkout.shippingMethod')}</h6>
            {shippingMethod.shippingMethodName}
          </div>
        )}
        {fulfillmentMethod.fulfillmentMethodType === PICKUP_CODE && (
          <div className="col-md-4">
            <PickupLocationDetails pickupLocation={pickupLocation} />
          </div>
        )}
        <div className="col-md-4">
          <BillingAddressDetails billingAddressNickname={billingNickname} orderPayment={payment} />
        </div>
        {payment.paymentMethod.paymentMethodType === CREDIT_CARD_CODE && (
          <div className="col-md-4">
            <CCDetails creditCardPayment={payment} />
            <Link to="/checkout/payment" className="text-link link">
              {t('frontend.core.edit')}
            </Link>
          </div>
        )}
        {payment.paymentMethod.paymentMethodType === GIFT_CARD_CODE && (
          <div className="col-md-4">
            <GiftCardDetails />
          </div>
        )}
        {payment.paymentMethod.paymentMethodType === TERM_PAYMENT_CODE && (
          <div className="col-md-4">
            <TermPaymentDetails termPayment={payment} />
          </div>
        )}
        {payment.paymentMethod.paymentMethodType === CASH_PAYMENT_CODE && (
          <div className="col-md-4">
            <CashPaymentDetails cashPayment={payment} />
          </div>
        )}
      </div>

      <h2 className="h3 pt-1 pb-3 mb-3 border-bottom">{t('frontend.checkout.review.order')}</h2>
      {cart.orderItems &&
        cart.orderItems.map(({ orderItemID }) => {
          return <CartLineItem key={orderItemID} orderItemID={orderItemID} isDisabled={true} /> // this cannot be index or it wont force a rerender
        })}

      <SlideNavigation currentStep={currentStep} />
    </>
  )
}

export { ReviewSlide }
