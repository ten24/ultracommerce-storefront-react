import { useTranslation } from 'react-i18next'
import { PickupLocationPicker } from '../..'

const PickupFulfillment = ({ fulfillment, onChangeDate, onChangeLocation, pickupLocations }) => {
  const { t } = useTranslation()
  return (
    <div className="shippingFulfillment">
      <h2>{t('frontend.checkout.fulfillments.pickup')}</h2>
      <hr />
      <div>
        <PickupLocationPicker fulfillment={fulfillment} onChangeDate={onChangeDate} onChangeLocation={onChangeLocation} pickupLocations={pickupLocations} />
      </div>
    </div>
  )
}
export { PickupFulfillment }
