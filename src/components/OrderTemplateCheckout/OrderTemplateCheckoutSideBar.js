import { OrderTemplateCartPromoBox, OrderTemplateSummary, PromotionalMessaging, REVIEW, getCurrentStep, Button } from '../../components'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const OrderTemplateCheckoutSideBar = ({ placeOrder }) => {
  const cart = useSelector(state => state.subscriptionCart)
  const { orderTemplateID, accountPaymentMethod } = cart
  const loc = useLocation()
  const path = loc.pathname.split('/').reverse()[0].toLowerCase()
  const currentStep = getCurrentStep(path)
  const { t } = useTranslation()
  return (
    <aside className="col-lg-4 pt-4 pt-lg-0">
      <div className=" rounded-lg box-shadow-lg ml-lg-auto">
        <PromotionalMessaging />
        {orderTemplateID && <OrderTemplateSummary />}
        {currentStep.key === REVIEW && <Button isLoading={!accountPaymentMethod} label={t('frontend.order.complete')} classList="btn btn-primary btn-lg btn-block w-100" onClick={placeOrder} />}
        {currentStep.key !== REVIEW && <OrderTemplateCartPromoBox />}
      </div>
    </aside>
  )
}

export { OrderTemplateCheckoutSideBar }
