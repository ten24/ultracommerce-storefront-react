import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStateCodeOptionsByCountryCode, getCountries } from '../../../actions/'
import { SwRadioSelect, SwSelect, TextInput } from '../..'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { useDeepCompareEffect } from 'react-use'
import { getDefaultCountry } from '../../../selectors'
const initialBillingAddress = {
  countryCode: null,
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
const BillingAddress = ({ onSave, onCancel }) => {
  const dispatch = useDispatch()
  const countryCode = useSelector(getDefaultCountry)

  const countryCodeOptions = useSelector(state => state.content.countryCodeOptions)
  const stateCodeOptions = useSelector(state => state.content.stateCodeOptions)
  const { t } = useTranslation()
  const [billingAddressErrors, setBillingAddressErrors] = useState({})
  const [saveAddress, setSaveAddress] = useState(false)
  const [billingAddress, setBillingAddress] = useState({ ...initialBillingAddress, countryCode })

  useDeepCompareEffect(() => {
    if (countryCodeOptions.length < 1) {
      dispatch(getCountries())
    }
  }, [dispatch, countryCodeOptions])
  useEffect(() => {
    dispatch(getStateCodeOptionsByCountryCode(billingAddress.countryCode))
  }, [dispatch, billingAddress?.countryCode])

  const requiredValidation = ({ value, name, msg }) => {
    Yup.string()
      .required(msg)
      .validate(value, { abortEarly: false })
      .then(() => {
        let newErrors = { ...billingAddressErrors }
        delete newErrors[name]
        setBillingAddressErrors(newErrors)
      })
      .catch(err => {
        setBillingAddressErrors(
          err.inner.reduce((acc, { message }) => {
            return {
              ...acc,
              [name]: { path: name, message },
            }
          }, billingAddressErrors)
        )
      })
  }

  return (
    <>
      <form>
        <div className="row mt-3">
          <div className="col-sm-6">
            <TextInput
              name={billingAddress.name}
              label={t('frontend.account.name')}
              value={billingAddress.name}
              isError={!!billingAddressErrors?.name}
              errorMessage={billingAddressErrors?.name?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  name: value,
                })
              }}
              onBlur={value => requiredValidation({ value, name: 'name', msg: t('frontend.core.required') })}
            />
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="countryCode">{t('frontend.account.countryCode')}</label>
              <SwSelect
                id="countryCode"
                value={billingAddress.countryCode}
                onChange={e => {
                  e.preventDefault()
                  const { value } = e.target
                  dispatch(getStateCodeOptionsByCountryCode(value))
                  setBillingAddress({
                    ...billingAddress,
                    countryCode: e.target.value,
                  })
                }}
                options={countryCodeOptions}
                onBlur={value => requiredValidation({ value, name: 'countryCode', msg: t('frontend.core.required') })}
              />
              {!!billingAddressErrors.countryCode && <span className="form-error-msg">{billingAddressErrors.countryCode}</span>}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <TextInput
              name={billingAddress.streetAddress}
              label={t('frontend.account.streetAddress')}
              value={billingAddress.streetAddress}
              isError={!!billingAddressErrors?.streetAddress}
              errorMessage={billingAddressErrors?.streetAddress?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  streetAddress: value,
                })
              }}
              onBlur={value => requiredValidation({ value, name: 'streetAddress', msg: t('frontend.core.required') })}
            />
          </div>
          <div className="col-sm-6">
            <TextInput
              name={billingAddress.street2Address}
              label={t('frontend.account.street2Address')}
              value={billingAddress.street2Address}
              isError={!!billingAddressErrors?.street2Address}
              errorMessage={billingAddressErrors?.street2Address?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  street2Address: value,
                })
              }}
              onBlur={value => requiredValidation({ value, name: 'street2Address', msg: t('frontend.core.required') })}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <TextInput
              name={billingAddress.city}
              label={t('frontend.account.city')}
              value={billingAddress.city}
              isError={!!billingAddressErrors?.city}
              errorMessage={billingAddressErrors?.city?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  city: value,
                })
              }}
              onBlur={value => requiredValidation({ value, name: 'city', msg: t('frontend.core.required') })}
            />
          </div>

          <div className="col-md-3">
            {stateCodeOptions[billingAddress.countryCode] && stateCodeOptions[billingAddress.countryCode].length > 0 && (
              <div className="form-group">
                <label htmlFor="stateCode">{t('frontend.account.stateCode')}</label>
                <SwSelect
                  id="stateCode"
                  value={billingAddress.stateCode}
                  onChange={e => {
                    setBillingAddress({
                      ...billingAddress,
                      stateCode: e.target.value,
                    })
                  }}
                  onBlur={value => requiredValidation({ value, name: 'stateCode', msg: t('frontend.core.required') })}
                  options={stateCodeOptions[billingAddress.countryCode]}
                />
                {!!billingAddressErrors.stateCode && <span className="form-error-msg">{billingAddressErrors.stateCode}</span>}
              </div>
            )}

            {(!stateCodeOptions[billingAddress.countryCode] || stateCodeOptions[billingAddress.countryCode].length < 1) && (
              <TextInput
                name={billingAddress.stateCode}
                label={t('frontend.account.stateCode')}
                value={billingAddress.stateCode}
                isError={!!billingAddressErrors?.stateCode}
                errorMessage={billingAddressErrors?.stateCode?.message}
                onChange={value => {
                  setBillingAddress({
                    ...billingAddress,
                    stateCode: value,
                  })
                }}
                onBlur={value => requiredValidation({ value, name: 'stateCode', msg: t('frontend.core.required') })}
              />
            )}
          </div>

          <div className="col-sm-3">
            <TextInput
              name={billingAddress.postalCode}
              label={t('frontend.account.postalCode')}
              value={billingAddress.postalCode}
              isError={!!billingAddressErrors?.postalCode}
              errorMessage={billingAddressErrors?.postalCode?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  postalCode: value,
                })
              }}
              onBlur={value => requiredValidation({ value, name: 'postalCode', msg: t('frontend.core.required') })}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <TextInput
              name={billingAddress.emailAddress}
              label={t('frontend.account.emailAddress')}
              value={billingAddress.emailAddress}
              isError={!!billingAddressErrors?.emailAddress}
              errorMessage={billingAddressErrors?.emailAddress?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  emailAddress: value,
                })
              }}
              onBlur={value => {
                return null
              }}
            />
          </div>
          <div className="col-sm-6">
            <TextInput
              name={billingAddress.phoneNumber}
              label={t('frontend.account.phoneNumber')}
              value={billingAddress.phoneNumber}
              isError={!!billingAddressErrors?.phoneNumber}
              errorMessage={billingAddressErrors?.phoneNumber?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  phoneNumber: value,
                })
              }}
              onBlur={value => requiredValidation({ value, name: 'phoneNumber', msg: t('frontend.core.required') })}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <div className="custom-control custom-checkbox mt-1">
                <input
                  className="custom-control-input"
                  type="checkbox"
                  id="saveAddress"
                  checked={saveAddress}
                  onChange={e => {
                    setSaveAddress(!saveAddress)
                  }}
                />
                <label className="custom-control-label ms-1" htmlFor="saveAddress">
                  {t('frontend.account.save_to')}
                </label>
              </div>
            </div>
            {/* only display nickname field if "save address" is checked */}
            {!!saveAddress && (
              <TextInput
                name={billingAddress.accountAddressName}
                label={t('frontend.account.nickname')}
                value={billingAddress.accountAddressName}
                isError={!!billingAddressErrors?.accountAddressName}
                errorMessage={billingAddressErrors?.accountAddressName?.message}
                onChange={value => {
                  setBillingAddress({
                    ...billingAddress,
                    accountAddressName: value,
                  })
                }}
                onBlur={value => {}}
              />
            )}
          </div>
          <div className="col-sm-6 d-flex justify-content-end align-items-start mt-2">
            <button
              className="btn btn-primary me-2"
              onClick={e => {
                e.preventDefault()
                onSave({ ...billingAddress, saveAddress })
              }}
            >
              <span className="d-inline">{t('frontend.core.save')}</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={e => {
                e.preventDefault()
                onCancel()
              }}
            >
              <span className="d-inline">{t('frontend.account.address.cancel')}</span>
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

