import React, { Suspense } from 'react'
import { Routes as RouterRoutes, Route, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Loading, Header, Footer } from './components'
import * as Sentry from '@sentry/react'
import { AffiliateUser, Blog, NotFound, Home, Cart, MyAccount, Search, ProductSearch, Checkout, ThreeDSHandover, Brand, ContentPage, Product, ProductType, Category, OrderConfirmation, GuestOrderConfirmation, BlogPost, Manufacturer, ErrorFallback, Contact, BulkOrder, OrderTemplateCart, OrderTemplateCheckout } from './pages'
import logo from './assets/images/logo.svg'
import mobileLogo from './assets/images/logo-mobile.svg'
import { ErrorBoundary } from 'react-error-boundary'
import { useCMSWrapper, useScrollToTop } from './hooks'
import Testing from './pages/Testing/Testing'
import { getBlogRoute } from './selectors/configurationSelectors'
const Routes = Sentry.withSentryReactRouterV6Routing(RouterRoutes)
const pageComponents = {
  Product: <Product />,
  ProductType: <ProductType />,
  Category: <Category />,
  Brand: <Brand />,
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
        <Routes>
          <Route path="/404" element={<NotFound />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/Error" element={<ErrorFallback />} />
          <Route path="/contact" element={<Contact />} />
          <Route path={`/${blogUrlTitle}`}>
            <Route index element={<Blog />} />
            <Route path={`*`} element={<BlogPost />} />
          </Route>
          {routing?.map(({ URLKey, URLKeyType }, index) => {
            return !!pageComponents[URLKeyType] && <Route key={index} path={`/${URLKey}/:id`} element={pageComponents[URLKeyType]} />
          })}
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/guest-order-confirmation" element={<GuestOrderConfirmation />} />
          <Route path={shopByManufacturer.slug} element={<Manufacturer />} />
          <Route path="/shop" element={<Search />} />
          <Route path="/productSearch" element={<ProductSearch />} />
          <Route path="/product-type/:id" element={<ProductType />} />
          <Route path="/my-account/*" element={<MyAccount />} />
          <Route path="/checkout/*" element={<Checkout />} />
          <Route path="/threeDSHandover" element={<ThreeDSHandover />} />
          <Route path="/shopping-cart" element={<Cart />} />
          <Route path="/scheduled-delivery-cart" element={<OrderTemplateCart />} />
          <Route path="/scheduled-delivery-checkout/*" element={<OrderTemplateCheckout />} />
          <Route path="/bulkorder" element={<BulkOrder />} />
          <Route path="/affiliate" element={<AffiliateUser />} />
          <Route path={'*'} element={<ContentPage />} />
          <Route index element={<Home />} />
        </Routes>
      </ErrorBoundary>
      <Footer />
    </Suspense>
  )
}
