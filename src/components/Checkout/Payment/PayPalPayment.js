import { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import * as braintree from 'braintree-web'
import * as paypal from 'paypal-checkout'
import axios from 'axios'
import { sdkURL } from '../../../services'
import { addPayment } from '../../../actions'

const PayPalPayment = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    let source = axios.CancelToken.source()

    const createPayPalAccountPaymentMethod = async paymentToken => {
      return await axios({
        method: 'POST',
        withCredentials: true,
        url: `${sdkURL}api/scope/createPayPalAccountPaymentMethod`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: { paymentToken },
      }).then(response => {
        console.log('createPayPalAccountPaymentMethod response', response)
        if (response.status === 200) {
          return response.data
        }
        console.log('Error in creating paypal account payment method.')
        return null
      })
    }

    const startPaypal = async () => {
      const paypalConfig = await axios({
        method: 'GET',
        withCredentials: true,
        url: `${sdkURL}api/scope/getPayPalClientConfigForCart`,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response.status === 200) {
          return response.data.paypalClientConfig
        }
        return null
      })

      const braintreeClient = await braintree.client.create({ authorization: paypalConfig.clientAuthToken })
      const paypalClient = await braintree.paypalCheckout.create({ client: braintreeClient })

      const payment = (data, actions) => {
        console.log('payment paypalClient', paypalClient)
        console.log('payment paypalConfig', paypalConfig)
        return paypalClient.createPayment({
          flow: 'vault',
          billingAgreementDescription: '',
          enableShippingAddress: true,
          shippingAddressEditable: false,
          shippingAddressOverride: {
            line1: paypalConfig.shippingAddress.line1,
            line2: paypalConfig.shippingAddress.line2,
            city: paypalConfig.shippingAddress.city,
            state: paypalConfig.shippingAddress.state,
            postalCode: paypalConfig.shippingAddress.postalCode,
            countryCode: paypalConfig.shippingAddress.countryCode,
            recipientName: paypalConfig.shippingAddress.recipientName,
          },
          amount: paypalConfig.amount, // Required
          currency: paypalConfig.currencyCode, // Required
        })
      }
      const onAuthorize = (data, actions) => {
        console.log('onAuthorize data', data)
        return paypalClient.tokenizePayment(data).then(payload => {
          console.log('tokenizePayment payload', payload)
          if (payload.nonce) {
            return createPayPalAccountPaymentMethod(payload.nonce).then(ppMethod => {
              dispatch(
                addPayment({
                  accountPaymentMethodID: ppMethod.newPayPalPaymentMethod.accountPaymentMethodID,
                  copyFromType: 'accountPaymentMethod',
                  paymentIntegrationType: 'braintree',
                  paymentMethod: {
                    paymentMethodID: ppMethod.paymentMethodID,
                  },
                  returnJSONObjects: 'cart,account',
                })
              )
              return true
            })
          }
          return null
        })
        // send payload.nonce to server
      }
      let buttonConfig = {
        env: paypalConfig.paymentMode,
        // Enable Pay Now checkout flow (optional)
        payment,
        onAuthorize,
      }
      buttonConfig[paypalConfig.paymentMode] = await paypalClient.getClientId()
      paypal.Button.render(buttonConfig, '#paypal-button-container')
    }
    startPaypal()
    return () => {
      source.cancel()
    }
  }, [dispatch])

  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-6">
          <div className="form-group">
            <div id="paypal-button-container" />
          </div>
        </div>
      </div>
    </>
  )
}
export { PayPalPayment }
