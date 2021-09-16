import { PageHeader, Layout, CheckoutSideBar, StepsHeader, ShippingSlide, PaymentSlide, ReviewSlide } from '../../components'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import './checkout.css'
import { useCheckout } from '../../hooks/'
import { useTranslation } from 'react-i18next'

const Checkout = () => {
  let match = useRouteMatch()
  let { currentStep } = useCheckout()
  const { t } = useTranslation()
  return (
    <Layout>
      <PageHeader title={t('frontend.header.checkout')} />
      <div className="container pb-5 mb-2 mb-md-4 mt-4">
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
          <CheckoutSideBar />
        </div>
      </div>
    </Layout>
  )
}

export default Checkout
