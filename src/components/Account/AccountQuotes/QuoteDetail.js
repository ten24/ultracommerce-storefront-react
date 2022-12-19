import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, FulfillmentList, OrderToolbar, SwRadioSelect, PaymentList, CreditCardPayment, TermPayment, PickupLocationDetails } from '../..'
import { SlatwalApiService } from '../../../services/SlatwalApiService'
import { getErrorMessage, getFailureMessageOnSuccess } from '../../../utils'
import { useCheckoutUtilities } from '../../../hooks/components/Checkout/useCheckoutUtilities'
import { clearCart, getEligibleOrderFulfillmentMethods, getAllPickupLocations, setPickupDateToOrderFulfillment, addPickupLocationToOrderFulfillment, clearOrderData, removeOrderItem, updateOrderItemQuantity, applyPromoCodeToOrder, removePromoCodeFromOrder, placeMyOrder, addPaymentToOrder, changeFulfillmentOnOrder, addShippingAddressUsingAccountAddressToOrderFulfillment, addNewAddressAndAttachAsShippingOnOrderFulfillment, addShippingMethodToOrderFulfillment, addShippingAddressToOrderFulfillment, removeOrderPayment } from '../../../actions'
import { AddressCard } from '../../Checkout/Fulfilment/AddressCard'
import { OrderItem } from '../AccountOrderDetail/OrderShipments'

import { useElementContext } from '../../../contexts/ElementContextProvider'

const QuoteDetail = ({ quoteDetail, updateQuote }) => {
  return (
    <div className="container my-5">
      {quoteDetail.orderStatusType.typeCode === 'qstDraft' && <QuoteDetailDraft quoteDetail={quoteDetail} updateQuote={updateQuote} />}
      {(quoteDetail.orderStatusType.typeCode === 'qstPendingReview' || quoteDetail.orderStatusType.typeCode === 'qstRejected' || quoteDetail.orderStatusType.typeCode === 'qstExpired') && <QuoteDetailViewOnly quoteDetail={quoteDetail} updateQuote={updateQuote} />}
      {quoteDetail.orderStatusType.typeCode === 'qstApproved' && <QuoteDetailReadyForPayment quoteDetail={quoteDetail} updateQuote={updateQuote} />}
    </div>
  )
}

