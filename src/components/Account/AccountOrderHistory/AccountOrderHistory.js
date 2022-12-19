import { Link } from 'react-router-dom'
import { AccountLayout, AccountContent, ListingPagination, AccountToolBar } from '../../'
import { useTranslation } from 'react-i18next'
import { useFormatCurrency, useFormatDateTime, useOrderHistoryList } from '../../../hooks/'

const OrderStatus = ({ type = 'info', text }) => {
  return <span className={`badge bg-${type} m-0`}>{text}</span>
}

const OrderListItem = props => {
  const [formatCurrency] = useFormatCurrency({})
  const [formateDate] = useFormatDateTime()

  const { orderNumber, orderID, orderOpenDateTime, orderStatusType_typeName, calculatedTotal } = props
  return (
    <tr>
      <th>
        {orderID && <Link className="nav-link-style font-weight-medium font-size-sm" to={`/my-account/orders/${orderID}`}>
          {orderNumber}
        </Link>
        }
        <br />
      </th>
      <td>{formateDate(orderOpenDateTime)}</td>
      <td>
        <OrderStatus text={orderStatusType_typeName} />
      </td>
      <td>{formatCurrency(calculatedTotal)}</td>
    </tr>
  )
}

const OrderHistoryList = () => {
  const { t } = useTranslation()
  const { search, setSearchTerm, keyword, orders, totalPages } = useOrderHistoryList({})

  return (
    <>
      <AccountContent />
      
      <AccountToolBar term={keyword} updateTerm={setSearchTerm} search={search} />

      <div className="table-responsive font-size-md">
        <table className="table table-striped table-bordered ">
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
              orders.data.ordersOnAccount.map((order, index) => {
                return <OrderListItem key={index} {...order} />
              })}
          </tbody>
        </table>
      </div>

      <ListingPagination recordsCount={orders.data.records} currentPage={orders.data.currentPage} totalPages={totalPages} setPage={search} />
    </>
  )
}

const AccountOrderHistory = ({ crumbs, title, orders }) => {
  const { t } = useTranslation()

  return (
    <AccountLayout title={t('frontend.account.account_order_history')}>
      <OrderHistoryList orders={orders} />
    </AccountLayout>
  )
}

export { AccountOrderHistory }
