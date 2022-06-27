import { PageHeader, Layout, OrderTemplateCheckoutSideBar, OrderTemplateCheckoutStepsHeader, getOrderTemplateCurrentStep, OrderTemplateShippingSlide, OrderTemplatePaymentSlide, OrderTemplateReviewSlide, ThreeDSRedirect, AccountLogin, CreateGuestAccount, OrderTemplateConfig } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import './checkout.css'
import { isAuthenticated, getErrorMessage } from '../../utils'
import { useEffect, useState } from 'react'
import { clearUser, requestLogOut, requestSubscriptionCart, receiveSubscriptionCart } from '../../actions'
import { useTranslation } from 'react-i18next'
import { axios, sdkURL } from '../../services'

import { toast } from 'react-toastify'
import { clearSubscriptionCart } from '../../actions/subscriptionCartActions'

const OrderTemplateCheckout = () => {
  let match = useRouteMatch()
  const { pathname } = useLocation()
  const history = useHistory()
  const path = pathname.split('/').reverse()[0].toLowerCase()
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
          history.push('/my-account/subscription-orders')
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
      if (pathname !== '/scheduled-delivery-checkout/login' && pathname !== '/scheduled-delivery-checkout/createGuestAccount' && pathname !== '/scheduled-delivery-checkout/cart') history.replace(`/scheduled-delivery-checkout/login?redirect=${pathname}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (enforceVerifiedAccountFlag && !verifiedAccountFlag && isAuthenticated() && !isFetching && accountID.length > 0) return <Redirect to="/account-verification" />

  return (
    <Layout>
      <PageHeader />
      <div className="container pb-5 mb-2 mb-md-4">
        {!isAuthenticated() && (
          <div className="row">
            <section className="col">
              {/* <!-- Steps--> */}
              <Switch>
                <Route path={`${match.path}/cart`}>
                  <Redirect to={`/scheduled-delivery-cart`} />
                </Route>
                <Route path={`${match.path}/login`}>
                  <AccountLogin isCheckout={true} />
                </Route>
                <Route path={`${match.path}/createGuestAccount`}>
                  <CreateGuestAccount />
                </Route>
              </Switch>
            </section>
            {/* <!-- Sidebar--> */}
          </div>
        )}
        {isAuthenticated() && (
          <div className="row">
            <section className="col-lg-8">
              {/* <!-- Steps--> */}
              <OrderTemplateCheckoutStepsHeader />
              <Route path={`${match.path}/scheduled-delivery-cart`}>
                <Redirect to="/scheduled-delivery-cart" />
              </Route>

              <Switch>
                <Route path={`${match.path}/scheduled-delivery-info`}>
                  <OrderTemplateConfig currentStep={currentStep} />
                </Route>
                <Route path={`${match.path}/shipping`}>
                  <OrderTemplateShippingSlide currentStep={currentStep} />
                </Route>
                <Route path={`${match.path}/payment`}>
                  <OrderTemplatePaymentSlide currentStep={currentStep} />
                </Route>
                <Route path={`${match.path}/review`}>
                  <OrderTemplateReviewSlide currentStep={currentStep} />
                </Route>
                <Route path={match.path}>
                  <Redirect to={`${match.path}/scheduled-delivery-info`} />
                </Route>
              </Switch>
            </section>
            {/* <!-- Sidebar--> */}
            <OrderTemplateCheckoutSideBar placeOrder={placeOrder} />
            {threeDSRedirect && <ThreeDSRedirect url={threeDSRedirect.redirectUrl} payload={threeDSRedirect.redirectPayload} method={threeDSRedirect.redirectMethod} />}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default OrderTemplateCheckout
