import { useDispatch, useSelector } from 'react-redux'
import { getEligibleFulfillmentMethods, getPickupLocations, changeOrderFulfillment, addShippingAddressUsingAccountAddress, addNewAddressAndAttachAsShipping, addShippingAddress, addShippingMethod } from '../../../actions'
import { SlideNavigation, Overlay } from '../../'
import { useEffect } from 'react'
import { getAllOrderItems, getAllOrderFulfillments, isAllowedToSwitchFulfillmentMethod, getAllEligibleFulfillmentMethods, fulfillmentMethodSelector, pickupLocationOptions } from '../../../selectors/'
import { Navigate } from 'react-router-dom'
import { FulfillmentList } from './FulfillmentList'
import { usePickupLocation } from '../../../hooks'

const ShippingSlide = ({ currentStep }) => {
  const dispatch = useDispatch()
  const { orderRequirementsList } = useSelector(state => state.cart)
  const allOrderFulfillments = useSelector(getAllOrderFulfillments)
  const { isFetching } = useSelector(state => state.cart)
  let orderFulfillments = useSelector(getAllOrderFulfillments)
  let orderItems = useSelector(getAllOrderItems)
  const canSwitchFulfillmentMethod = useSelector(isAllowedToSwitchFulfillmentMethod)
  let eligibleFulfillmentMethods = useSelector(getAllEligibleFulfillmentMethods)
  let selectedFulfillmentMethod = useSelector(fulfillmentMethodSelector)
  const { onChangeDate, onChangeLocation } = usePickupLocation()
  useEffect(() => {
    dispatch(getEligibleFulfillmentMethods())
    dispatch(getPickupLocations())
  }, [dispatch])
  const pickupLocations = useSelector(pickupLocationOptions)
  if (allOrderFulfillments?.length === 1 && allOrderFulfillments?.at(0)?.fulfillmentMethod?.fulfillmentMethodType === 'auto') {
    return <Navigate to={`../${currentStep.next}`} />
  }
  return (
    <>
      <Overlay active={isFetching} spinner>
        <FulfillmentList
          orderFulfillments={orderFulfillments}
          orderItems={orderItems}
          canSwitchFulfillmentMethod={canSwitchFulfillmentMethod}
          selectedFulfillmentMethod={selectedFulfillmentMethod}
          eligibleFulfillmentMethods={eligibleFulfillmentMethods}
          pickupLocations={pickupLocations}
          onChangeOrderFullfillment={(fulfillmentMethodID, orderItemIDList) => {
            dispatch(changeOrderFulfillment({ fulfillmentMethodID, orderItemIDList }))
          }}
          onShipmentSelect={(value, orderFulfillmentID) => {
            return dispatch(
              addShippingAddressUsingAccountAddress({
                accountAddressID: value,
                fulfillmentID: orderFulfillmentID,
              })
            )
          }}
          onShipmentSave={(values, orderFulfillmentID) => {
            if (values.saveAddress) {
              return dispatch(addNewAddressAndAttachAsShipping({ ...values }))
            } else {
              return dispatch(addShippingAddress({ ...values, fulfillmentID: orderFulfillmentID, returnJSONObjects: 'cart' }))
            }
          }}
          onSelectShippingMethod={(value, orderFulfillmentID) => {
            dispatch(
              addShippingMethod({
                shippingMethodID: value,
                fulfillmentID: orderFulfillmentID,
              })
            )
          }}
          onChangeDate={onChangeDate}
          onChangeLocation={onChangeLocation}
        />
      </Overlay>
      <SlideNavigation currentStep={currentStep} nextActive={!orderRequirementsList.includes('fulfillment')} />
    </>
  )
}

export { ShippingSlide }
