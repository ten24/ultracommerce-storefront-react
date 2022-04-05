import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewAccountAndSetAsBilling, addPayment } from '../../../actions/'
import { orderPayment, fulfillmentSelector } from '../../../selectors'

const useTermPayment = ({ method }) => {
  const dispatch = useDispatch()
  const [accountAddressID, setAccountAddressID] = useState('')
  const { purchaseOrderNumber } = useSelector(orderPayment)
  const [termOrderNumber, setTermOrderNumber] = useState(purchaseOrderNumber)
  const { fulfillmentMethod } = useSelector(fulfillmentSelector)
  const { fulfillmentMethodType } = fulfillmentMethod
  const onPaymentAddressSelect = value => {
    dispatch(
      addPayment({
        accountAddressID: value,
        newOrderPayment: {
          purchaseOrderNumber: termOrderNumber,
          paymentMethod: {
            paymentMethodID: method,
          },
        },
      })
    )
    setAccountAddressID(value)
  }

  const onPaymentAddressSave = values => {
    if (values.saveAddress) {
      dispatch(addNewAccountAndSetAsBilling({ ...values }))
    } else {
      dispatch(
        addPayment({
          newOrderPayment: {
            billingAddress: {
              name: values.name,
              streetAddress: values.streetAddress,
              street2Address: values.street2Address,
              city: values.city,
              statecode: values.stateCode,
              postalcode: values.postalCode,
              countrycode: values.countryCode,
            },
            purchaseOrderNumber: termOrderNumber,
            paymentMethod: {
              paymentMethodID: method,
            },
          },
        })
      )
    }
  }

  const onSaveShippingAsBilling = e => {
    e.preventDefault()
    //TODO: BROKEN

    dispatch(
      addPayment({
        newOrderPayment: {
          saveShippingAsBilling: 1,
          purchaseOrderNumber: termOrderNumber,
          paymentMethod: {
            paymentMethodID: method,
          },
        },
      })
    )
  }
  return { onPaymentAddressSelect, onPaymentAddressSave, onSaveShippingAsBilling, fulfillmentMethodType, accountAddressID, setTermOrderNumber, termOrderNumber }
}
export { useTermPayment }
