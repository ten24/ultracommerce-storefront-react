import React, { Suspense, useEffect } from 'react'
import { Switch, Route, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Loading, Footer, Header } from '@slatwall/slatwall-storefront-react/components'
import { getConfiguration } from '@slatwall/slatwall-storefront-react/actions'
import { Blog, NotFound, Search, Cart, MyAccount, Checkout, ProductDetail, Brand, ContentPage, Product, ProductType, Category, Account, OrderConfirmation, BlogPost, Manufacturer, ErrorFallback, Contact } from '@slatwall/slatwall-storefront-react/pages'
import logo from './assets/images/logo.svg'
import { ErrorBoundary } from 'react-error-boundary'
import { useCMSWrapper, useScrollToTop } from '@slatwall/slatwall-storefront-react/hooks'
import Home from './pages/Home/Home'

const pageComponents = {
  Blog,
  Home,
  Checkout,
  Cart,
  Search,
  Manufacturer,
  MyAccount,
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
  const loc = useLocation()
  const routing = useSelector(state => state.configuration.router)
  const shopByManufacturer = useSelector(state => state.configuration.shopByManufacturer)
  // eslint-disable-next-line no-unused-vars
  const cms = useCMSWrapper()
  // eslint-disable-next-line no-unused-vars
  const scroll = useScrollToTop()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getConfiguration())
  }, [dispatch])
  useEffect(() => {
    console.table({ Client: process.env.REACT_APP_VERSION || 'missing', Core: process.env.REACT_APP_CORE_VERSION || 'missing', SDK: process.env.REACT_APP_SDK_VERSION || 'missing' })
  }, [])
  return (
    <Suspense fallback={<Loading />}>
      <Header logo={logo} mobileLogo={logo} />
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
          <Route path="/Error" component={ErrorFallback} />
          <Route path="/contact" component={Contact} />
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
          <Route path="/MyAccount" component={MyAccount} />
          <Route path="/shopping-cart" component={Cart} />
          <Route path="/blog" component={Blog} exact />
          <Route path="/blog/:id" component={BlogPost} />
          <Route exact path="/" component={Home} />
          <Route path="" component={ContentPage} />
        </Switch>
        <Footer />
      </ErrorBoundary>
    </Suspense>
  )
}
