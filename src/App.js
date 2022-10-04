import React, { Suspense, useEffect } from 'react'
import * as Sentry from '@sentry/react'
import { Routes, useLocation } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ErrorBoundary } from 'react-error-boundary'
import { Loading, Footer, Header } from '@ultracommerce/ultracommerce-storefront-react/components'
import { getConfiguration } from '@ultracommerce/ultracommerce-storefront-react/actions'
import { AffiliateUser, Blog, NotFound, Cart, MyAccount, Search, Checkout, ThreeDSHandover, Brand, ContentPage, Product, ProductType, Category, OrderConfirmation, GuestOrderConfirmation, BlogPost, Manufacturer, ErrorFallback, Contact, BulkOrder, OrderTemplateCart, OrderTemplateCheckout, ProductSearch } from '@ultracommerce/ultracommerce-storefront-react/pages'
import { useCMSWrapper, useScrollToTop } from '@ultracommerce/ultracommerce-storefront-react/hooks'
import { getBlogRoute } from '@ultracommerce/ultracommerce-storefront-react/selectors'
import logo from './assets/images/logo.svg'
import Home from './pages/Home/Home'
const pageComponents = {
  Product: <Product />,
  ProductType: <ProductType />,
  Category: <Category />,
  Brand: <Brand />,
}
const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

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
      <Header logo={logo} mobileLogo={logo} />
      <ErrorBoundary
        key={loc.pathname}
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        {/* <SEO /> */}
        <SentryRoutes>
          <Route path="/404" element={<NotFound />} />
          <Route path="/Error" element={<ErrorFallback />} />
          <Route path="/contact" element={<Contact />} />
          <Route path={`/${blogUrlTitle}`}>
            <Route index element={<Blog />} />
            <Route path={`*`} element={<BlogPost />} />
          </Route>
          {routing.length &&
            routing.map(({ URLKey, URLKeyType }, index) => {
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
        </SentryRoutes>
      </ErrorBoundary>
      <Footer />
    </Suspense>
  )
}
