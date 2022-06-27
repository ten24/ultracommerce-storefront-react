import { SwSelect, TextInput } from '../../'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getCountries, getStateCodeOptionsByCountryCode } from '../../../actions/contentActions'
import { useDeepCompareEffect } from 'react-use'
import { useEffect } from 'react'
import * as Yup from 'yup'
import { getDefaultCountry } from '../../../selectors/configurationSelectors'

const AccountAddressForm = ({ billingAddress, setBillingAddress, billingAddressErrors, setBillingAddressErrors }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const countryCodeOptions = useSelector(state => state.content.countryCodeOptions)
  const stateCodeOptions = useSelector(state => state.content.stateCodeOptions)
  const countryCode = useSelector(getDefaultCountry)

  useDeepCompareEffect(() => {
    if (countryCodeOptions.length < 1) {
      dispatch(getCountries())
    }
  }, [dispatch, countryCodeOptions])
  useEffect(() => {
    dispatch(getStateCodeOptionsByCountryCode(billingAddress.countryCode || countryCode))
  }, [dispatch, billingAddress?.countryCode, countryCode])

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
      <h5 className="mt-4 mb-2">{t('frontend.account.address.billingAddress')}</h5>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="countryCode">{t('frontend.account.countryCode')}</label>
            <SwSelect
              id="countryCode"
              value={billingAddress.countryCode || countryCode}
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
           {!!billingAddressErrors.countryCode && <span className="form-error-msg">{billingAddressErrors.countryCode?.message}</span>}
          </div>
        </div>
        <div className="col-md-6">
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
        <div className="col-md-6">
          <TextInput
            name={billingAddress.company}
            label={t('frontend.account.company')}
            value={billingAddress.company}
            isError={!!billingAddressErrors?.company}
            errorMessage={billingAddressErrors?.company?.message}
            onChange={value => {
              setBillingAddress({
                ...billingAddress,
                company: value,
              })
            }}
            onBlur={value => requiredValidation({ value, name: 'company', msg: t('frontend.core.required') })}
          />
        </div>
        <div className="col-md-6">
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
        <div className="col-md-6">
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
        <div className="col-md-6">
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
        <div className="col-md-6">
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
        <div className="col-md-6">
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
              {!!billingAddressErrors.stateCode && <span className="form-error-msg">{billingAddressErrors.stateCode?.message}</span>}
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
        <div className="col-md-3">
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
    </>
  )
}

export { AccountAddressForm }
