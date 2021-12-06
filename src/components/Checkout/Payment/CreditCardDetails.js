import { useDispatch, useSelector } from 'react-redux'
import { SwSelect, Button, PaymentAddressSelector, TextInput, ThreeDSRedirect } from '../..'
import { useTranslation } from 'react-i18next'
import { requestCart, receiveCart, receiveUser } from '../../../actions/'
import { SlatwalApiService } from '../../../services'
import { toast } from 'react-toastify'
import { fulfillmentSelector } from '../../../selectors'
import { getErrorMessage } from '../../../utils'
import { useCheckoutUtilities } from '../../../hooks'
import * as Yup from 'yup'
import { useState } from 'react'
import dayjs from 'dayjs'

const CreditCardDetails = ({ onSubmit }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { fulfillmentMethod } = useSelector(fulfillmentSelector)
  const { months, years, CREDIT_CARD } = useCheckoutUtilities()
  const [paymentMethodErrors, setPaymentMethodErrors] = useState({})
  const [savePaymentMethodToAccount, setSavePaymentMethodToAccount] = useState(false)
  const [saveShippingAsBilling, setSaveShippingAsBilling] = useState(false)
  const billingAccountAddress = useSelector(state => state.cart.billingAccountAddress)
  let [redirectUrl, setRedirectUrl] = useState()
  let [redirectPayload, setRedirectPayload] = useState({})
  let [redirectMethod, setRedirectMethod] = useState('')

  const [paymentMethod, setPaymentMethod] = useState({
    accountPaymentMethodName: '',
    paymentMethodType: 'creditCard',
    creditCardNumber: '',
    nameOnCreditCard: '',
    expirationMonth: dayjs().add(1, 'month').format('MM'),
    expirationYear: dayjs().add(1, 'month').format('YYYY'),
    securityCode: '',
    accountAddressID: billingAccountAddress ? billingAccountAddress.accountAddressID : '',
    saveShippingAsBilling: false,
    savePaymentMethodToAccount: false,
    returnJSONObjects: 'cart',
  })

  let validCreditCard = paymentMethod.nameOnCreditCard.length > 0 && paymentMethod.creditCardNumber.length > 0 && paymentMethod.securityCode.length > 0

  const addPayment = (params = {}) => {
    dispatch(requestCart())
    SlatwalApiService.cart
      .addPayment({
        ...params,
        transactionInitiator: 'CHECKOUT_PAYMENT',
        returnJSONObjects: 'cart,account',
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          if (response.success()?.redirectUrl?.length) {
            setRedirectUrl(response.success().redirectUrl)
            setRedirectPayload(response.success().redirectPayload)
            setRedirectMethod(response.success().redirectMethod)
          } else {
            dispatch(receiveCart(response.success().cart))
            dispatch(receiveUser(response.success().account))
          }
        } else {
          dispatch(receiveCart({}))
          toast.error('An Error Occured')
        }
      })
  }
  //http://cluson:8906/index.cfm/api/scope/pay360threeDSHandover?MD=10145770911&reload=true

  const requiredValidation = ({ value, name, msg }) => {
    Yup.string()
      .required(msg)
      .validate(value, { abortEarly: false })
      .then(() => {
        let newErrors = { ...paymentMethodErrors }
        delete newErrors[name]
        setPaymentMethodErrors(newErrors)
      })
      .catch(err => {
        setPaymentMethodErrors(
          err.inner.reduce((acc, { message }) => {
            return {
              ...acc,
              [name]: { path: name, message },
            }
          }, paymentMethodErrors)
        )
      })
  }
  if (redirectUrl) return <ThreeDSRedirect url={redirectUrl} payload={redirectPayload} method={redirectMethod} />

  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-12">
          <div className="row">
            <div className="col-sm-6">
              <TextInput
                name={paymentMethod.accountPaymentMethodName}
                label={t('frontend.account.payment_method.nickname')}
                value={paymentMethod.accountPaymentMethodName}
                isError={!!paymentMethodErrors?.accountPaymentMethodName}
                errorMessage={paymentMethodErrors?.accountPaymentMethodName?.message}
                onChange={value => {
                  setPaymentMethod({
                    ...paymentMethod,
                    accountPaymentMethodName: value,
                  })
                }}
                onBlur={value => requiredValidation({ value, name: 'accountPaymentMethodName', msg: t('frontend.account.payment_method.required') })}
              />
            </div>

            <div className="col-sm-6">
              <TextInput
                name={paymentMethod.nameOnCreditCard}
                label={t('frontend.account.payment_method.name')}
                value={paymentMethod.nameOnCreditCard}
                isError={!!paymentMethodErrors?.nameOnCreditCard}
                errorMessage={paymentMethodErrors?.nameOnCreditCard?.message}
                onChange={value => {
                  setPaymentMethod({
                    ...paymentMethod,
                    nameOnCreditCard: value,
                  })
                }}
                onBlur={value => requiredValidation({ value, name: 'nameOnCreditCard', msg: t('frontend.account.payment_method.name_required') })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-5">
              <TextInput
                name={paymentMethod.creditCardNumber}
                label={t('frontend.account.payment_method.ccn')}
                value={paymentMethod.creditCardNumber}
                isError={!!paymentMethodErrors?.creditCardNumber}
                errorMessage={paymentMethodErrors?.creditCardNumber?.message}
                onChange={value => {
                  if ((/^-?\d+$/.test(value) && value.length < 19) || value === '') {
                    setPaymentMethod({
                      ...paymentMethod,
                      creditCardNumber: value,
                    })
                  }
                }}
                onBlur={value => {
                  Yup.string()
                    .min(13)
                    .max(19)
                    .validate(value, { abortEarly: false })
                    .then(() => {
                      let newErrors = { ...paymentMethodErrors }
                      delete newErrors.creditCardNumber
                      setPaymentMethodErrors(newErrors)
                    })
                    .catch(err => {
                      setPaymentMethodErrors(
                        err.inner.reduce((acc, { message }) => {
                          return {
                            ...acc,
                            creditCardNumber: { path: 'creditCardNumber', message },
                          }
                        }, paymentMethodErrors)
                      )
                    })
                }}
              />
            </div>
            <div className="col-sm-2">
              <TextInput
                name={paymentMethod.securityCode}
                label={t('frontend.account.payment_method.cvv')}
                value={paymentMethod.securityCode}
                isError={!!paymentMethodErrors?.securityCode}
                errorMessage={paymentMethodErrors?.securityCode?.message}
                onChange={value => {
                  if ((/^-?\d+$/.test(value) && value.length < 5) || value === '') {
                    setPaymentMethod({
                      ...paymentMethod,
                      securityCode: value,
                    })
                  }
                }}
                onBlur={value => {
                  Yup.string()
                    .min(3)
                    .max(4)
                    .validate(value, { abortEarly: false })
                    .then(() => {
                      let newErrors = { ...paymentMethodErrors }
                      delete newErrors.securityCode
                      setPaymentMethodErrors(newErrors)
                    })
                    .catch(err => {
                      setPaymentMethodErrors(
                        err.inner.reduce((acc, { message }) => {
                          return {
                            ...acc,
                            securityCode: { path: 'securityCode', message },
                          }
                        }, paymentMethodErrors)
                      )
                    })
                }}
              />
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label htmlFor="expirationMonth">{t('frontend.account.payment_method.expiration_month')}</label>
                <SwSelect
                  id="expirationMonth"
                  value={paymentMethod.expirationMonth}
                  onChange={e => {
                    setPaymentMethod({
                      ...paymentMethod,
                      expirationMonth: e.target.value,
                    })
                  }}
                  options={months}
                />
              </div>
            </div>
            <div className="col-sm-2">
              <div className="form-group">
                <label htmlFor="expirationYear">{t('frontend.account.payment_method.expiration_year')}</label>
                <SwSelect
                  id="expirationYear"
                  value={paymentMethod.expirationYear}
                  onChange={e => {
                    setPaymentMethod({
                      ...paymentMethod,
                      expirationYear: e.target.value,
                    })
                  }}
                  options={years}
                />
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-6">
                  {fulfillmentMethod.fulfillmentMethodType === 'shipping' && (
                    <div className="custom-control custom-checkbox">
                      <input
                        className="custom-control-input"
                        type="checkbox"
                        id="saveShippingAsBilling"
                        checked={saveShippingAsBilling}
                        onChange={e => {
                          setSaveShippingAsBilling(!saveShippingAsBilling)
                        }}
                      />
                      <label className="custom-control-label ms-1" htmlFor="saveShippingAsBilling">
                        {t('frontend.checkout.shipping_address_clone')}
                      </label>
                    </div>
                  )}

                  <div className="custom-control custom-checkbox savePaymentMethodCheckbox">
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      id="savePaymentMethodToAccount"
                      checked={savePaymentMethodToAccount}
                      onChange={e => {
                        setSavePaymentMethodToAccount(!savePaymentMethodToAccount)
                      }}
                    />
                    <label className="custom-control-label ms-1" htmlFor="savePaymentMethodToAccount">
                      {t('frontend.checkout.payment.save_to_account')}
                    </label>
                  </div>
                </div>
                <div className="col-12 mt-3">
                  {saveShippingAsBilling && validCreditCard && (
                    <Button
                      label="Submit"
                      onClick={e => {
                        e.preventDefault()
                        //TODO: BROKEN
                        if (savePaymentMethodToAccount && saveShippingAsBilling) {
                          // Create account Payment and use cloned shpiing address
                          // Payment with Account  CC
                          addPayment({
                            newOrderPayment: {
                              saveShippingAsBilling: 1,
                              nameOnCreditCard: paymentMethod.nameOnCreditCard,
                              creditCardNumber: paymentMethod.creditCardNumber,
                              expirationMonth: paymentMethod.expirationMonth,
                              expirationYear: paymentMethod.expirationYear,
                              securityCode: paymentMethod.securityCode,
                              paymentMethod: {
                                paymentMethodID: CREDIT_CARD,
                              },
                            },
                            saveAccountPaymentMethodFlag: savePaymentMethodToAccount,
                          })
                        } else {
                          // Payment with Single use CC and address cloned from billing
                          addPayment({
                            newOrderPayment: {
                              saveShippingAsBilling: 1,
                              nameOnCreditCard: paymentMethod.nameOnCreditCard,
                              creditCardNumber: paymentMethod.creditCardNumber,
                              expirationMonth: paymentMethod.expirationMonth,
                              expirationYear: paymentMethod.expirationYear,
                              securityCode: paymentMethod.securityCode,
                              paymentMethod: {
                                paymentMethodID: CREDIT_CARD,
                              },
                            },
                          })
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {validCreditCard && !saveShippingAsBilling && (
        <div className="row mb-3">
          <div className="col-sm-12">
            {!saveShippingAsBilling && (
              <PaymentAddressSelector
                addressTitle={'Billing Address'}
                selectedAccountID={paymentMethod.accountAddressID}
                onSelect={value => {
                  // NOTE: Works
                  addPayment({
                    newOrderPayment: {
                      accountAddressID: value,
                      nameOnCreditCard: paymentMethod.nameOnCreditCard,
                      creditCardNumber: paymentMethod.creditCardNumber,
                      expirationMonth: paymentMethod.expirationMonth,
                      expirationYear: paymentMethod.expirationYear,
                      securityCode: paymentMethod.securityCode,
                      paymentMethod: {
                        paymentMethodID: CREDIT_CARD,
                      },
                    },
                    accountAddressID: value,
                    saveAccountPaymentMethodFlag: savePaymentMethodToAccount,
                  })
                }}
                onSave={values => {
                  if (savePaymentMethodToAccount && values.saveAddress) {
                    // Create account address
                    // Create account Payment
                    // Payment with new Account Address and new Account Payment Method

                    const payload = {
                      name: values.name,
                      streetAddress: values.streetAddress,
                      street2Address: values.street2Address,
                      city: values.city,
                      statecode: values.stateCode,
                      postalcode: values.postalCode,
                      countrycode: values.countryCode,
                      returnJSONObjects: 'account',
                    }

                    SlatwalApiService.cart.addEditAccountAndSetAsBillingAddress(payload).then(response => {
                      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                      if (response.isSuccess()) {
                        addPayment({
                          newOrderPayment: {
                            nameOnCreditCard: paymentMethod.nameOnCreditCard,
                            creditCardNumber: paymentMethod.creditCardNumber,
                            expirationMonth: paymentMethod.expirationMonth,
                            expirationYear: paymentMethod.expirationYear,
                            securityCode: paymentMethod.securityCode,
                            paymentMethod: {
                              paymentMethodID: CREDIT_CARD,
                            },
                          },
                          saveAccountPaymentMethodFlag: savePaymentMethodToAccount,
                        })
                      }
                    })
                  } else if (values.saveAddress) {
                    // Create account address
                    // Payment with new Account Address and Single use CC
                    const payload = {
                      name: values.name,
                      streetAddress: values.streetAddress,
                      street2Address: values.street2Address,
                      city: values.city,
                      statecode: values.stateCode,
                      postalcode: values.postalCode,
                      countrycode: values.countryCode,
                      returnJSONObjects: 'account',
                    }

                    SlatwalApiService.cart.addEditAccountAndSetAsBillingAddress(payload).then(response => {
                      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                      if (response.isSuccess()) {
                        addPayment({
                          newOrderPayment: {
                            nameOnCreditCard: paymentMethod.nameOnCreditCard,
                            creditCardNumber: paymentMethod.creditCardNumber,
                            expirationMonth: paymentMethod.expirationMonth,
                            expirationYear: paymentMethod.expirationYear,
                            securityCode: paymentMethod.securityCode,
                            paymentMethod: {
                              paymentMethodID: CREDIT_CARD,
                            },
                          },
                        })
                      }
                    })
                  } else {
                    // and payment with new single use CC and Single use address
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
                        nameOnCreditCard: paymentMethod.nameOnCreditCard,
                        creditCardNumber: paymentMethod.creditCardNumber,
                        expirationMonth: paymentMethod.expirationMonth,
                        expirationYear: paymentMethod.expirationYear,
                        securityCode: paymentMethod.securityCode,
                        paymentMethod: {
                          paymentMethodID: CREDIT_CARD,
                        },
                      },
                    })
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export { CreditCardDetails }
