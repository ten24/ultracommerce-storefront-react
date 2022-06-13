import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SwRadioSelect } from '../..'
import { getSavedCreditCardMethods } from '../../../selectors/'
import { useTranslation } from 'react-i18next'
import { SwSelect, Button, OrderTemplatePaymentAddressSelector, TextInput } from '../..'
import { useCheckoutUtilities } from '../../../hooks'
import * as Yup from 'yup'
import dayjs from 'dayjs'

const OrderTemplateCreditCardDetails = ({ onSubmit, updatePaymentMethod, billingAddress, setBillingAddress }) => {
  const { t } = useTranslation()
  const { months, years } = useCheckoutUtilities()
  const [paymentMethodErrors, setPaymentMethodErrors] = useState({})
  const [saveShippingAsBilling, setSaveShippingAsBilling] = useState(false)
  const billingAccountAddress = useSelector(state => state.cart.billingAccountAddress)

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
    savePaymentMethodToAccount: true,
    returnJSONObjects: 'cart',
  })

  let validCreditCard = paymentMethod.nameOnCreditCard.length > 0 && paymentMethod.creditCardNumber.length > 0 && paymentMethod.securityCode.length > 0

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
                </div>
                <div className="col-12 mt-3">
                  {validCreditCard && (
                    <Button
                      label="Submit"
                      onClick={e => {
                        e.preventDefault()
                        updatePaymentMethod({ saveNew: paymentMethod })
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
              <OrderTemplatePaymentAddressSelector
                addressTitle={t('frontend.account.address.billingAddress')}
                selectedAccountID={billingAddress}
                onSelect={value => {
                  setBillingAddress(value)
                  updatePaymentMethod({ changeBillingAddress: value, paymentMethod: paymentMethod })
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

const EditPaymentMethod = ({ paymentMethod, setPaymentMethod, updatePaymentMethod, billingAddress, setBillingAddress }) => {
  const paymentMethods = useSelector(getSavedCreditCardMethods)
  const [newOrderPayment, setNewOrderPayment] = useState(false)
  const { t } = useTranslation()
  useEffect(() => {
    if (paymentMethods.length === 0) {
      // if there is no payment method found for the user , open new payment form
      setNewOrderPayment('new')
    }
  }, [paymentMethods])

  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-12">
          {newOrderPayment === 'new' ? (
            <label className="w-100 h6">{t('frontend.checkout.cardInfo')}</label>
          ) : (
            <SwRadioSelect
              label={t('frontend.checkout.cardInfo')}
              options={paymentMethods}
              onChange={value => {
                setPaymentMethod(value)
                if (value === 'new') {
                  setNewOrderPayment('new')
                } else {
                  setNewOrderPayment(false)
                  updatePaymentMethod({ paymentMethodId: value })
                }
              }}
              selectedValue={paymentMethod}
              displayNew={true}
            />
          )}

          {newOrderPayment !== 'new' && (
            <button
              className="btn btn-secondary mt-2"
              onClick={() => {
                setNewOrderPayment('new')
              }}
            >
              {t('frontend.checkout.payment.add')}
            </button>
          )}
        </div>
      </div>
      {newOrderPayment === 'new' && (
        <OrderTemplateCreditCardDetails
          onSubmit={() => {
            setNewOrderPayment(false)
          }}
          updatePaymentMethod={updatePaymentMethod}
          setNewOrderPayment={setNewOrderPayment}
          billingAddress={billingAddress}
          setBillingAddress={setBillingAddress}
        />
      )}
    </>
  )
}

export { EditPaymentMethod }
