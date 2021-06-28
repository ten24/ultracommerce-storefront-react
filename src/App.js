import React, { Suspense, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Loading, CMSWrapper, ScrollToTop, Header } from './components'
import { getConfiguration } from './actions'
import { Blog, NotFound, Home, Cart, MyAccount, ProductListing, Checkout, ProductDetail, Brand, ContentPage, Product, ProductType, Category, Account, OrderConfirmation, BlogPost, Manufacturer, ErrorFallback, Contact } from './pages'
import logo from './assets/images/logo.svg'
import mobileLogo from './assets/images/logo-mobile.svg'
import { ErrorBoundary } from 'react-error-boundary'

const pageComponents = {
  Blog,
  Home,
  Checkout,
  Cart,
  Manufacturer,
  MyAccount,
  ProductListing,
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
  BlogPost,
  ErrorFallback,
}

//https://itnext.io/react-router-transitions-with-lazy-loading-2faa7a1d24a
export default function App() {
  const routing = useSelector(state => state.configuration.router)
  const shopByManufacturer = useSelector(state => state.configuration.shopByManufacturer)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getConfiguration())
  }, [dispatch])
  return (
    <Suspense fallback={<Loading />}>
      <Header logo={logo} mobileLogo={mobileLogo} />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <ScrollToTop />
        {/* <SEO /> */}
        <CMSWrapper />
        <Switch>
          <Route path="/404" component={NotFound} />
          <Route path="/Error" component={ErrorFallback} />
          <Route path="/contact" component={Contact} />
          {routing.length &&
            routing.map(({ URLKey, URLKeyType }, index) => {
              return <Route key={index} path={`/${URLKey}/:id`} component={pageComponents[URLKeyType]} />
            })}
          <Route path="/order-confirmation" component={OrderConfirmation} />
          <Route path={shopByManufacturer.slug} component={Manufacturer} />
          <Route path="/products" component={ProductListing} />
          <Route path="/product" component={ProductListing} />
          <Route path="/search" component={ProductListing} />
          <Route path="/my-account" component={MyAccount} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/checkout/:id" component={Checkout} />
          <Route path="/MyAccount" component={MyAccount} />
          <Route path="/shopping-cart" component={Cart} />
          <Route path="/blog" component={Blog} exact />
          <Route path="/blog/:id" component={BlogPost} />
          <Route exact path="/" component={Home} />
          <Route path="" component={ContentPage} />
        </Switch>
      </ErrorBoundary>
    </Suspense>
  )
}
