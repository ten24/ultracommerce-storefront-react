import { useSelector } from 'react-redux'
import { SwRadioSelect } from '../../'
import { fulfillmentSelector, pickupLocationSelector, pickupLocationOptions } from '../../../selectors/'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useTranslation } from 'react-i18next'
import { usePickupLocation } from '../../../hooks'

const PickupLocationPicker = () => {
  const { t } = useTranslation()
  const pickupLocations = useSelector(pickupLocationOptions)
  const selectedLocation = useSelector(pickupLocationSelector)
  const { estimatedShippingDate } = useSelector(fulfillmentSelector)
  const { isFutureDate, onChangeDate, onChangeLocation } = usePickupLocation()
  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-12">
          <div className="form-group">
            <label htmlFor="locationPickupDate">{t('frontend.checkout.fulfilment.pickup.date')}</label>
            <br />
            <DatePicker id="locationPickupDate" selected={estimatedShippingDate ? new Date(estimatedShippingDate) : ''} showTimeSelect timeIntervals={60} timeCaption="Time" dateFormat="MM/dd/yyyy h:mm aa" filterDate={isFutureDate} className="form-control" onChange={onChangeDate} />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-12">{pickupLocations.length > 0 && <SwRadioSelect label={t('frontend.checkout.location_option')} options={pickupLocations} onChange={onChangeLocation} selectedValue={selectedLocation.locationID} />}</div>
      </div>
    </>
  )
}

export { PickupLocationPicker }
