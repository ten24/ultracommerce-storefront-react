import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import * as braintree from 'braintree-web'
import * as paypal from 'paypal-checkout'
import axios from 'axios'
import { SwRadioSelect } from '../../../components'
import { sdkURL } from '../../../services'
import { addPayment } from '../../../actions'
import { getSavedPaypalMethods, orderPayment } from '../../../selectors'
import { useTranslation } from 'react-i18next'

const PayPalPayment = () => {
  const dispatch = useDispatch()
  const paymentMethods = useSelector(getSavedPaypalMethods)
  const { t } = useTranslation()
  const { accountPaymentMethod = { accountPaymentMethodID: '' } } = useSelector(orderPayment)

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
        if (response.status === 200) {
          return response.data
        }
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
        return paypalClient.tokenizePayment(data).then(payload => {
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
      <hr />
      {paymentMethods?.length > 0 && (
        <div className="row mb-3">
          <div className="col-sm-6">
            <div className="form-group">
              <SwRadioSelect
                label={t('frontend.checkout.PaypalOptions')}
                options={paymentMethods}
                onChange={value => {
                  dispatch(
                    addPayment({
                      accountPaymentMethodID: value,
                      newOrderPayment: {
                        requireBillingAddress: 0,
                      },
                    })
                  )
                }}
                selectedValue={accountPaymentMethod.accountPaymentMethodID}
                displayNew={false}
              />
            </div>
          </div>
        </div>
      )}
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
