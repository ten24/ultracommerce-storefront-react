import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { disableInteractionSelector } from '../../selectors/orderSelectors'
import { removePromoCode, applyPromoCode } from '../../actions/cartActions'
import { useElementContext } from '../../contexts/ElementContextProvider'
import { REVIEW, getCurrentStep } from '../../components/Checkout/steps'
import { Button } from '../../components/Button/Button'
// https://www.digitalocean.com/community/tutorials/how-to-create-multistep-forms-with-react-and-semantic-ui
// https://github.com/srdjan/react-multistep/blob/master/react-multistep.js
// https://www.geeksforgeeks.org/how-to-create-multi-step-progress-bar-using-bootstrap/

//

const CheckoutSideBar = ({ placeOrder }) => {
  const { OrderSummary, OrderNotes, CartPromoBox, PromotionalMessaging } = useElementContext()
  const cart = useSelector(state => state.cart)
  const disableInteraction = useSelector(disableInteractionSelector)
  const { isFetching } = cart
  const loc = useLocation()
  const path = loc.pathname.split('/').reverse()?.at(0).toLowerCase()
  const currentStep = getCurrentStep(path)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  return (
    <aside className="col-lg-4 pt-4 pt-lg-0">
      <div className=" rounded-lg box-shadow-lg ml-lg-auto">
        <PromotionalMessaging />
        <OrderSummary
          cart={cart}
          disabled={disableInteraction}
          onRemovePromoCode={(event, promotionCode) => {
            event.preventDefault()
            dispatch(removePromoCode(promotionCode, undefined, t('frontend.cart.promo_code_removed')))
          }}
        />
        {currentStep.key === REVIEW && <Button disabled={isFetching} isLoading={isFetching} label={t('frontend.order.complete')} classList="btn btn-primary btn-lg btn-block w-100" onClick={placeOrder} />}
        {currentStep.key !== REVIEW && (
          <CartPromoBox
            disabledInteraction={disableInteraction}
            onApplyCode={(promoCode, setPromoCode) => {
              dispatch(applyPromoCode(promoCode, t('frontend.cart.promo_code_applied')))
              setPromoCode('')
            }}
          />
        )}
        {currentStep.key === REVIEW && <OrderNotes />}
      </div>
    </aside>
  )
}

export { CheckoutSideBar }
