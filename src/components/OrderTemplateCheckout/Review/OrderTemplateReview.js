import { useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { SlideNavigation, OrderTemplateCartLineItem, BillingAddressDetails } from '../..'
import { useTranslation } from 'react-i18next'
import { ShippingAddressDetails } from '../../Checkout/Review/ShippingAddressDetails'
import { CCDetails } from '../../Checkout/Review/CCDetails'

const OrderTemplateReviewSlide = ({ currentStep }) => {
  const cart = useSelector(state => state.subscriptionCart)
  const { t } = useTranslation()

  if (cart.isPlaced) {
    return <Navigate to={'/order-confirmation'} />
  }
  return (
    <>
      <div className="row bg-lightgray p-3 rounded mb-5">
        {cart.accountPaymentMethod && (
          <div className="col">
            <CCDetails creditCardPayment={cart.accountPaymentMethod} />
            <Link to="/scheduled-delivery-checkout/payment" className="text-link link">
              {t('frontend.core.edit')}
            </Link>
          </div>
        )}
        {cart.accountPaymentMethod && (
          <div className="col">
            <BillingAddressDetails orderPayment={cart.accountPaymentMethod} />
            <Link to="/scheduled-delivery-checkout/payment" className="text-link link">
              {t('frontend.core.edit')}
            </Link>
          </div>
        )}

        {cart?.shippingAccountAddress?.accountAddressID?.length > 0 && (
          <div className="col">
            <ShippingAddressDetails
              displayOnly={true}
              orderFulfillment={{
                ...cart.shippingAccountAddress,
                shippingAddress: cart.shippingAccountAddress.address,
              }}
            />

            <Link to="/scheduled-delivery-checkout/shipping" className="text-link link mb-4 d-block">
              {t('frontend.core.edit')}
            </Link>
          </div>
        )}
      </div>

      <h2 className="h3 pt-1 pb-3 mb-3 border-bottom">{t('frontend.checkout.review.order')}</h2>
      {cart.orderTemplateItems &&
        cart.orderTemplateItems.map(orderTemplateItem => {
          return <OrderTemplateCartLineItem key={orderTemplateItem.orderTemplateItemID} orderTemplateItemID={orderTemplateItem.orderTemplateItemID} orderTemplateItem={orderTemplateItem} orderTemplateID={cart.orderTemplateID} isDisabled={true} /> // this cannot be index or it wont force a rerender
        })}

      <SlideNavigation currentStep={currentStep} />
    </>
  )
}

export { OrderTemplateReviewSlide }
