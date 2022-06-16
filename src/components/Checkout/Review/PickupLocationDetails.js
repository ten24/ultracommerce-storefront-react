import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
const PickupLocationDetails = ({ pickupLocation, displayOnly = false }) => {
  const { t } = useTranslation()
  return (
    <>
      <h6 className="h6">{t('frontend.checkout.fulfilment.pickup.location')}:</h6>
      <p>{pickupLocation.locationName}</p>
      {!displayOnly && (
        <Link to="/checkout/shipping" className="text-link link mb-4 d-block">
          {t('frontend.core.edit')}
        </Link>
      )}
    </>
  )
}

export { PickupLocationDetails }
