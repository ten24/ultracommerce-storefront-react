import { useEffect } from 'react'
import { AccountLayout, OrderDetails, OrderToolbar } from '../../'
import { useGetOrderDetails } from '../../../hooks/'
import { OrderFulfilments } from './OrderShipments'

const AccountOrderDetail = props => {
  const orderID = props.path
  let [order, setRequest, formatOrderDetails] = useGetOrderDetails()

  useEffect(() => {
    let didCancel = false
    if (!order.isFetching && !order.isLoaded && !didCancel) {
      setRequest({ ...order, isFetching: true, isLoaded: false, params: { orderID }, makeRequest: true })
    }
    return () => {
      didCancel = true
    }
  }, [order, orderID, setRequest])
  let orderFulfillmentGroups = formatOrderDetails(order.data)

  return (
    <AccountLayout title={`Order: ${(order.isLoaded && order.data.orderInfo?.at(0).orderNumber) || ''}`}>
      {order.isLoaded && <OrderToolbar delivered={order.data.orderInfo?.at(0)} orderPayments={order.data.orderPayments?.at(0)} />}
      {order.isLoaded && <OrderDetails orderInfo={order.data.orderInfo?.at(0)} orderFulfillments={orderFulfillmentGroups} orderPayments={order.data.orderPayments?.at(0)} />}
      {order.isLoaded && <OrderFulfilments fulfilments={orderFulfillmentGroups} files={order.data?.files} />}
    </AccountLayout>
  )
}
export { AccountOrderDetail }
