import { useTranslation } from 'react-i18next'
import { useCheckoutUtilities } from '../../../hooks'
import { ShippingFulfillment } from './ShippingFulfillment'
import { PickupFulfillment } from './PickupFulfillment'
import { AutoFulfillment } from './AutoFulfillment'
import { useState } from 'react'
import { FulfillmentPicker } from './FulfillmentPicker'

const FulfillmentList = ({ orderFulfillments, orderItems, canSwitchFulfillmentMethod = false, eligibleFulfillmentMethods, pickupLocations, selectedFulfillmentMethod, onChangeOrderFullfillment, onShipmentSelect, onShipmentSave, onSelectShippingMethod, onChangeDate, onChangeLocation }) => {
  const { SHIPPING_CODE, PICKUP_CODE, AUTO_CODE } = useCheckoutUtilities()
  const [changeOrderFulfillment, setChangeOrderFulfillment] = useState(false)
  const { t } = useTranslation()
  if (orderFulfillments.length === 0) {
    return null
  }
  return (
    <>
      {!changeOrderFulfillment &&
        orderFulfillments.map(fulfillment => {
          return (
            <div className="row " key={fulfillment.orderFulfillmentID}>
              <div className="bg-lightgray rounded mb-5 col p-3">
                {fulfillment.fulfillmentMethod.fulfillmentMethodType === SHIPPING_CODE && <ShippingFulfillment fulfillment={fulfillment} orderItems={orderItems} allowSwith={canSwitchFulfillmentMethod} onShipmentSelect={onShipmentSelect} onShipmentSave={onShipmentSave} onSelectShippingMethod={onSelectShippingMethod} />}
                {fulfillment.fulfillmentMethod.fulfillmentMethodType === PICKUP_CODE && <PickupFulfillment fulfillment={fulfillment} orderItems={orderItems} allowSwith={canSwitchFulfillmentMethod} onChangeDate={onChangeDate} onChangeLocation={onChangeLocation} pickupLocations={pickupLocations} />}
                {fulfillment.fulfillmentMethod.fulfillmentMethodType === AUTO_CODE && <AutoFulfillment fulfillment={fulfillment} orderItems={orderItems} allowSwith={canSwitchFulfillmentMethod} />}
                <hr />
                {canSwitchFulfillmentMethod && (
                  <button className="btn btn-link p-0 text-danger" type="button" onClick={() => setChangeOrderFulfillment(true)}>
                    {t('frontend.core.changeSelection')}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      {changeOrderFulfillment && (
        <div className="row ">
          <FulfillmentPicker
            onSelect={() => {
              setChangeOrderFulfillment(false)
            }}
            orderItems={orderItems}
            eligibleFulfillmentMethods={eligibleFulfillmentMethods}
            onChangeOrderFullfillment={(fulfillmentMethodID,orderItemIDList)=>{
              onChangeOrderFullfillment(fulfillmentMethodID,orderItemIDList)
            }}
            selectedFulfillmentMethod={selectedFulfillmentMethod}
          />
          <div className="col-sm-6">
            <button className="btn btn-secondary mx-2" type="button" onClick={() => setChangeOrderFulfillment(false)}>
              {t('frontend.core.cancel')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
export { FulfillmentList }
