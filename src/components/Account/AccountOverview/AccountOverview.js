import { AccountLayout, AccountContent } from '../../'
import { Link } from 'react-router-dom'
import { useFormatDateTime, useFormatCurrency, useAccountOverview } from '../../../hooks/'
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
      <th>
        <Link className="nav-link-style font-weight-medium font-size-sm" to={`/my-account/orders/${orderID}`}>
          {orderNumber}
        </Link>
        <br />
      </th>
      <td>{formateDate(createdDateTime)}</td>
      <td>
        <OrderStatus text={orderStatusType_typeName} />
      </td>
      <td>{formatCurrency(calculatedTotal)}</td>
    </tr>
  )
}

const AccountRecentOrders = ({ orders }) => {
  const { t } = useTranslation()
  const { mostRecentCount } = useSelector(state => state.configuration.myAccount)

  return (
    <>
      {orders.data && orders.data.ordersOnAccount && orders.data.ordersOnAccount.length > 0 && (
        <>
          <hr className="mb-4" />
          <h4>{t('frontend.order.recent_order')}</h4>
          <div className="row  rounded align-items-center justify-content-between ">
            <div className="table-responsive font-size-md">
              <table className="table table-striped table-bordered mt-3">
                <thead>
                  <tr>
                    <th>{t('frontend.account.order.heading')}</th>
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
          <Link className="btn btn-primary" to="/my-account/orders">
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
  const { orders } = useAccountOverview()
  return (
    <AccountLayout crumbs={crumbs} title={title}>
      <h2 className="h3">{`${t('frontend.core.welcome')}, ${userData.firstName} ${userData.lastName}!`}</h2>
      <AccountContent contentTitle={contentTitle} customBody={customBody} />
      <AccountRecentOrders orders={orders} />
    </AccountLayout>
  )
}

export { AccountOverview }
