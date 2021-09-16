import { useTranslation } from 'react-i18next'
const PickupLocationDetails = ({ pickupLocation }) => {
  const { t } = useTranslation()
  return (
    <>
      <h6 className="h6">{t('frontend.checkout.fulfilment.pickup.location')}:</h6>
      <p>{pickupLocation.locationName}</p>
    </>
  )
}

export { PickupLocationDetails }
