import { useDispatch, useSelector } from 'react-redux'
import { useCheckoutUtilities } from '../../../hooks/'
import { SwSelect, AccountAddressForm, AccountLayout, AccountContent, Button, ThreeDSRedirect, TextInput } from '../../'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { SwRadioSelect } from '../../SwRadioSelect/SwRadioSelect'
import * as Yup from 'yup'
import { SlatwalApiService } from '../../../services'
import { getErrorMessage } from '../../../utils'
import { toast } from 'react-toastify'
import { receiveUser } from '../../../actions'
import { useHistory } from 'react-router'
import dayjs from 'dayjs'

const initialBillingAddress = {
  countryCode: 'US',
  name: '',
  company: '',
  phoneNumber: '',
  emailAddress: '',
  streetAddress: '',
  street2Address: '',
  city: '',
  stateCode: '',
  postalCode: '',
}
const CreateOrEditAccountPaymentMethod = () => {
  const accountAddresses = useSelector(state => state.userReducer.accountAddresses)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  let [redirectUrl, setRedirectUrl] = useState()
  let [redirectPayload, setRedirectPayload] = useState({})
  let [redirectMethod, setRedirectMethod] = useState('')
  let [isFetching, setFetching] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslation()
  const { months, years } = useCheckoutUtilities()
  const [billingAddress, setBillingAddress] = useState(initialBillingAddress)
  const [billingAccountAddressID, setBillingAccountAddressID] = useState('')
  const [paymentMethod, setPaymentMethod] = useState({
    accountPaymentMethodName: '',
    paymentMethodType: 'creditCard',
    creditCardNumber: '',
    nameOnCreditCard: '',
    expirationMonth: dayjs().add(1, 'month').format('MM'),
    expirationYear: dayjs().add(1, 'month').format('YYYY'),
    securityCode: '',
  })
  const [paymentMethodErrors, setPaymentMethodErrors] = useState({})
  const saveCardToAccount = () => {
    const payload = { ...paymentMethod, transactionInitiator: 'ACCOUNT', billingAccountAddress: { accountAddressID: '' }, billingAddress: {}, returnJSONObjects: 'account' }
    if (billingAccountAddressID.length) payload.billingAccountAddress.accountAddressID = billingAccountAddressID
    if (!billingAccountAddressID.length) payload.billingAddress = billingAddress
    SlatwalApiService.account.addPaymentMethod(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        if (response.success()?.redirectUrl?.length) {
          setRedirectUrl(response.success().redirectUrl)
          setRedirectPayload(response.success().redirectPayload)
          setRedirectMethod(response.success().redirectMethod)
        } else {
          toast.success(t('frontend.account.card.success'))
          setTimeout(() => {
            dispatch(receiveUser(response.success().account))
            history.push('/my-account/cards')
          }, 2000)
        }
      }
      setFetching(false)
    })
  }

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
    <AccountLayout>
      <AccountContent />
      <form className="mt-5">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="paymentMethodType">{t('frontend.account.payment_method.heading')}</label>
              <SwSelect
                id="paymentMethodType"
                value={paymentMethod.paymentMethodType}
                onChange={e => {
                  setPaymentMethod({
                    ...paymentMethod,
                    paymentMethodType: e.target.value,
                  })
                }}
                options={[
                  {
                    key: 'Credit Card',
                    value: 'creditCard',
                  },
                ]}
              />
            </div>
          </div>
          <div className="col-md-12">
            <h5 className="my-2">{t('frontend.account.payment_method.cc_details')}</h5>
          </div>
          <div className="row">
            <div className="col-md-6">
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
          </div>
          <div className="row">
            <div className="col-md-6">
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
            <div className="col-md-6">
              <TextInput
                name={paymentMethod.creditCardNumber}
                label={t('frontend.account.payment_method.ccn')}
                value={paymentMethod.creditCardNumber}
                isError={!!paymentMethodErrors?.creditCardNumber}
                errorMessage={paymentMethodErrors?.creditCardNumber?.message}
                onChange={value => {
                  if ((/^-?\d+$/.test(value) && value.length <= 19) || value === '') {
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
          </div>
          <div className="row">
            <div className="col-md-3">
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
            <div className="col-md-3">
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
            <div className="col-md-6">
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
          </div>
          <div className="col-md-12">
            <hr className="my-4" />
          </div>

          {paymentMethod.creditCardNumber.length > 0 && (
            <div className="row">
              <div className="col-sm-12">
                <div className="col-md-6 pl-0">
                  <div className="form-group">
                    <label htmlFor="accountAddressID">{t('frontend.account.billing_address')}</label>
                    <SwRadioSelect
                      onChange={value => {
                        setBillingAccountAddressID(value)
                        setBillingAddress(initialBillingAddress)
                        setShowNewAddressForm(false)
                      }}
                      options={accountAddresses.map(({ accountAddressName, accountAddressID, address: { streetAddress } }) => {
                        return { name: `${accountAddressName} - ${streetAddress}`, value: accountAddressID }
                      })}
                      selectedValue={billingAccountAddressID}
                    />
                    {!showNewAddressForm && (
                      <button
                        className="btn btn-secondary mt-2"
                        onClick={e => {
                          setBillingAccountAddressID('')
                          setBillingAddress(initialBillingAddress)
                          setShowNewAddressForm(true)
                        }}
                      >
                        {t('frontend.account.address.add')}
                      </button>
                    )}
                  </div>
                </div>
                {showNewAddressForm && <AccountAddressForm billingAddress={billingAddress} setBillingAddress={setBillingAddress} />}
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <hr className="mt-4 mb-4" />
          <div className="d-flex flex-wrap justify-content-end">
            <Button
              disabled={isFetching}
              isLoading={isFetching}
              label={t('frontend.account.payment.saveNew')}
              classList="btn btn-primary mt-3 mt-sm-0"
              onClick={() => {
                setFetching(true)
                saveCardToAccount()
              }}
            />
          </div>
        </div>
      </form>
    </AccountLayout>
  )
}

export { CreateOrEditAccountPaymentMethod }
