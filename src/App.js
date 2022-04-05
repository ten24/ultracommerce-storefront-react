import React, { Suspense, useEffect } from 'react'
import { Switch, Route, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Loading, Header, Footer } from './components'
import { getConfiguration } from './actions'
import { Blog, NotFound, Home, Cart, MyAccount, Search, Checkout, ThreeDSHandover, ProductDetail, Brand, ContentPage, Product, ProductType, Category, Account, OrderConfirmation, BlogPost, Manufacturer, ErrorFallback, Contact, BulkOrder } from './pages'
import logo from './assets/images/logo.svg'
import mobileLogo from './assets/images/logo-mobile.svg'
import { ErrorBoundary } from 'react-error-boundary'
import { useCMSWrapper, useScrollToTop } from './hooks'
import Testing from './pages/Testing/Testing'
import { getBlogRoute } from './selectors/configurationSelectors'

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
  const cms = useCMSWrapper()
  // eslint-disable-next-line no-unused-vars
  const scroll = useScrollToTop()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getConfiguration())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Suspense fallback={<Loading />}>
      <Header logo={logo} mobileLogo={mobileLogo} />
      <ErrorBoundary
        key={loc.pathname}
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        {/* <SEO /> */}
        <Switch>
          <Route path="/404" component={NotFound} />
          <Route path="/testing" component={Testing} />
          <Route path="/Error" component={ErrorFallback} />
          <Route path="/contact" component={Contact} />
          <Route path={`/${blogUrlTitle}/:id`} component={BlogPost} />
          <Route path={`/${blogUrlTitle}`} component={Blog} />
          {routing.length &&
            routing.map(({ URLKey, URLKeyType }, index) => {
              return <Route key={index} path={`/${URLKey}/:id`} component={pageComponents[URLKeyType]} />
            })}
          <Route path="/order-confirmation" component={OrderConfirmation} />
          <Route path={shopByManufacturer.slug} component={Manufacturer} />
          <Route path="/shop" component={Search} />
          <Route path="/product-type/:id" component={ProductType} />
          <Route path="/my-account" component={MyAccount} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/checkout/:id" component={Checkout} />
          <Route path="/threeDSHandover" component={ThreeDSHandover} />
          <Route path="/MyAccount" component={MyAccount} />
          <Route path="/shopping-cart" component={Cart} />
          <Route path="/bulkorder" component={BulkOrder} />
          <Route exact path="/" component={Home} />
          <Route path="" component={ContentPage} />
        </Switch>
      </ErrorBoundary>
      <Footer />
    </Suspense>
  )
}
