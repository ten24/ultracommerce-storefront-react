import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewAccountAndSetAsBilling } from '../../../actions/'
import { fulfillmentSelector } from '../../../selectors'
import { SlatwalApiService } from '../../../services'
import { receiveCart, receiveUser } from '../../../actions'
import { getErrorMessage } from '../../../utils'
import { toast } from 'react-toastify'

const useGiftCardPayment = ({ method }) => {
  const dispatch = useDispatch()
  const [accountAddressID, setAccountAddressID] = useState('')
  const [giftCardNumber, setGiftCardNumber] = useState('')
  const { fulfillmentMethod } = useSelector(fulfillmentSelector)
  const { fulfillmentMethodType } = fulfillmentMethod
  const { giftCards } = useSelector(state => state.userReducer)

  const onPaymentAddressSelect = async value => {
    await addGiftCardService({
      newOrderPayment: {
        giftCardNumber: giftCardNumber,
        paymentMethod: {
          paymentMethodID: method,
        },
      },
    })
    setAccountAddressID(value)
  }

  const onPaymentAddressSave = async values => {
    if (values.saveAddress) {
      dispatch(addNewAccountAndSetAsBilling({ ...values }))
    } else {
      await addGiftCardService({
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
          giftCardNumber: giftCardNumber,
          paymentMethod: {
            paymentMethodID: method,
          },
        },
      })
    }
  }

  const onSaveShippingAsBilling = e => {
    e.preventDefault()
    addGiftCardService({
      newOrderPayment: {
        saveShippingAsBilling: 1,
        giftCardNumber: giftCardNumber,
        paymentMethod: {
          paymentMethodID: method,
        },
      },
    })
  }

  const addGiftCardService = params => {
    return SlatwalApiService.cart
      .addGiftCardPayment({
        ...params,
        returnJSONObjects: 'cart,account',
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          dispatch(receiveCart(response.success().cart))
          dispatch(receiveUser(response.success().account))
        } else {
          dispatch(receiveCart({}))
          toast.error(getErrorMessage(response.success().errors))
        }
      })
  }
  return { onPaymentAddressSelect, onPaymentAddressSave, onSaveShippingAsBilling, fulfillmentMethodType, accountAddressID, setGiftCardNumber, giftCardNumber, giftCards }
}
export { useGiftCardPayment }
