import { PageHeader, Layout, CheckoutSideBar, StepsHeader, getCurrentStep, ShippingSlide, PaymentSlide, ReviewSlide, ThreeDSRedirect, AccountLogin, CreateGuestAccount } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import './checkout.css'
import { getErrorMessage, isAuthenticated } from '../../utils'
import { useEffect, useState } from 'react'
import { clearUser, receiveCart, receiveUser, requestCart, requestLogOut } from '../../actions'
import { SlatwalApiService } from '../../services'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const Checkout = () => {
  let match = useRouteMatch()
  const { pathname } = useLocation()
  const history = useHistory()
  const path = pathname.split('/').reverse()[0].toLowerCase()
  const currentStep = getCurrentStep(path)
  const { verifiedAccountFlag, isFetching, accountID, calculatedGuestAccountFlag = false } = useSelector(state => state.userReducer)
  const enforceVerifiedAccountFlag = useSelector(state => state.configuration.enforceVerifiedAccountFlag)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const cartState = useSelector(state => state.cart) // check if there is some change in state , just to run use effect
  const [threeDSRedirect, setThreeDSRedirect] = useState()

  const placeOrder = event => {
    event.preventDefault()
    dispatch(requestCart())
    // Store the hash for guest Checkout
    const payload = !!calculatedGuestAccountFlag ? 'cart,account' : 'cart'
    SlatwalApiService.cart.placeOrder({ returnJSONObjects: payload, transactionInitiator: 'ACCOUNT' }).then(response => {
      if (response.isSuccess()) {
        const placeOrderResp = response.success()
        const orderHasError = Object.keys(placeOrderResp?.errors || {})?.length > 0
        if (placeOrderResp?.redirectUrl) {
          const { redirectUrl, redirectPayload, redirectMethod } = placeOrderResp
          setThreeDSRedirect({ redirectUrl, redirectPayload, redirectMethod })
        } else {
          if (orderHasError) {
            toast.error(getErrorMessage(response.success().errors))
          } else {
            dispatch(receiveCart(placeOrderResp.cart))
            dispatch(receiveUser(placeOrderResp.account))
            // TODO: verify isGuest
            if (!!calculatedGuestAccountFlag) {
              history.push(`/my-account/order-detail?token=${cartState.orderID}:${accountID}`)
            } else {
              history.push('/order-confirmation')
            }
          }
        }
      } else {
        toast.error(t('frontend.core.error.network'))
        dispatch(receiveCart())
      }
    })
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      dispatch(clearUser())
      dispatch(requestLogOut())
      if (pathname !== '/checkout/login' && pathname !== '/checkout/createGuestAccount' && pathname !== '/checkout/cart') history.replace(`/checkout/login?redirect=${pathname}`)
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
                  <Redirect to={`/shopping-cart`} />
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
              <StepsHeader />
              <Route path={`${match.path}/cart`}>
                <Redirect to="/cart" />
              </Route>

              <Switch>
                <Route path={`${match.path}/shipping`}>
                  <ShippingSlide currentStep={currentStep} />
                </Route>

                <Route path={`${match.path}/payment`}>
                  <PaymentSlide currentStep={currentStep} />
                </Route>
                <Route path={`${match.path}/review`}>
                  <ReviewSlide currentStep={currentStep} />
                </Route>
                <Route path={match.path}>
                  <Redirect to={`${match.path}/shipping`} />
                </Route>
              </Switch>
            </section>
            {/* <!-- Sidebar--> */}
            <CheckoutSideBar placeOrder={placeOrder} />
            {threeDSRedirect && <ThreeDSRedirect url={threeDSRedirect.redirectUrl} payload={threeDSRedirect.redirectPayload} method={threeDSRedirect.redirectMethod} />}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Checkout
