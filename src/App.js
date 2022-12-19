import React, { Suspense } from 'react'
import { Routes as RouterRoutes, Route, useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { useSelector } from 'react-redux'
import { ErrorBoundary } from 'react-error-boundary'
import { useScrollToTop, Loading, getBlogRoute, useContentContext, DynamicPage, AffiliateUser, Blog, Cart, MyAccount, Checkout, ThreeDSHandover, OrderConfirmation, GuestOrderConfirmation, BlogPost, Manufacturer, ErrorFallback,  BulkOrder, OrderTemplateCart } from '@ultracommerce/ultracommerce-storefront-react/global'
const Routes = Sentry.withSentryReactRouterV6Routing(RouterRoutes)

const pageComponents = {
  ProductType: <DynamicPage />,
  Category: <DynamicPage />,
  Brand: <DynamicPage />,
}

//https://itnext.io/react-router-transitions-with-lazy-loading-2faa7a1d24a
export default function App() {
  const routing = useSelector(state => state.configuration.router)
  const blogUrlTitle = useSelector(getBlogRoute)
  const loc = useLocation()
  const shopByManufacturer = useSelector(state => state.configuration.shopByManufacturer)
  const pageData = useContentContext()
  // eslint-disable-next-line no-unused-vars
  // const cms = useCMSWrapper()
  // eslint-disable-next-line no-unused-vars
  const scroll = useScrollToTop()
  if (!pageData?.title) return null
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary
        key={loc.pathname}
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <Routes>
          <Route path="/404" element={<DynamicPage />} />
          <Route path={`/${blogUrlTitle}`}>
            <Route index element={<Blog />} />
            <Route path={`*`} element={<BlogPost />} />
          </Route>
          <Route path={shopByManufacturer.slug} element={<Manufacturer />} />
          {routing?.map(({ URLKey, URLKeyType }, index) => {
            return !!pageComponents[URLKeyType] && <Route key={index} path={`/${URLKey}/:id`} element={pageComponents[URLKeyType]} />
          })}
          <Route path="/bulkorder" element={<BulkOrder />} />
          <Route path="/affiliate" element={<AffiliateUser />} />
          <Route path="/my-account/*" element={<MyAccount />} />
          <Route path="/shopping-cart" element={<Cart />} />
          <Route path="/checkout/*" element={<Checkout />} />
          <Route path="/threeDSHandover" element={<ThreeDSHandover />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/guest-order-confirmation" element={<GuestOrderConfirmation />} />
          <Route path="/scheduled-delivery-cart" element={<OrderTemplateCart />} />
          <Route path={'*'} element={<DynamicPage />} />
          <Route index element={<DynamicPage />} />
        </Routes>
      </ErrorBoundary>
    </Suspense>
  )
}
