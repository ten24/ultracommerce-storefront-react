import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addNewAccountAndSetAsBillingOnOrderFulfillment, addPaymentToOrder } from '../../../actions/'

const useTermPayment = ({ method, fulfillment, isQuote = false, orderID }) => {
  const dispatch = useDispatch()
  const [accountAddressID, setAccountAddressID] = useState('')
  const [termOrderNumber, setTermOrderNumber] = useState('')
  const { fulfillmentMethodType } = fulfillment.fulfillmentMethod
  const onPaymentAddressSelect = value => {
    setAccountAddressID(value)
    let params = {
      accountAddressID: value,
      newOrderPayment: {
        purchaseOrderNumber: termOrderNumber,
        paymentMethod: {
          paymentMethodID: method,
        },
      },
    }
    if (isQuote) params['orderID'] = orderID
    return dispatch(addPaymentToOrder({ params, isQuote }))
  }

  const onPaymentAddressSave = values => {
    if (values.saveAddress) {
      let params = { ...values }
      if (isQuote) params['orderID'] = orderID
      return dispatch(addNewAccountAndSetAsBillingOnOrderFulfillment({ params, isQuote }))
    } else {
      let params = {
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
      }
      if (isQuote) params['orderID'] = orderID
      return dispatch(addPaymentToOrder({ params, isQuote }))
    }
  }

  const onSaveShippingAsBilling = e => {
    e.preventDefault()
    //TODO: BROKEN
    let params = {
      newOrderPayment: {
        saveShippingAsBilling: 1,
        purchaseOrderNumber: termOrderNumber,
        paymentMethod: {
          paymentMethodID: method,
        },
      },
    }
    if (isQuote) params['orderID'] = orderID
    return dispatch(addPaymentToOrder({ params, isQuote }))
  }
  return { onPaymentAddressSelect, onPaymentAddressSave, onSaveShippingAsBilling, fulfillmentMethodType, accountAddressID, setTermOrderNumber, termOrderNumber }
}
export { useTermPayment }