const QuoteDetailDraft = ({ quoteDetail, updateQuote }) => {
  const { t } = useTranslation()
  const { CartLineItem } = useElementContext()
  const dispatch = useDispatch()
  const [eligibleFulfillmentMethods, setEligibleMethods] = useState({})
  const [pickupLocations, setPickupLocations] = useState([])
  let selectedFulfillmentMethod = { fulfillmentMethodID: '' }
  if (quoteDetail.orderFulfillments?.at(0) && quoteDetail.orderFulfillments?.at(0).fulfillmentMethod) {
    selectedFulfillmentMethod = quoteDetail.orderFulfillments?.at(0).fulfillmentMethod
  }
  useEffect(() => {
    dispatch(
      getEligibleOrderFulfillmentMethods({
        params: {
          orderID: quoteDetail.orderID,
        },
        returnQuote: false,
        isQuote: true,
      })
    ).then(response => {
      if (response.isSuccess()) {
        setEligibleMethods(response?.success()?.eligibleFulfillmentMethods)
      }
    })
    dispatch(getAllPickupLocations({ isQuote: true })).then(response => {
      if (response.isSuccess()) {
        setPickupLocations(
          response?.success()?.locations.map(location => {
            return { name: location['NAME'], value: location['VALUE'] }
          })
        )
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteDetail.orderID])
  return (
    <div className="container my-5">
      {quoteDetail && (
        <div className="row">
          <h5>{quoteDetail && quoteDetail.quoteName}</h5>
          <OrderToolbar
            delivered={{
              orderStatusType_typeName: quoteDetail.orderStatusType.typeName,
            }}
            orderPayments={{
              order_orderNumber: quoteDetail.quoteNumber,
            }}
          />
          <div className="col-lg-12 col-md-12">
            {quoteDetail.orderItems && (
              <>
                <div className="card mb-2">
                  <div className="card-header">
                    <div className="row">
                      <div className="col-sm-12 col-md-6">
                        <h4 className="mb-0">{t('frontend.cart.orderItem')}</h4>
                      </div>
                      <div className="col-sm-12 col-md-6 d-none d-md-block">
                        <div className="row">
                          <div className="col-sm-3">
                            <small>{t('frontend.product.price')}</small>
                          </div>
                          <div className="col-sm-4">
                            <small>{t('frontend.cart.quantity')}</small>
                          </div>
                          <div className="col-sm-4">
                            <small>{t('frontend.cart.total')}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body py-0">
                    {quoteDetail.orderItems &&
                      quoteDetail.orderItems.map(orderItem => {
                        return (
                          <CartLineItem
                            key={orderItem.orderItemID}
                            orderItem={orderItem}
                            onUpdateQty={itemCount => {
                              dispatch(
                                updateOrderItemQuantity({
                                  params: {
                                    orderItem: {
                                      orderItemID: orderItem.orderItemID,
                                      quantity: itemCount,
                                    },
                                    orderID: quoteDetail.orderID,
                                  },
                                  returnQuote: true,
                                  isQuote: true,
                                })
                              ).then(response => {
                                if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                                if (response.isSuccess()) {
                                  toast.success(t('frontend.account.quote.detail.quantityUpdate'))
                                  updateQuote(prevState => ({
                                    ...prevState,
                                    ...response.success().quote,
                                  }))
                                }
                              })
                            }}
                            onRemoveItem={() => {
                              dispatch(
                                removeOrderItem({
                                  params: {
                                    orderItemID: orderItem.orderItemID,
                                    orderID: quoteDetail.orderID,
                                  },
                                  returnQuote: true,
                                  isQuote: true,
                                })
                              ).then(response => {
                                if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                                if (response.isSuccess()) {
                                  toast.success(t('frontend.account.quote.detail.itemRemoved'))
                                  updateQuote(prevState => ({
                                    ...prevState,
                                    ...response.success().quote,
                                  }))
                                }
                              })
                            }}
                          />
                        )
                      })}
                  </div>
                </div>
                <div className="white-background mb-2">
                  <button
                    className="btn btn-link link-btn"
                    onClick={() => {
                      dispatch(
                        clearOrderData({
                          params: {
                            orderID: quoteDetail.orderID,
                          },
                          returnQuote: true,
                          isQuote: true,
                        })
                      ).then(response => {
                        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                        if (response.isSuccess()) {
                          toast.success(t('frontend.account.quote.deletedMessage'))
                          dispatch(clearCart())
                        }
                      })
                    }}
                  >
                    {t('frontend.account.quote.clearQuote')}
                  </button>
                </div>
              </>
            )}
          </div>

          <QuoteSidebar quoteDetail={quoteDetail} updateQuote={updateQuote} />
          <div className="col-lg-12 col-md-12">
            <FulfillmentList
              orderFulfillments={quoteDetail.orderFulfillments}
              orderItems={quoteDetail.orderItems}
              canSwitchFulfillmentMethod={true}
              eligibleFulfillmentMethods={eligibleFulfillmentMethods}
              pickupLocations={pickupLocations}
              selectedFulfillmentMethod={selectedFulfillmentMethod}
              onChangeOrderFullfillment={(fulfillmentMethodID, orderItemIDList) => {
                return dispatch(
                  changeFulfillmentOnOrder({
                    params: {
                      orderID: quoteDetail.orderID,
                      fulfillmentMethodID,
                      orderItemIDList,
                    },
                    returnQuote: true,
                    isQuote: true,
                  })
                ).then(response => {
                  if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                  if (response.isSuccess()) {
                    updateQuote(prevState => ({
                      ...prevState,
                      ...response.success().quote,
                    }))
                  }
                })
              }}
              onShipmentSelect={(value, orderFulfillmentID) => {
                return dispatch(
                  addShippingAddressUsingAccountAddressToOrderFulfillment({
                    params: {
                      orderID: quoteDetail.orderID,
                      fulfillmentMethodID: orderFulfillmentID,
                      accountAddressID: value,
                    },
                    returnQuote: true,
                    isQuote: true,
                  })
                ).then(response => {
                  if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                  if (response.isSuccess()) {
                    updateQuote(prevState => ({
                      ...prevState,
                      ...response.success().quote,
                    }))
                  }
                })
              }}
              onShipmentSave={(values, orderFulfillmentID) => {
                if (values.saveAddress) {
                  return dispatch(
                    addNewAddressAndAttachAsShippingOnOrderFulfillment({
                      params: {
                        orderID: quoteDetail.orderID,
                        fulfillmentID: orderFulfillmentID,
                        accountAddressName: values?.accountAddressName,
                        city: values?.city,
                        countryCode: values?.countryCode,
                        emailAddress: values?.emailAddress,
                        locality: values?.locality,
                        name: values?.name,
                        phoneNumber: values?.phoneNumber,
                        postalCode: values?.postalCode,
                        saveAddress: values?.saveAddress,
                        stateCode: values?.stateCode,
                        street2Address: values?.street2Address,
                        streetAddress: values?.streetAddress,
                      },
                      returnQuote: true,
                      isQuote: true,
                    })
                  ).then(response => {
                    if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                    if (response.isSuccess()) {
                      updateQuote(prevState => ({
                        ...prevState,
                        ...response.success().quote,
                      }))
                    }
                  })
                } else {
                  return dispatch(
                    addShippingAddressToOrderFulfillment({
                      params: {
                        orderID: quoteDetail.orderID,
                        fulfillmentID: orderFulfillmentID,
                        accountAddressName: values?.accountAddressName,
                        city: values?.city,
                        countryCode: values?.countryCode,
                        emailAddress: values?.emailAddress,
                        locality: values?.locality,
                        name: values?.name,
                        phoneNumber: values?.phoneNumber,
                        postalCode: values?.postalCode,
                        saveAddress: values?.saveAddress,
                        stateCode: values?.stateCode,
                        street2Address: values?.street2Address,
                        streetAddress: values?.streetAddress,
                      },
                      returnQuote: true,
                      isQuote: true,
                    })
                  ).then(response => {
                    if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                    if (response.isSuccess()) {
                      updateQuote(prevState => ({
                        ...prevState,
                        ...response.success().quote,
                      }))
                    }
                  })
                }
              }}
              onSelectShippingMethod={(value, orderFulfillmentID) => {
                dispatch(
                  addShippingMethodToOrderFulfillment({
                    params: {
                      orderID: quoteDetail.orderID,
                      fulfillmentID: orderFulfillmentID,
                      shippingMethodID: value,
                    },
                    returnQuote: true,
                    isQuote: true,
                  })
                ).then(response => {
                  if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                  if (response.isSuccess()) {
                    updateQuote(prevState => ({
                      ...prevState,
                      ...response.success().quote,
                    }))
                  }
                })
              }}
              onChangeDate={pickupDate => {
                dispatch(setPickupDateToOrderFulfillment({ params: { orderID: quoteDetail.orderID, pickupDate }, returnQuote: true, isQuote: true })).then(response => {
                  if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                  if (response.isSuccess()) {
                    updateQuote(prevState => ({
                      ...prevState,
                      ...response.success().quote,
                    }))
                  }
                })
              }}
              onChangeLocation={value => {
                dispatch(addPickupLocationToOrderFulfillment({ params: { orderID: quoteDetail.orderID, value }, returnQuote: true, isQuote: true })).then(response => {
                  if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                  if (response.isSuccess()) {
                    updateQuote(prevState => ({
                      ...prevState,
                      ...response.success().quote,
                    }))
                  }
                })
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const QuoteDetailReadyForPayment = ({ quoteDetail, updateQuote }) => {
  const dispatch = useDispatch()
  const { TERM_PAYMENT_CODE, CREDIT_CARD_CODE, CASH_PAYMENT_CODE, getPaymentMethodByIDFromList } = useCheckoutUtilities()
  const eligiblePaymentMethodDetails = quoteDetail.eligiblePaymentMethodDetails
    .filter(({ paymentMethod }) => paymentMethod.paymentMethodType === CASH_PAYMENT_CODE || paymentMethod.paymentMethodType === CREDIT_CARD_CODE || paymentMethod.paymentMethodType === TERM_PAYMENT_CODE)
    .map(({ paymentMethod }) => {
      return { ...paymentMethod, name: paymentMethod.paymentMethodName, value: paymentMethod.paymentMethodID, type: paymentMethod.paymentMethodType }
    })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [paymentMethodOnOrder, setPaymentMethodOnOrder] = useState(false)
  const { t } = useTranslation()

  quoteDetail.orderPayments = quoteDetail.orderPayments.filter(op => op.orderPaymentStatusType.systemCode !== 'opstInvalid')
  useEffect(() => {
    const paymentMethod = quoteDetail?.orderPayments?.at(0)
    if (paymentMethod && paymentMethod.paymentMethodID && paymentMethodOnOrder !== paymentMethod.paymentMethodID) {
      setPaymentMethodOnOrder(paymentMethod)
      setSelectedPaymentMethod(paymentMethod)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteDetail.orderID])
  if (!quoteDetail) return null

  return (
    <QuoteDetailViewOnly quoteDetail={quoteDetail} updateQuote={updateQuote}>
      <div className="card ">
        <div className="bg-lightgray rounded p-4 col">
          <PaymentList
            payments={quoteDetail.orderPayments}
            onRemovePayment={paymentSelection => {
              dispatch(removeOrderPayment({ params: { ...paymentSelection, orderID: quoteDetail.orderID }, isQuote: true })).then(response => {
                if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                if (response.isSuccess()) updateQuote(response.success().quote)
              })
            }}
            resetSelection={() => {
              setPaymentMethodOnOrder('')
              setSelectedPaymentMethod('')
            }}
          />
          {quoteDetail.orderPayments.length === 0 && (
            <>
              <div className="row mb-3">
                <div className="col-sm-12">
                  {eligiblePaymentMethodDetails.length === 0 && (
                    <div className="alert alert-warning" role="alert">
                      {t('frontend.checkout.noPaymentEnabled')}
                    </div>
                  )}
                  {eligiblePaymentMethodDetails.length > 0 && (
                    <SwRadioSelect
                      label={t('frontend.checkout.payment.select')}
                      options={eligiblePaymentMethodDetails}
                      onChange={paymentMethodID => {
                        const foundPaymentMethod = getPaymentMethodByIDFromList(eligiblePaymentMethodDetails, paymentMethodID)
                        setSelectedPaymentMethod(foundPaymentMethod)
                        if (foundPaymentMethod.paymentMethodType === CASH_PAYMENT_CODE) {
                          dispatch(
                            addPaymentToOrder({
                              params: {
                                newOrderPayment: {
                                  paymentMethod: {
                                    paymentMethodID,
                                  },
                                },
                                orderID: quoteDetail.orderID,
                              },
                              returnQuote: true,
                              isQuote: true,
                            })
                          ).then(response => {
                            if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                            if (response.isSuccess()) updateQuote(response.success().quote)
                          })
                        }
                      }}
                      selectedValue={selectedPaymentMethod?.paymentMethodID?.length ? selectedPaymentMethod.paymentMethodID : paymentMethodOnOrder}
                    />
                  )}
                </div>
              </div>
              {selectedPaymentMethod.paymentMethodType === CREDIT_CARD_CODE && <CreditCardPayment method={selectedPaymentMethod.paymentMethodID} fulfillment={quoteDetail.orderFulfillments.at(0)} isQuote={true} orderID={quoteDetail.orderID} updateQuote={updateQuote} />}
              {selectedPaymentMethod.paymentMethodType === TERM_PAYMENT_CODE && <TermPayment method={selectedPaymentMethod.paymentMethodID} fulfillment={quoteDetail.orderFulfillments.at(0)} isQuote={true} orderID={quoteDetail.orderID} updateQuote={updateQuote} />}
            </>
          )}
        </div>
      </div>
    </QuoteDetailViewOnly>
  )
}

const QuoteDetailViewOnly = ({ quoteDetail, children, updateQuote }) => {
  const { t } = useTranslation()

  return (
    <div className="container my-5">
      {quoteDetail && (
        <div className="row">
          <h5>{quoteDetail && quoteDetail.quoteName}</h5>
          <OrderToolbar
            delivered={{
              orderStatusType_typeName: quoteDetail.orderStatusType.typeName,
            }}
            orderPayments={{
              order_orderNumber: quoteDetail.quoteNumber,
            }}
          />
          <div className="col-lg-12 col-md-12">
            <div className="card mb-2">
              <div className="card-header">
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <h4 className="mb-0">{t('frontend.cart.orderItem')}</h4>
                  </div>
                  <div className="col-sm-12 col-md-6 d-none d-md-block">
                    <div className="row">
                      <div className="col-sm-3">
                        <small>{t('frontend.product.price')}</small>
                      </div>
                      <div className="col-sm-4">
                        <small>{t('frontend.cart.quantity')}</small>
                      </div>
                      <div className="col-sm-4">
                        <small>{t('frontend.cart.total')}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body py-0">
                {quoteDetail?.orderItems
                  ?.map(orderItem => {
                    orderItem['sku_product_productName'] = orderItem.sku?.product?.productName
                    orderItem['sku_skuID'] = orderItem.sku?.skuID
                    orderItem['sku_product_urlTitle'] = orderItem.sku?.product?.urlTitle
                    orderItem['images'] = orderItem.sku?.images
                    orderItem['BrandName'] = orderItem.sku?.product?.brand?.brandName
                    orderItem['calculatedExtendedPriceAfterDiscount'] = orderItem.extendedPriceAfterDiscount
                    orderItem['sku_product_productID'] = orderItem.sku?.product?.productID
                    return orderItem
                  })
                  ?.map(orderItem => {
                    return <OrderItem key={orderItem.orderItemID} {...orderItem} showActions={false} />
                  })}
              </div>
            </div>
          </div>
          <div className="mb-2 col-lg-12 col-md-12">
            <QuoteFulfillmentsViewOnly quoteDetail={quoteDetail} />
            {children}
          </div>
          <QuoteSidebar quoteDetail={quoteDetail} updateQuote={updateQuote} />
        </div>
      )}
    </div>
  )
}

const QuoteFulfillmentsViewOnly = ({ quoteDetail }) => {
  const { SHIPPING_CODE, PICKUP_CODE } = useCheckoutUtilities()

  return (
    <>
      {quoteDetail.orderFulfillments?.map(fulfillment => {
        return (
          <div className="card " key={fulfillment.orderFulfillmentID}>
            <div className="bg-lightgray rounded p-4 col">
              <h5>{fulfillment.fulfillmentMethod.fulfillmentMethodName}</h5>
              {fulfillment.fulfillmentMethod.fulfillmentMethodType === SHIPPING_CODE && (
                <AddressCard address={fulfillment.shippingAddress} viewOnly={true}>
                  <hr />
                  {fulfillment.shippingMethodOptions
                    .filter(option => option.value === fulfillment?.shippingMethod?.shippingMethodID)
                    .map(option => {
                      return (
                        <p className="mb-0" key={option.value}>
                          {option.name}
                        </p>
                      )
                    })}
                </AddressCard>
              )}
              {fulfillment.fulfillmentMethod.fulfillmentMethodType === PICKUP_CODE && <PickupLocationDetails pickupLocation={fulfillment.pickupLocation} displayOnly={true} />}
            </div>
          </div>
        )
      })}
    </>
  )
}

const QuoteSidebar = ({ quoteDetail, updateQuote }) => {
  const { t } = useTranslation()
  const { OrderSummary, CartPromoBox } = useElementContext()
  const dispatch = useDispatch()
  return (
    <div className="col-lg-12 col-md-12">
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <OrderSummary
            cart={quoteDetail}
            onRemovePromoCode={(event, promoCode) => {
              dispatch(removePromoCodeFromOrder({ params: { orderID: quoteDetail.orderID, promotionCode: promoCode }, returnQuote: true, isQuote: true })).then(response => {
                if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                if (response.isSuccess()) {
                  toast.success(t('frontend.account.quote.promoCodeRemoved'))
                  updateQuote(prevState => ({
                    ...prevState,
                    ...response.success().quote,
                  }))
                }
              })
            }}
          />
        </div>

        {quoteDetail.orderStatusType.typeCode === 'qstDraft' && <QuoteSubmitForApprovalForm quoteDetail={quoteDetail} updateQuote={updateQuote} />}
        {quoteDetail.orderStatusType.typeCode === 'qstDraft' && (
          <div className="col-sm-12 col-md-6">
            <CartPromoBox
              onApplyCode={(promoCode, setPromoCode) => {
                if (!promoCode) return null
                dispatch(applyPromoCodeToOrder({ params: { orderID: quoteDetail.orderID, promotionCode: promoCode }, returnQuote: true, isQuote: true })).then(response => {
                  if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                  if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length === 0) toast.success(t('frontend.account.quote.promoCodeApplied'))
                  if (response.isSuccess()) {
                    setPromoCode('')
                    updateQuote(prevState => ({
                      ...prevState,
                      ...response.success().quote,
                    }))
                  }
                })
              }}
            />
          </div>
        )}
        <div className="col-sm-12 col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h4 className="mb-0">{t('frontend.account.quote.orderNotes')}</h4>
            </div>
            <div className="card-body">
              <span>{quoteDetail.orderNotes ? quoteDetail.orderNotes : t('frontend.account.quote.noNotes')}</span>
            </div>
          </div>
        </div>
        <QuoteActions quoteDetail={quoteDetail} />
      </div>
    </div>
  )
}

const QuoteActions = ({ quoteDetail }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
    <>
      {quoteDetail.orderStatusType.typeCode === 'qstApproved' && (
        <div className="ps-2 pe-2">
          <div className="d-flex">
            <button
              className="btn btn-primary w-100 mt-2 "
              onClick={e => {
                e.preventDefault()
                dispatch(
                  placeMyOrder({
                    params: {
                      orderID: quoteDetail.orderID,
                    },
                    returnQuote: true,
                    isQuote: true,
                  })
                ).then(response => {
                  if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                  getFailureMessageOnSuccess(response, getErrorMessage(response.success().messages))
                  if (response.isSuccess() && response.success()?.successfulActions.length > 0) {
                    toast.success(t('frontend.order.placed'))
                    setTimeout(() => {
                      navigate('/my-account/quotes')
                    }, 2000)
                  }
                })
              }}
            >
              {t('frontend.account.quote.checkout')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

const QuoteSubmitForApprovalForm = ({ quoteDetail, updateQuote }) => {
  const [disabled, setDisabled] = useState(false)
  const [quoteRequestDetails, setQuoteRequestDetails] = useState('')
  const { t } = useTranslation()
  const submitQuoteForApproval = async orderID => {
    setDisabled(true)
    SlatwalApiService.quotes
      .submitQuoteForApproval({
        orderID,
        reason: quoteRequestDetails,
        returnQuote: true,
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          toast.success(t('frontend.account.quote.approval.successMessage'))
          setTimeout(() => {
            updateQuote(prevState => ({
              ...prevState,
              ...response.success().quote,
            }))
            setDisabled(false)
          }, 2000)
        }
      })
  }

  return (
    <div className="col-md-6">
      <div className="row">
        <div className="col-sm-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4 className="mb-0">{t('frontend.account.quote.submitForApproval')}</h4>
            </div>
            <div className="card-body">
              <form name="add-quote-for-approval">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="quoteRequestDetails">
                        {t('frontend.account.quote.quoteRequestDetailsLabel')} <sup className="text-danger">*</sup>
                      </label>
                      <textarea
                        className="form-control"
                        id="quoteRequestDetails"
                        value={quoteRequestDetails}
                        onChange={e => {
                          setQuoteRequestDetails(e.target.value)
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
                <Button
                  isLoading={disabled}
                  disabled={disabled}
                  type="button"
                  classList="btn btn-primary btn-block mt-4 d-block m-auto"
                  onClick={() => {
                    if (!quoteRequestDetails) {
                      toast.error(t('frontend.account.quote.requiredMessage'))
                      return null
                    } else {
                      submitQuoteForApproval(quoteDetail.orderID)
                    }
                  }}
                >
                  <span className="d-sm-inline">{t('frontend.account.quote.submitForApproval')}</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { QuoteDetail }
