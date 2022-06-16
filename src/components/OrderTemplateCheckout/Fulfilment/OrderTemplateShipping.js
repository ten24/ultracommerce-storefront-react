import { useDispatch, useSelector } from 'react-redux'
import { SlideNavigation, Overlay } from '../..'
import { requestSubscriptionCart, receiveSubscriptionCart, receiveUser } from '../../../actions'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../../utils'
import { axios, sdkURL, SlatwalApiService } from '../../../services'
import { FulfilmentAddressSelector } from '../../Checkout/Fulfilment/FulfilmentAddressSelector'
import { getAllAccountAddresses } from '../../../selectors'
import { ShippingMethodRates } from '../../Checkout/Fulfilment/Shipping/ShippingMethodRates'

const OrderTemplateShippingSlide = ({ currentStep }) => {
  const dispatch = useDispatch()
  const { orderTemplateID, shippingMethod, shippingAccountAddress, isFetching } = useSelector(state => state.subscriptionCart)
  const accountAddresses = useSelector(getAllAccountAddresses)

  const [shipping, setShipping] = useState()
  const [shippingMethodOpt, setShippingMethodOpt] = useState()
  const [shippingMethodOptions, setShippingMethodOptions] = useState([])
  const hasShippingAddress = shipping !== '' && shippingMethodOpt !== '' ? true : false

  useEffect(() => {
    if (!orderTemplateID || orderTemplateID.length === 0) return null
    axios({
      method: 'GET',
      withCredentials: true,
      url: `${sdkURL}api/scope/getSiteOrderTemplateShippingMethodOptions?orderTemplateID=` + orderTemplateID,
      data: {},
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.status === 200) {
        if (!!response.data?.siteOrderTemplateShippingMethodOptions && response.data.siteOrderTemplateShippingMethodOptions?.length > 0) {
          setShippingMethodOptions(response.data.siteOrderTemplateShippingMethodOptions.map(({ name, value }) => ({ name: name, value: value })))
        }
      }
    })
    // eslint-disable-next-line
  }, [orderTemplateID])
  useEffect(() => {
    setShipping(shippingAccountAddress.accountAddressID)
    setShippingMethodOpt(shippingMethod.shippingMethodID)
  }, [shippingAccountAddress.accountAddressID, shippingMethod.shippingMethodID])

  const updateShipping = values => {
    dispatch(requestSubscriptionCart())

    return SlatwalApiService.orderTemplate.updateOrderTemplateShipping(values).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) dispatch(receiveSubscriptionCart(response.success().orderTemplateCart))
    })
  }
  const foundAddress = accountAddresses.filter(accountAddress => shipping === accountAddress.accountAddressID)?.at(0)

  return (
    <>
      <Overlay active={isFetching} spinner>
        <div className="row">
          <div className="bg-lightgray rounded mb-5 col p-3">
            <FulfilmentAddressSelector
              fulfillment={{
                accountAddress: {
                  accountAddressID: shipping,
                },
                shippingAddress: { ...foundAddress, addressID: '', ...foundAddress?.address },
              }}
              onSelect={value => {
                return new Promise((resolve, reject) => {
                  setShipping(value)
                  return resolve(value)
                }).then(value => {
                  if (shippingMethodOpt.length > 0)
                    updateShipping({
                      orderTemplateID: orderTemplateID,
                      shippingAccountAddress: {
                        value: value,
                      },
                      shippingMethodID: shippingMethodOpt,
                      returnJsonObjects: 'orderTemplateCart',
                    })
                })
              }}
              onSave={values => {
                return SlatwalApiService.account
                  .addAddress({ ...values, returnJSONObjects: 'account' })
                  .then(response => {
                    if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                    if (response.isSuccess()) {
                      dispatch(receiveUser(response.success().account))
                      return response.success().newAccountAddress.accountAddressID
                    } else {
                      dispatch(receiveUser({}))
                    }
                  })
                  .then(newAccountAddressID => {
                    if (newAccountAddressID?.length > 0) {
                      setShipping(newAccountAddressID)

                      if (shippingMethodOpt.length > 0) {
                        updateShipping({
                          orderTemplateID: orderTemplateID,
                          shippingAccountAddress: {
                            value: newAccountAddressID,
                          },
                          shippingMethodID: shippingMethodOpt,
                          returnJsonObjects: 'orderTemplateCart',
                        })
                      }
                    }
                  })
              }}
            />
            {orderTemplateID.length > 0 && (
              <ShippingMethodRates
                fulfillment={{
                  shippingMethod,
                  shippingMethodOptions,
                  shippingAddress: {
                    addressID: shipping,
                  },
                }}
                onSelection={shippingMethodID => {
                  setShippingMethodOpt(shippingMethodID)
                  if (shipping?.length > 0)
                    updateShipping({
                      orderTemplateID: orderTemplateID,
                      shippingAccountAddress: {
                        value: shipping,
                      },
                      shippingMethodID,
                      returnJsonObjects: 'orderTemplateCart',
                    })
                }}
              />
            )}
          </div>
        </div>
      </Overlay>
      <SlideNavigation currentStep={currentStep} nextActive={hasShippingAddress} />
    </>
  )
}

export { OrderTemplateShippingSlide }
