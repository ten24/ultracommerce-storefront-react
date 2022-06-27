import { useDispatch, useSelector } from 'react-redux'
import { getPaymentIntegrations, getSiteConfig } from '../../../selectors'
import { receiveCart } from '../../../actions/'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { axios, sdkURL } from '../../../services'

const PayPalCommercePayment = ({ method, cartState }) => {
  const dispatch = useDispatch()
  const { currencyCode } = useSelector(getSiteConfig)
  const integrations = useSelector(getPaymentIntegrations)
  const paypalIntegration = integrations.filter(integration => integration.key === 'paypalCommerce')
  if (!paypalIntegration.length) return null
  var shippingAddress = cartState.orderFulfillments?.at(0)?.shippingAddress

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
    <PayPalScriptProvider options={{ 'client-id': paypalIntegration?.at(0)?.settings?.clientID, intent: 'authorize' }}>
      <PayPalButtons
        style={{ color: 'silver', layout: 'horizontal', height: 48, shape: 'pill', width: 30 }}
        createOrder={(data, actions) => {
          return actions.order
            .create({
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
                  items: orderItems,
                  shipping_detail: {
                    name: {
                      full_name: shippingAddress.name,
                      type: 'SHIPPING',
                      address: {
                        address_line_1: shippingAddress.streetAddress,
                        address_line_2: shippingAddress.street2Address,
                        postal_code: shippingAddress.postalCode,
                        country_code: shippingAddress.countrycode,
                        admin_area_1: shippingAddress.stateCode,
                        admin_area_2: shippingAddress.city,
                      },
                    },
                  },
                },
              ],
            })
            .then(orderID => {
              return orderID
            })
            .catch(e => {
              console.error(e.error)
            })
        }}
        onApprove={(data, actions) => {
          actions.order.authorize().then(function (authorization) {
            // Get the authorization id
            var authorizationID = authorization.purchase_units[0].payments.authorizations[0].id

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
            }).then(response => {
              if (response.status === 200) {
                dispatch(receiveCart(response.data.cart))
              }
              return response
            })
          })
        }}
      />
    </PayPalScriptProvider>
  )
}
export { PayPalCommercePayment }
