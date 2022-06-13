import { useTranslation } from 'react-i18next'
import { OrderFulfillmentItems } from './OrderFulfillmentItems'

const AutoFulfillment = ({ fulfillment }) => {
  const { t } = useTranslation()
  return (
    <div>
      <h2>{t('frontend.checkout.fulfillments.auto')}</h2>
      <div>
        <OrderFulfillmentItems fulfillment={fulfillment} />
      </div>
    </div>
  )
}
export { AutoFulfillment }
