import { useDispatch, useSelector } from 'react-redux'
import { Layout } from '../../components'

import { Redirect, useHistory, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useGetAllOrders } from '../../hooks'
import { useEffect } from 'react'
import { confirmOrder } from '../../actions'
import { isAuthenticated } from '../../utils'

const OrderConfirmation = () => {
  let [orders, setRequest] = useGetAllOrders()
  const { t } = useTranslation()
  let dispatch = useDispatch()
  let loc = useLocation()
  let history = useHistory()
  const { contentBody = '' } = useSelector(state => state.content[loc.pathname.substring(1)]) || {}

  useEffect(() => {
    let didCancel = false

    if (!orders.isFetching && !orders.isLoaded && !didCancel) {
      setRequest({ ...orders, isFetching: true, isLoaded: false, params: { pageRecordsShow: 1, currentPage: 1 }, makeRequest: true })
    }
    dispatch(confirmOrder(false))
    return () => {
      didCancel = true
    }
  }, [orders, setRequest, dispatch])

  if (!isAuthenticated()) {
    return <Redirect to={'/my-account'} />
  }

  return (
    <Layout>
      <div className="bg-light p-0">
        <div className="page-title-overlap bg-lightgray pt-4">
          <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
            <div className="order-lg-1 pr-lg-4 text-center"></div>
          </div>
        </div>
        {orders.isLoaded && orders.data.ordersOnAccount[0] && (
          <div>
            <div className="bg-light p-4 text-center">
              <h1 className="display-4">{t('frontend.order.thank_you')}</h1>
              {orders.data && orders.data.ordersOnAccount && orders.data.ordersOnAccount.length > 0 && (
                <h1>
                  {`${t('frontend.order.key')} `}
                  <button
                    className="btn btn-link p-0 m-0 align-center link-btn"
                    onClick={e => {
                      e.preventDefault()
                      history.push(`/my-account/orders/${orders.data.ordersOnAccount[0].orderID}`)
                    }}
                  >
                    <h2>{`#${orders.data.ordersOnAccount[0].orderNumber}`} </h2>
                  </button>
                </h1>
              )}
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: contentBody,
              }}
            />
            <div className="container">
              <div className="row justify-content-center">
                <div className="col col-md-4">
                  <button
                    className="btn btn-link w-100 mb-3 align-center link-btn"
                    onClick={e => {
                      e.preventDefault()
                      history.push('/my-account')
                    }}
                  >
                    {t('frontend.header.myAccount')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default OrderConfirmation