const OrderTemplatePaymentAddressSelector = ({ onSelect, onSave, selectedAccountID, addressTitle = 'frontend.account.addresses', isShipping = true }) => {
  const accountAddresses = useSelector(state => state.userReducer.accountAddresses)
  const [showAddress, setShowAddress] = useState(false)
  const { t } = useTranslation()
  if (showAddress || accountAddresses.length === 0) {
    selectedAccountID = 'new'
  }

  useEffect(() => {
    if (accountAddresses.length === 0) {
      setShowAddress(true)
    }
  }, [showAddress, accountAddresses.length])

  return (
    <>
      <h2 className="h6 pt-1 pb-3 mb-3 border-bottom">{t('frontend.account.address.billingAddress')}</h2>
      {accountAddresses && (
        <div className="row mb-2">
          <div className="col-sm-12">
            {!showAddress && (
              <SwRadioSelect
                options={accountAddresses.map(({ accountAddressName, accountAddressID, address: { streetAddress } }) => {
                  return { name: `${accountAddressName} - ${streetAddress}`, value: accountAddressID }
                })}
                onChange={value => {
                  setShowAddress(false)
                  onSelect(value)
                }}
                customLabel={t('frontend.checkout.receive_option')}
                selectedValue={selectedAccountID}
                displayNew={true}
              />
            )}
          </div>
        </div>
      )}
      {showAddress && (
        <BillingAddress
          onSave={values => {
            setShowAddress(false)
            onSave(values)
          }}
          onCancel={() => {
            setShowAddress(false)
          }}
        />
      )}
      {!showAddress && (
        <button className="btn btn-secondary" onClick={() => setShowAddress(true)}>
          {t('frontend.account.scheduled.delivery.newAddressText')}
        </button>
      )}
    </>
  )
}

export { OrderTemplatePaymentAddressSelector }
