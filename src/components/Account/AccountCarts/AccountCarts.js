import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { AccountLayout, ListingPagination, AccountToolBar } from '../../'
import { useTranslation } from 'react-i18next'
import { useFormatCurrency, useFormatDate, useGetAccountCartsAndQuotes } from '../../../hooks'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setOrderOnCart } from '../../../actions'

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
      <td className="py-3">{formateDate(createdDateTime)}</td>
      <td className="py-3">
        <OrderStatus text={orderStatusType_typeName} />
      </td>
      <td className="py-3">{formatCurrency(calculatedTotal)}</td>
      <td className="py-3">
        <Link
          className="text-link"
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

const AccountCarts = ({ customBody, crumbs, title, contentTitle }) => {
  const [keyword, setSearchTerm] = useState('')
  const { t } = useTranslation()
  let [orders, setRequest] = useGetAccountCartsAndQuotes()
  const search = (currentPage = 1) => {
    setRequest({ ...orders, params: { currentPage, pageRecordsShow: 10, keyword }, makeRequest: true, isFetching: true, isLoaded: false })
  }
  useEffect(() => {
    let didCancel = false
    if (!orders.isFetching && !orders.isLoaded && !didCancel) {
      setRequest({ ...orders, isFetching: true, isLoaded: false, params: { pageRecordsShow: 10, keyword }, makeRequest: true })
    }
    return () => {
      didCancel = true
    }
  }, [orders, keyword, setRequest])
  return (
    <AccountLayout title={title}>
      <h2 className="h3 ">{t('frontend.account.carts')}</h2>
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
      <ListingPagination recordsCount={orders.data.recordsCount} currentPage={orders.data.currentPage} totalPages={Math.ceil(orders.data.recordsCount / 10)} setPage={search} />
    </AccountLayout>
  )
}

export { AccountCarts }
