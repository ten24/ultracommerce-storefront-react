import { useDispatch, useSelector } from 'react-redux'
import { addPickupLocation, setPickupDate } from '../../../actions'
import { fulfillmentSelector } from '../../../selectors'
const isFutureDate = date => {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  return date >= currentDate
}
const usePickupLocation = () => {
  const dispatch = useDispatch()
  const { orderFulfillmentID } = useSelector(fulfillmentSelector)

  const onChangeDate = pickupDate => {
    dispatch(
      setPickupDate({
        pickupDate: pickupDate.toLocaleString().replace(',', ''),
        orderFulfillmentID,
      })
    )
  }
  const onChangeLocation = value => {
    dispatch(
      addPickupLocation({
        value,
      })
    )
  }
  return { isFutureDate, orderFulfillmentID, onChangeDate, onChangeLocation }
}

export { usePickupLocation }
