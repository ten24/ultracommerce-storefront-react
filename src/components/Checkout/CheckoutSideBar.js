import { CartPromoBox, OrderNotes, OrderSummary, PromotionalMessaging, REVIEW, getCurrentStep, Button } from '../../components'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// https://www.digitalocean.com/community/tutorials/how-to-create-multistep-forms-with-react-and-semantic-ui
// https://github.com/srdjan/react-multistep/blob/master/react-multistep.js
// https://www.geeksforgeeks.org/how-to-create-multi-step-progress-bar-using-bootstrap/

//

const CheckoutSideBar = ({ placeOrder }) => {
  const cart = useSelector(state => state.cart)
  const { isFetching } = cart
  const loc = useLocation()
  const path = loc.pathname.split('/').reverse()[0].toLowerCase()
  const currentStep = getCurrentStep(path)
  const { t } = useTranslation()

  return (
    <aside className="col-lg-4 pt-4 pt-lg-0">
      <div className=" rounded-lg box-shadow-lg ml-lg-auto">
        <PromotionalMessaging />
        <OrderSummary />
        {currentStep.key === REVIEW && <Button disabled={isFetching} isLoading={isFetching} label={t('frontend.order.complete')} classList="btn btn-primary btn-lg btn-block w-100" onClick={placeOrder} />}
        {currentStep.key !== REVIEW && <CartPromoBox />}
        {currentStep.key === REVIEW && <OrderNotes />}
      </div>
    </aside>
  )
}

export { CheckoutSideBar }
