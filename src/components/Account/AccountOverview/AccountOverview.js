import { AccountLayout, AccountContent } from '../../'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFormatDateTime, useFormatCurrency, useGetAllOrders } from '../../../hooks/'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const OrderStatus = ({ type = 'info', text }) => {
  return <span className={`badge bg-${type} m-0`}>{text}</span>
}

const OrderListItem = props => {
  const [formatCurrency] = useFormatCurrency({})
  const [formateDate] = useFormatDateTime()

  const { orderNumber, orderID, createdDateTime, orderStatusType_typeName, calculatedTotal } = props
  return (
    <tr>
      <td className="py-3">
        <Link className="nav-link-style font-weight-medium font-size-sm" to={`/my-account/orders/${orderID}`}>
          {orderNumber}
        </Link>
        <br />
      </td>
      <td className="py-3">{formateDate(createdDateTime)}</td>
      <td className="py-3">
        <OrderStatus text={orderStatusType_typeName} />
      </td>
      <td className="py-3">{formatCurrency(calculatedTotal)}</td>
    </tr>
  )
}

const AccountRecentOrders = () => {
  let [orders, setRequest] = useGetAllOrders()
  const { t } = useTranslation()
  const { mostRecentCount } = useSelector(state => state.configuration.myAccount)
  useEffect(() => {
    let didCancel = false
    if (!orders.isFetching && !orders.isLoaded && !didCancel) {
      setRequest({ ...orders, isFetching: true, isLoaded: false, params: {}, makeRequest: true })
    }
    return () => {
      didCancel = true
    }
  }, [orders, setRequest])

  return (
    <>
      {orders.data && orders.data.ordersOnAccount && orders.data.ordersOnAccount.length > 0 && (
        <>
          <h3 className="h4 mt-5 mb-3">{t('frontend.account.order.recent_order')}</h3>
          <div className="row  rounded align-items-center justify-content-between mb-4">
            <div className="table-responsive font-size-md">
              <table className="table table-striped table-bordered mt-3">
                <thead>
                  <tr>
                    <th>{t('frontend.account.order.heading')} #</th>
                    <th>{t('frontend.account.order.date')}</th>
                    <th>{t('frontend.account.order.status')}</th>
                    <th> {t('frontend.account.order.total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.isLoaded &&
                    orders.data.ordersOnAccount
                      .filter((_, index) => index < mostRecentCount)
                      .map((order, index) => {
                        return <OrderListItem key={index} {...order} />
                      })}
                </tbody>
              </table>
            </div>
          </div>
          <Link className="btn btn-primary" to={`/my-account/orders`}>
            {t('frontend.order.view_orders')}
          </Link>
        </>
      )}
    </>
  )
}

const AccountOverview = ({ customBody, crumbs, title, contentTitle }) => {
  const userData = useSelector(state => state.userReducer)
  const { t } = useTranslation()
  return (
    <AccountLayout crumbs={crumbs} title={title}>
      <h2 className="h3">{`${t('frontend.core.welcome')}, ${userData.firstName} ${userData.lastName}!`}</h2>
      <AccountContent contentTitle={contentTitle} customBody={customBody} />
      <AccountRecentOrders />
    </AccountLayout>
  )
}

export { AccountOverview }
