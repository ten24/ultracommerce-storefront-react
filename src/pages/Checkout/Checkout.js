import { PageHeader, Layout, CheckoutSideBar, StepsHeader, getCurrentStep, ShippingSlide, PaymentSlide, ReviewSlide, ThreeDSRedirect } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import './checkout.css'
import { getErrorMessage, isAuthenticated } from '../../utils'
import { useEffect, useState } from 'react'
import { clearUser, receiveCart, requestCart, requestLogOut } from '../../actions'
import { SlatwalApiService } from '../../services'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const Checkout = () => {
  let match = useRouteMatch()
  const { pathname } = useLocation()
  const history = useHistory()
  const path = pathname.split('/').reverse()[0].toLowerCase()
  const currentStep = getCurrentStep(path)
  const { verifiedAccountFlag, isFetching, accountID } = useSelector(state => state.userReducer)
  const enforceVerifiedAccountFlag = useSelector(state => state.configuration.enforceVerifiedAccountFlag)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const cartState = useSelector(state => state.cart) // check if there is some change in state , just to run use effect
  const [threeDSRedirect, setThreeDSRedirect] = useState()

  const placeOrder = event => {
    event.preventDefault()
    dispatch(requestCart())
    SlatwalApiService.cart.placeOrder({ returnJSONObjects: 'cart', transactionInitiator: 'ACCOUNT' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        const placeOrderResp = response.success()
        if (placeOrderResp.redirectUrl) {
          const { redirectUrl, redirectPayload, redirectMethod } = placeOrderResp
          setThreeDSRedirect({ redirectUrl, redirectPayload, redirectMethod })
        } else {
          setTimeout(() => {
            dispatch(receiveCart(placeOrderResp.cart))
            history.push('/order-confirmation')
          }, 2000)
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
      history.push(`/my-account?redirect=${pathname}`)
    }
  }, [history, pathname, dispatch, cartState])

  if (enforceVerifiedAccountFlag && !verifiedAccountFlag && isAuthenticated() && !isFetching && accountID.length > 0) return <Redirect to="/account-verification" />

  return (
    <Layout>
      <PageHeader />
      <div className="container pb-5 mb-2 mb-md-4">
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
      </div>
    </Layout>
  )
}

export default Checkout
