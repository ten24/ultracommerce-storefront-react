import { useDispatch, useSelector } from 'react-redux'
import { getPaymentIntegrations, getSiteConfig } from '../../../selectors'
import { receiveCart } from '../../../actions/'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { axios, sdkURL } from '../../../services'
import { useState } from 'react'
import { Overlay } from '../..'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const PayPalCommercePayment = ({ method, cartState }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { currencyCode } = useSelector(getSiteConfig)
  const { firstName, lastName } = useSelector(state => state.userReducer)
  const integrations = useSelector(getPaymentIntegrations)
  const paypalIntegration = integrations.filter(integration => integration.key === 'paypalCommerce')
  const [isLoading, setLoading] = useState(false)
  if (!paypalIntegration.length) return null

  var options = {
    'client-id': paypalIntegration?.at(0)?.settings?.clientID,
    intent: 'authorize',
    currency: currencyCode,
    'merchant-id': paypalIntegration?.at(0)?.settings?.partnerID,
    'data-partner-attribution-id': paypalIntegration?.at(0)?.settings?.bnCode,
  }

  var orderItems = []
  for (let orderItem of cartState.orderItems) {
    var itemDetails = {
      name: orderItem.sku.product.productName,
      quantity: orderItem.quantity,
      unit_amount: {
        currency_code: currencyCode,
        value: orderItem.price,
      },
      sku: orderItem.sku.skuCode,
    }
    orderItems.push(itemDetails)
  }

  return (
    <>
      <Overlay active={isLoading} spinner>
        <PayPalScriptProvider options={options}>
          <PayPalButtons
            style={{ color: 'silver', layout: 'horizontal', height: 48, shape: 'pill', width: 30 }}
            createOrder={(data, actions) => {
              var orderPayload = {
                intent: 'AUTHORIZE',
                purchase_units: [
                  {
                    amount: {
                      currency_code: currencyCode,
                      value: cartState.total,
                      breakdown: {
                        item_total: {
                          currency_code: currencyCode,
                          value: cartState.subtotal,
                        },
                        tax_total: {
                          currency_code: currencyCode,
                          value: cartState.taxTotal,
                        },
                        discount: {
                          currency_code: currencyCode,
                          value: cartState.discountTotal,
                        },
                        shipping: {
                          currency_code: currencyCode,
                          value: cartState.fulfillmentTotal,
                        },
                      },
                    },
                    payee: {
                      merchant_id: paypalIntegration?.at(0)?.settings?.partnerID,
                    },
                    items: orderItems,
                    shipping_detail: {},
                  },
                ],
              }

              if (cartState.orderFulfillments?.at(0)?.fulfillmentMethod?.fulfillmentMethodType === 'pickup') {
                orderPayload.purchase_units[0].shipping_detail['type'] = 'PICKUP_IN_PERSON'
                orderPayload.purchase_units[0].shipping_detail['name'] = {
                  full_name: firstName + ' ' + lastName,
                }
              } else {
                var shippingAddress = cartState.orderFulfillments?.at(0)?.shippingAddress
                orderPayload.purchase_units[0].shipping_detail['type'] = 'SHIPPING'
                orderPayload.purchase_units[0].shipping_detail['name'] = {
                  full_name: shippingAddress.name,
                }
                orderPayload.purchase_units[0].shipping_detail['address'] = {
                  address_line_1: shippingAddress.streetAddress,
                  address_line_2: shippingAddress.street2Address,
                  postal_code: shippingAddress.postalCode,
                  country_code: shippingAddress.countrycode,
                  admin_area_1: shippingAddress.stateCode,
                  admin_area_2: shippingAddress.city,
                }
              }

              return actions.order
                .create(orderPayload)
                .then(orderID => {
                  return orderID
                })
                .catch(e => {
                  toast.error('Error Occured while creating an Order on PayPal. Please Contact Admin.')
                  console.error(e)
                })
            }}
            onApprove={(data, actions) => {
              setLoading(true)
              actions.order.authorize().then(function (authorization) {
                // Get the authorization id
                var authorizationID = authorization.purchase_units?.at(0).payments.authorizations?.at(0).id

                return axios(`${sdkURL}api/scope/initiatePayment`, {
                  method: 'post',
                  withCredentials: true,
                  headers: {
                    'content-type': 'application/json',
                  },
                  data: {
                    paypalOrder: data.orderID,
                    paypalAuthorization: authorizationID,
                    returnJSONObjects: 'cart',
                  },
                })
                  .then(response => {
                    if (response?.status === 200) {
                      setLoading(false)
                      dispatch(receiveCart(response.data.cart))
                    } else {
                      setLoading(false)
                      toast.error(t('frontend.account.forgot.failure'))
                    }
                    return response
                  })
                  .catch(err => {
                    setLoading(false)
                    toast.error(t('frontend.account.forgot.failure'))
                  })
              })
            }}
            onCancel={() => {
              // On Cancelling the PayPal Popup, it redirects to the payment methods listing page.
            }}
          />
        </PayPalScriptProvider>
      </Overlay>
    </>
  )
}
export { PayPalCommercePayment }
