// import PropTypes from 'prop-types'
import { AccountLayout, ListingPagination, AccountToolBar } from '../../'
import { useTranslation } from 'react-i18next'
import { useAccountCarts, useFormatCurrency, useFormatDate } from '../../../hooks'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setOrderOnCart } from '../../../actions'
import { AccountContent } from '../AccountContent/AccountContent'

const OrderStatus = ({ type = 'info', text }) => {
  return <span className={`align-middle badge bg-info ml-2 bg bg-${type} m-0`}>{text}</span>
}
const OrderListItem = props => {
  const [formatCurrency] = useFormatCurrency({})
  const [formateDate] = useFormatDate()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { orderID, createdDateTime, orderStatusType_typeName, calculatedTotal } = props
  return (
    <tr>
      <td className="py-3">
        <b>{formateDate(createdDateTime)}</b>
      </td>
      <td className="py-3">
        <OrderStatus text={orderStatusType_typeName} />
      </td>
      <td className="py-3">{formatCurrency(calculatedTotal)}</td>
      <td className="py-3">
        <Link
          className="text-link link"
          onClick={event => {
            dispatch(setOrderOnCart(orderID))
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          }}
          to="/shopping-cart"
        >
          {t('frontend.account.order.change_order')}
        </Link>
        <br />
      </td>
    </tr>
  )
}

const AccountCarts = ({ contentBody, crumbs, title, contentTitle }) => {
  const { keyword, setSearchTerm, search, orders, totalPages } = useAccountCarts({})
  const { t } = useTranslation()

  return (
    <AccountLayout title={title}>
      <AccountContent />

      {orders.data.ordersOnAccount?.length === 0 && (
        <div className="alert alert-info" role="alert">
          {t('frontend.account.carts_none')}
        </div>
      )}
      <AccountToolBar term={keyword} updateTerm={setSearchTerm} search={search} />
      <div className="table-responsive font-size-md">
        <table className="table table-striped table-bordered mt-3">
          <thead>
            <tr>
              <th>{t('frontend.core.date_created')}</th>
              <th>{t('frontend.account.order.status')}</th>
              <th> {t('frontend.account.order.total')}</th>
              <th>{t('frontend.account.order.select_order')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.isLoaded &&
              orders.data.ordersOnAccount?.map((order, index) => {
                return <OrderListItem key={index} {...order} />
              })}
          </tbody>
        </table>
      </div>
      <ListingPagination recordsCount={orders.data.recordsCount} currentPage={orders.data.currentPage} totalPages={totalPages} setPage={search} />
    </AccountLayout>
  )
}

export { AccountCarts }
