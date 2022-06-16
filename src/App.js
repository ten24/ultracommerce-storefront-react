import React, { Suspense, useEffect } from 'react'
import { Switch, Route, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Loading, Footer, Header, SlatwallCMS } from '@ultracommerce/ultracommerce-storefront-react/components'
import { getConfiguration } from '@ultracommerce/ultracommerce-storefront-react/actions'
import { getBlogRoute } from '@ultracommerce/ultracommerce-storefront-react/selectors'
import { AffiliateUser, Blog, NotFound, Cart, MyAccount, Search, Checkout, ThreeDSHandover, ProductDetail, Brand, ContentPage, Product, ProductType, Category, Account, OrderConfirmation, GuestOrderConfirmation, BlogPost, Manufacturer, ErrorFallback, Contact, BulkOrder, OrderTemplateCart, OrderTemplateCheckout } from '@ultracommerce/ultracommerce-storefront-react/pages'
import logo from './assets/images/logo.svg'
import { ErrorBoundary } from 'react-error-boundary'
import { useScrollToTop } from '@ultracommerce/ultracommerce-storefront-react/hooks'
import Home from './pages/Home/Home'

const pageComponents = {
  Blog,
  Home,
  Checkout,
  Cart,
  Manufacturer,
  MyAccount,
  Search,
  ProductDetail,
  NotFound,
  ContentPage,
  Product,
  ProductType,
  Category,
  Contact,
  Brand,
  Account,
  OrderConfirmation,
  GuestOrderConfirmation,
  BlogPost,
  ErrorFallback,
}

//https://itnext.io/react-router-transitions-with-lazy-loading-2faa7a1d24a
export default function App() {
  const routing = useSelector(state => state.configuration.router)
  const blogUrlTitle = useSelector(getBlogRoute)
  const loc = useLocation()
  const shopByManufacturer = useSelector(state => state.configuration.shopByManufacturer)
  // eslint-disable-next-line no-unused-vars
  const scroll = useScrollToTop()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getConfiguration())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Suspense fallback={<Loading />}>
      <SlatwallCMS
        additionalProcessing={({ response, hydrated }) => {
          return hydrated
        }}
      >
        <Header logo={logo} mobileLogo={logo} />
        <ErrorBoundary
          key={loc.pathname}
          FallbackComponent={ErrorFallback}
          onReset={() => {
            // reset the state of your app so the error doesn't happen again
          }}
        >
          <Switch>
            <Route path="/404" component={NotFound} />
            <Route path="/Error" component={ErrorFallback} />
            <Route path="/contact" component={Contact} />
            <Route path={`/${blogUrlTitle}/:id`} component={BlogPost} />
            <Route path={`/${blogUrlTitle}`} component={Blog} />
            {routing.length &&
              routing.map(({ URLKey, URLKeyType }, index) => {
                return <Route key={index} path={`/${URLKey}/:id`} component={pageComponents[URLKeyType]} />
              })}
            <Route path="/order-confirmation" component={OrderConfirmation} />
            <Route path="/guest-order-confirmation" component={GuestOrderConfirmation} />
            <Route path={shopByManufacturer.slug} component={Manufacturer} />
            <Route path="/shop" component={Search} />
            <Route path="/product-type/:id" component={ProductType} />
            <Route path="/my-account/:id" component={MyAccount} />
            <Route exact path="/my-account" component={MyAccount} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/checkout/:id" component={Checkout} />
            <Route path="/threeDSHandover" component={ThreeDSHandover} />
            <Route path="/shopping-cart" component={Cart} />
            <Route path="/scheduled-delivery-cart" component={OrderTemplateCart} />
            <Route path="/scheduled-delivery-checkout" component={OrderTemplateCheckout} />
            <Route path="/bulkorder" component={BulkOrder} />
            <Route path="/affiliate" component={AffiliateUser} />
            <Route exact path="/" component={Home} />
            <Route path="" component={ContentPage} />
          </Switch>
        </ErrorBoundary>
        <Footer />
      </SlatwallCMS>
    </Suspense>
  )
}
