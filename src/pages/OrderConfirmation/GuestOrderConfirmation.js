import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router'
import { useGetOrderDetails } from '../../hooks'
import { useEffect } from 'react'
import { confirmOrder } from '../../actions'
import { useCookies } from 'react-cookie'
import queryString from 'query-string'
import { AccountLayout, OrderDetails, OrderFulfilments, OrderToolbar } from '../../components'
import { isAuthenticated } from '../../utils'

const GuestOrderConfirmation = () => {
  let [order, setRequest, formatOrderDetails] = useGetOrderDetails()
  const [, , removeCookie] = useCookies()
  let dispatch = useDispatch()
  let loc = useLocation()
  const params = queryString.parse(loc.search)
  let orderFulfillmentGroups = formatOrderDetails(order.data)

  useEffect(() => {
    let didCancel = false

    if (!order.isFetching && !order.isLoaded && !didCancel) {
      setRequest({ ...order, isFetching: true, isLoaded: false, params: { tokenHash: params.token }, makeRequest: true })
    }
    if (!order.isFetching && order.isLoaded && !didCancel) {
      removeCookie('affiliateCode', { path: '/' })
    }
    dispatch(confirmOrder(false))
    return () => {
      didCancel = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.token])

  if (isAuthenticated()) {
    return (
      <AccountLayout title={`Order: ${(order.isLoaded && order.data.orderInfo?.at(0).orderNumber) || ''}`}>
        {order.isLoaded && <OrderToolbar delivered={order.data.orderInfo?.at(0)} orderPayments={order.data.orderPayments?.at(0)} />}
        {order.isLoaded && <OrderDetails orderInfo={order.data.orderInfo?.at(0)} orderFulfillments={orderFulfillmentGroups} orderPayments={order.data.orderPayments?.at(0)} />}
        {order.isLoaded && <OrderFulfilments fulfilments={orderFulfillmentGroups} files={order.data?.files} />}
      </AccountLayout>
    )
  }
  return (
    <div className="container py-5 mb-2 mb-md-3">
      <div className="row">
        <section className="col-lg-12">
          {order.isLoaded && <OrderToolbar delivered={order.data.orderInfo?.at(0)} orderPayments={order.data.orderPayments?.at(0)} />}
          {order.isLoaded && <OrderDetails orderInfo={order.data.orderInfo?.at(0)} orderFulfillments={order.data.orderFulfillments.at(0)} orderPayments={order.data.orderPayments.at(0)} />}
          {order.isLoaded && <OrderFulfilments fulfilments={orderFulfillmentGroups} files={order.data?.files} />}
        </section>
      </div>
    </div>
  )
}

export default GuestOrderConfirmation
