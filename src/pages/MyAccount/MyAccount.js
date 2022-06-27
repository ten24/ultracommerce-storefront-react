import { Switch, Route, useRouteMatch, useLocation, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../../utils'
import queryString from 'query-string'
import { Layout, CreateAccount, ForgotPassword, ForgotPasswordReset, AccountCarts, AccountLogin, AccountOverview, AccountProfile, AccountFavorites, AccountAddresses, CreateOrEditAccountAddress, AccountOrderDetail, AccountPaymentMethods, AccountOrderHistory, CreateOrEditAccountPaymentMethod, UpdatePassword, AccountSubscriptionOrders, AccountSubscriptionOrderDetail, AccountImpersonation, AccountQuotes, AccountQuoteDetail, GiftCardList, GiftCardView } from '../../components'
import GuestOrderConfirmation from '../OrderConfirmation/GuestOrderConfirmation'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

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
  let match = useRouteMatch()
  let loc = useLocation()
  const user = useSelector(state => state.userReducer)

  useEffect(() => {
    if (isAuthenticated() && loc.search.includes('redirect=')) {
      const params = queryString.parse(loc.search)
      return <Redirect to={params.redirect} />
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.accountID])

  const path = loc.pathname.split('/').reverse()

  return (
    <Layout>
      {isAuthenticated() && (
        <Switch>
          <Route path={`/my-account/addresses/:id`}>
            <CreateOrEditAccountAddress path={path[0]} />
          </Route>
          <Route path={`/my-account/addresses`}>
            <AccountAddresses />
          </Route>
          <Route path={`/my-account/cards/:id`}>
            <CreateOrEditAccountPaymentMethod path={path[0]} />
          </Route>
          <Route path={`/my-account/cards`}>
            <AccountPaymentMethods />
          </Route>
          <Route path={`/my-account/carts`}>
            <AccountCarts />
          </Route>
          <Route path={`/my-account/favorites`}>
            <AccountFavorites />
          </Route>
          <Route path={`/my-account/orders/:id`}>
            <AccountOrderDetail path={path[0]} />
          </Route>
          <Route path={`/my-account/orders`}>
            <AccountOrderHistory />
          </Route>
          <Route path={`/my-account/profile`}>
            <AccountProfile />
          </Route>
          <Route path={`/my-account/subscription-orders/:id`}>
            <AccountSubscriptionOrderDetail path={path[0]} forwardState={loc.state} />
          </Route>
          <Route path={`/my-account/subscription-orders`}>
            <AccountSubscriptionOrders />
          </Route>
          <Route path={`/my-account/quote/:id`}>
            <AccountQuoteDetail path={path[0]} forwardState={loc.state} />
          </Route>
          <Route path={`/my-account/quotes`}>
            <AccountQuotes />
          </Route>
          <Route path={`/my-account/updatePassword`}>
            <UpdatePassword />
          </Route>
          <Route path={`/my-account/impersonation`}>
            <AccountImpersonation />
          </Route>

          <Route path={`/my-account/order-detail`}>
            <GuestOrderConfirmation path={path[0]} />
          </Route>
          <Route path={`/my-account/gift-cards/:id`}>
            <GiftCardView id={path[0]} />
          </Route>
          <Route path={`/my-account/gift-cards`}>
            <GiftCardList />
          </Route>

          <Route path={`/my-account/overview`}>
            <AccountOverview />
          </Route>
          <Route path={match.path}>{isAuthenticated() && <Redirect to={`/my-account/overview`} />}</Route>
        </Switch>
      )}

      {!isAuthenticated() && (
        <Switch>
          <Route path={`/my-account/createAccount`}>
            <CreateAccount />
          </Route>
          <Route path={`/my-account/forgotPassword`}>
            <ForgotPassword />
          </Route>
          <Route path={`/my-account/updateForgottenPassword`}>
            <ForgotPasswordReset />
          </Route>
          <Route path={`/my-account/order-detail`}>
            <GuestOrderConfirmation path={path[0]} />
          </Route>
          <Route path={`/my-account/login`}>
            <AccountLogin />
          </Route>
          <Route path={match.path}>
            <Redirect to={`/my-account/login`} />
          </Route>
        </Switch>
      )}
    </Layout>
  )
}

export default MyAccount
