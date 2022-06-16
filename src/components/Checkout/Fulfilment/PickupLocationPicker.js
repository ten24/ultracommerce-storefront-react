import { SwRadioSelect } from '../../'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useTranslation } from 'react-i18next'
import { usePickupLocation } from '../../../hooks'

const PickupLocationPicker = ({ fulfillment, onChangeDate, onChangeLocation, pickupLocations }) => {
  const { t } = useTranslation()
  const { isFutureDate } = usePickupLocation()
  const { estimatedShippingDate, pickupLocation } = fulfillment
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
        <div className="col-sm-12">{pickupLocations.length > 0 && <SwRadioSelect label={t('frontend.checkout.location_option')} options={pickupLocations} onChange={onChangeLocation} selectedValue={pickupLocation?.locationID} />}</div>
      </div>
    </>
  )
}

export { PickupLocationPicker }
