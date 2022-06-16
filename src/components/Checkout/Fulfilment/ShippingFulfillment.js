import { useTranslation } from 'react-i18next'
import { FulfilmentAddressSelector } from './FulfilmentAddressSelector'
import { ShippingMethodRates } from '../../'

const ShippingFulfillment = ({ fulfillment, onShipmentSelect, onShipmentSave, onSelectShippingMethod }) => {
  const { orderFulfillmentID } = fulfillment
  
  const { t } = useTranslation()

  return (
    <div className="shippingFulfillment">
      <h2>{t('frontend.checkout.fulfillments.shipping')}</h2>
      <hr />
      <div>
        {/* <OrderFulfillmentItems fulfillment={fulfillment} /> */}
          <FulfilmentAddressSelector
            fulfillment={fulfillment}
            onSelect={(value)=>onShipmentSelect(value,orderFulfillmentID)}
            onSave={(values)=>onShipmentSave(values,orderFulfillmentID)}
          />
        {
          <ShippingMethodRates
            fulfillment={fulfillment}
            onSelection={(values)=>onSelectShippingMethod(values,orderFulfillmentID)}
          />
        }
      </div>
    </div>
  )
}
export { ShippingFulfillment }
