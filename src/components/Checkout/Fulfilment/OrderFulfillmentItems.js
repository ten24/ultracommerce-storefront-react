import { useTranslation } from 'react-i18next'

const OrderFulfillmentItems = ({ fulfillment }) => {
  const { t } = useTranslation()
  return (
    <div className="row orderFulfillmentItems ">
      <h5 className="h5 pt-1 pb-2 mb-3 border-bottom">{t('Products In fulfillment')}</h5>
      <div className="pb-3">
        {fulfillment.orderFulfillmentItems.map(orderFulfillmentItem => {
          return (
            <span key={orderFulfillmentItem.sku.product.productName}>
              {orderFulfillmentItem.sku.product.productName}
              <br />
            </span>
          )
        })}
      </div>
    </div>
  )
}
export { OrderFulfillmentItems }
