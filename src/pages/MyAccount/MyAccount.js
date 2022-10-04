import { Routes as RouterRoutes, Route, useLocation, useNavigate } from 'react-router-dom'
import * as Sentry from '@sentry/react'

import { isAuthenticated } from '../../utils'
import queryString from 'query-string'
import { Layout, CreateAccount, ForgotPassword, ForgotPasswordReset, AccountCarts, AccountLogin, AccountOverview, AccountProfile, AccountFavorites, AccountAddresses, CreateOrEditAccountAddress, AccountOrderDetail, AccountPaymentMethods, AccountOrderHistory, CreateOrEditAccountPaymentMethod, UpdatePassword, AccountSubscriptionOrders, AccountSubscriptionOrderDetail, AccountImpersonation, AccountQuotes, AccountQuoteDetail, GiftCardList, GiftCardView, RedirectWithReplace } from '../../components'
import GuestOrderConfirmation from '../OrderConfirmation/GuestOrderConfirmation'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
const Routes = Sentry.withSentryReactRouterV6Routing(RouterRoutes)

// eslint-disable-next-line no-unused-vars
const pageComponents = {
  AccountLogin,
  AccountOverview,
  AccountProfile,
  AccountFavorites,
  AccountAddresses,
  CreateOrEditAccountAddress,
  AccountOrderDetail,
  AccountPaymentMethods,
  AccountOrderHistory,
  CreateOrEditAccountPaymentMethod,
  AccountCarts,
}
const MyAccount = () => {
  let loc = useLocation()
  const { t } = useTranslation()
  const user = useSelector(state => state.userReducer)
  const navigate = useNavigate()
  useEffect(() => {
    if (isAuthenticated() && loc.search.includes('redirect=')) {
      const params = queryString.parse(loc.search)
      return navigate({
        pathname: params.redirect,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.accountID])

  const path = loc.pathname.split('/').reverse()
  return (
    <Layout>
      {isAuthenticated() && (
        <Routes>
          <Route path={`addresses/:id`} element={<CreateOrEditAccountAddress path={path?.at(0)} />} />
          <Route path={`addresses`} element={<AccountAddresses />} />
          <Route path={`cards/:id`} element={<CreateOrEditAccountPaymentMethod path={path?.at(0)} />} />
          <Route path={`cards`} element={<AccountPaymentMethods />} />

          <Route path={`orders`} element={<AccountOrderHistory />} />
          <Route path={`orders/:id`} element={<AccountOrderDetail path={path?.at(0)} />} />
          <Route path={`subscription-orders/:id`} element={<AccountSubscriptionOrderDetail path={path?.at(0)} />} />
          <Route path={`subscription-orders`} element={<AccountSubscriptionOrders />} />
          <Route path={`quotes/:id`} element={<AccountQuoteDetail path={path?.at(0)} />} />
          <Route path={`quotes`} element={<AccountQuotes />} />
          <Route path={`gift-cards/:id`} element={<GiftCardView id={path?.at(0)} />} />
          <Route path={`gift-cards`} element={<GiftCardList />} />

          <Route path={`profile`} element={<AccountProfile />} />
          <Route path={`carts`} element={<AccountCarts />} />
          <Route path={`favorites`} element={<AccountFavorites />} />
          <Route path={`updatePassword`} element={<UpdatePassword />} />
          <Route path={`impersonation`} element={<AccountImpersonation />} />
          <Route path={`order-detail`} element={<GuestOrderConfirmation path={path?.at(0)} />} />
          <Route path={`overview`} element={<AccountOverview />} />
          <Route path={`*`} element={<RedirectWithReplace pathname={`/my-account/overview`} />} />
        </Routes>
      )}

      {!isAuthenticated() && (
        <Routes>
          <Route path={`createAccount`} element={<CreateAccount />} />
          <Route path={`forgotPassword`} element={<ForgotPassword />} />
          <Route path={`updateForgottenPassword`} element={<ForgotPasswordReset />} />
          <Route path={`claimGuestAccount`} element={<ForgotPasswordReset title={t('frontend.account.claim.heading')} />} />
          <Route path={`order-detail`} element={<GuestOrderConfirmation path={path?.at(0)} />} />
          <Route path={`login`} element={<AccountLogin />} />
          <Route path={`*`} element={<RedirectWithReplace pathname={`/my-account/login`} />} />
        </Routes>
      )}
    </Layout>
  )
}

export default MyAccount
