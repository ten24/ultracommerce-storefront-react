import { Link } from 'react-router-dom'
import { AccountLayout, AccountContent, ListingPagination } from '../../'
import { useTranslation } from 'react-i18next'
import { useFormatDateTime, useOrderTemplateList } from '../../../hooks/'

const SubscriptionOrdersListItem = props => {
  const { t } = useTranslation()
  const [formateDate] = useFormatDateTime()
  const { orderTemplateID, orderTemplateName, frequencyTerm_termName, scheduleOrderNextPlaceDateTime, calculatedOrderTemplateItemsCount, orderTemplateStatusType_typeName } = props
  return (
    <tr>
      <th>
        <Link className="nav-link-style font-weight-medium font-size-sm" to={`/my-account/subscription-orders/${orderTemplateID}`}>
          {orderTemplateName}
        </Link>
        <br />
      </th>
      <td>{t('frontend.account.order.subscription.frequencyPrefix') + ' ' + frequencyTerm_termName}</td>
      <td>{formateDate(scheduleOrderNextPlaceDateTime)}</td>
      <td>{calculatedOrderTemplateItemsCount}</td>
      <td>{orderTemplateStatusType_typeName}</td>
    </tr>
  )
}

const SubscriptionOrdersList = () => {
  const { t } = useTranslation()
  const { search, orderTemplates, totalPages } = useOrderTemplateList({ statusFilter: 'otstActive,otstCancelled' })
  return (
    <>
      <AccountContent />

      {/* <AccountToolBar term={keyword} updateTerm={setSearchTerm} search={search} /> */}

      <div className="table-responsive font-size-md">
        <table className="table table-striped table-bordered ">
          <thead>
            <tr>
              <th>{t('frontend.account.order.subscription.title')}</th>
              <th>{t('frontend.account.order.subscription.frequency')}</th>
              <th>{t('frontend.account.order.subscription.shipDate')}</th>
              <th>{t('frontend.account.order.subscription.noOfItems')}</th>
              <th>{t('frontend.account.order.subscription.status')}</th>
            </tr>
          </thead>
          <tbody>
            {orderTemplates
              .filter(orderTemplate => orderTemplate.orderTemplateStatusType_typeName === 'Active')
              .map((orderTemplate, index) => {
                return <SubscriptionOrdersListItem key={index} {...orderTemplate} />
              })}
          </tbody>
        </table>
      </div>
      <ListingPagination recordsCount={orderTemplates.data} currentPage={orderTemplates.currentPage} totalPages={totalPages} setPage={search} />
    </>
  )
}

const AccountSubscriptionOrders = ({ crumbs, title, records }) => {
  const { t } = useTranslation()

  return (
    <AccountLayout title={title || t('frontend.account.account_subscription_order')}>
      <SubscriptionOrdersList />
    </AccountLayout>
  )
}

export { AccountSubscriptionOrders }
