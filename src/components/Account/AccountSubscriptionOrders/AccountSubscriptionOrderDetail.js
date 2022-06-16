import { SlatwalApiService } from '../../../services'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccountLayout, OrderTemplateToolbar, OrderTemplateDetails } from '../../'
import { useOrderHistoryList } from '../../../hooks'
import { Link } from 'react-router-dom'

const OrderStatus = ({ type = 'info', text }) => {
  return <span className={`badge bg-${type} m-0`}>{text}</span>
}

const DeliveryHistoryListItem = ({ orderNumber, createdDateTime, orderID, orderStatusType_typeName }) => {
  return (
    <tr>
      <th>
        {orderID && (
          <Link className="nav-link-style font-weight-medium font-size-sm" to={`/my-account/orders/${orderID}`}>
            {orderNumber}
          </Link>
        )}
        <br />
      </th>
      <td>
        <OrderStatus text={orderStatusType_typeName} />
      </td>
      <td>{createdDateTime}</td>
    </tr>
  )
}

const AccountSubscriptionOrderDetail = props => {
  const orderTemplateID = props.path
  const { t } = useTranslation()
  const [orderTemplate, setOrderTemplate] = useState()
  const { orders } = useOrderHistoryList({ params: JSON.stringify({ orderTemplateID }) })
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    let didCancel = false
    if (!isLoaded) {
      SlatwalApiService.orderTemplate.getOrderTemplateDetails({ orderTemplateID: orderTemplateID }).then(response => {
        if (response.isSuccess() && !didCancel && response.success().orderTemplate) {
          setOrderTemplate(response.success().orderTemplate)
          setLoaded(true)
        } else {
          setOrderTemplate([])
          setLoaded(false)
        }
      })
    }

    return () => {
      didCancel = true
    }
    // eslint-disable-next-line
  }, [])
  if (!orderTemplate?.orderTemplateName) return null

  return (
    <AccountLayout title={`${(orderTemplate && orderTemplate.orderTemplateName) || ''}`}>
      {isLoaded && <OrderTemplateToolbar updateOrderTemplate={setOrderTemplate} templateID={orderTemplateID} orderTemplateInfo={orderTemplate} />}
      {isLoaded && <OrderTemplateDetails templateID={orderTemplateID} orderItems={[{ orderItems: orderTemplate.orderTemplateItems }]} />}

      <div className="table-responsive font-size-md" id="delivery-history">
        <h5>{t('frontend.account.scheduled.delivery.detail.deliveryHistoryTitle')}</h5>
        <br />
        <table className="table table-striped table-bordered ">
          <thead>
            <tr>
              <th>{t('frontend.account.scheduled.delivery.detail.orderNumber')}</th>
              <th>{t('frontend.account.scheduled.delivery.detail.orderStatus')}</th>
              <th>{t('frontend.account.scheduled.delivery.detail.orderDate')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.isLoaded &&
              orders.data.ordersOnAccount.map((order, index) => {
                return <DeliveryHistoryListItem key={index} {...order} />
              })}
          </tbody>
        </table>
      </div>
    </AccountLayout>
  )
}
export { AccountSubscriptionOrderDetail }
