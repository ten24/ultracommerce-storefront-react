import * as Sentry from '@sentry/react'
import { Navigate, Route, Routes as RouterRoutes, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PageHeader, OrderTemplateCheckoutSideBar, OrderTemplateCheckoutStepsHeader, getOrderTemplateCurrentStep, OrderTemplateShippingSlide, OrderTemplatePaymentSlide, OrderTemplateReviewSlide, ThreeDSRedirect, AccountLogin, CreateGuestAccount, OrderTemplateConfig, RedirectWithReplace } from '../../components'

import './checkout.css'
import { isAuthenticated, getErrorMessage } from '../../utils'
import { useEffect, useState } from 'react'
import { clearUser, requestLogOut, requestSubscriptionCart, receiveSubscriptionCart } from '../../actions'
import { useTranslation } from 'react-i18next'
import { axios, sdkURL } from '../../services'

import { toast } from 'react-toastify'
import { clearSubscriptionCart } from '../../actions/subscriptionCartActions'
import DynamicPage from '../DynamicPage/DynamicPage'

const Routes = Sentry.withSentryReactRouterV6Routing(RouterRoutes)

const OrderTemplateCheckout = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const path = pathname.split('/').reverse()?.at(0).toLowerCase()

  const currentStep = getOrderTemplateCurrentStep(path)
  const { verifiedAccountFlag, isFetching, accountID = false } = useSelector(state => state.userReducer)
  const enforceVerifiedAccountFlag = useSelector(state => state.configuration.enforceVerifiedAccountFlag)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  // eslint-disable-next-line
  const [threeDSRedirect, setThreeDSRedirect] = useState()
  const orderTemplateID = useSelector(state => state.subscriptionCart.orderTemplateID)

  const placeOrder = async => {
    dispatch(requestSubscriptionCart())
    axios({
      method: 'POST',
      withCredentials: true,
      url: `${sdkURL}api/scope/activateOrderTemplate`,
      data: { orderTemplateID, returnJsonObjects: 'orderTemplateCart' },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.status === 200 && response.data.successfulActions.length > 0) {
        dispatch(clearSubscriptionCart())
        dispatch(receiveSubscriptionCart(response.data.orderTemplateCart))
        toast.success(t('frontend.order.placed'))
        setTimeout(() => {
          navigate('/my-account/subscription-orders')
        }, 2000)
      } else {
        toast.error(getErrorMessage(response.data.messages))
      }
    })
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      dispatch(clearUser())
      dispatch(requestLogOut())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (enforceVerifiedAccountFlag && !verifiedAccountFlag && isAuthenticated() && !isFetching && accountID.length > 0) return <Navigate to="/account-verification" />

  return (
    <DynamicPage ignoreLayout={true}>
      <PageHeader />
      <div className="container pb-5 mb-2 mb-md-4">
        {!isAuthenticated() && (
          <div className="row">
            <section className="col">
              {/* <!-- Steps--> */}
              <Routes>
                <Route path={`createGuestAccount`} element={<CreateGuestAccount />} />
                <Route path={`cart`} element={<RedirectWithReplace pathname={`/scheduled-delivery-cart`} />} />
                <Route path={`*`} element={<AccountLogin isCheckout={true} />} />
              </Routes>
            </section>
            {/* <!-- Sidebar--> */}
          </div>
        )}
        {isAuthenticated() && (
          <div className="row">
            <section className="col-lg-8">
              {/* <!-- Steps--> */}
              <OrderTemplateCheckoutStepsHeader />

              <Routes>
                <Route path={`scheduled-delivery-cart`} element={<RedirectWithReplace pathname={`/scheduled-delivery-cart`} />} />
                <Route path={`scheduled-delivery-info`} element={<OrderTemplateConfig currentStep={currentStep} />} />
                <Route path={`shipping`} element={<OrderTemplateShippingSlide currentStep={currentStep} />} />
                <Route path={`payment`} element={<OrderTemplatePaymentSlide currentStep={currentStep} />} />
                <Route path={`review`} element={<OrderTemplateReviewSlide currentStep={currentStep} />} />
                <Route path={`*`} element={<RedirectWithReplace pathname={`${pathname}/scheduled-delivery-info`} />} />
              </Routes>
            </section>
            {/* <!-- Sidebar--> */}
            <OrderTemplateCheckoutSideBar placeOrder={placeOrder} />
            {threeDSRedirect && <ThreeDSRedirect url={threeDSRedirect.redirectUrl} payload={threeDSRedirect.redirectPayload} method={threeDSRedirect.redirectMethod} />}
          </div>
        )}
      </div>
    </DynamicPage>
  )
}

export default OrderTemplateCheckout
