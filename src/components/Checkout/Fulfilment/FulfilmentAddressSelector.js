import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SwRadioSelect, SwSelect } from '../..'
import { useTranslation } from 'react-i18next'
import { getAllAccountAddresses, getDefaultCountry } from '../../../selectors'
import { getCountriesAndAddressOptions } from '../../../actions/contentActions'

const BillingAddress = ({ onSave, onCancel }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const defaultCountryCode = useSelector(getDefaultCountry)
  const [isEdit] = useState(true)
  const countries = useSelector(state => state.content.countries)
  const [name, setName] = useState('')
  const [countryCode, setCountryCode] = useState(defaultCountryCode)
  const [stateCode, setStateCode] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [locality, setLocality] = useState('')
  const [city, setCity] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [street2Address, setStreet2Address] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [saveAddress, setSaveAddress] = useState('')
  const [accountAddressName, setAccountAddressName] = useState('')
  useEffect(() => {
    if (Object.keys(countries)?.length === 0) {
      dispatch(getCountriesAndAddressOptions())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { addressOptions = {}, states = [] } = countries[countryCode] || {}
  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault()
          onSave({ name, countryCode, stateCode, postalCode, locality, city, streetAddress, street2Address, phoneNumber, emailAddress, saveAddress, accountAddressName })
        }}
      >
        <div className="row mt-3">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="name">{t('frontend.account.name')}</label>
              <input
                disabled={!isEdit}
                className="form-control"
                type="text"
                id="name"
                required={true}
                value={name}
                onChange={e => {
                  e.preventDefault()
                  setName(e.target.value)
                }}
              />
              {/* {formik.errors.name && <span className="form-error-msg">{formik.errors.name}</span>} */}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="checkout-country">{t('frontend.account.countryCode')}</label>
              <SwSelect
                id="countryCode"
                disabled={!isEdit}
                value={countryCode}
                onChange={e => {
                  e.preventDefault()
                  setCountryCode(e.target.value)
                }}
                options={Object.keys(countries).map(country => countries[country])}
              />
            </div>
          </div>
        </div>
        <div className="row">
          {addressOptions.streetAddressShowFlag && (
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="streetAddress">{addressOptions.streetAddressLabel}</label>
                <input
                  disabled={!isEdit}
                  className="form-control"
                  required={addressOptions.streetAddressRequiredFlag}
                  type="text"
                  id="streetAddress"
                  value={streetAddress}
                  onChange={e => {
                    e.preventDefault()
                    setStreetAddress(e.target.value)
                  }}
                />
                {/* {formik.errors.streetAddress && <span className="form-error-msg">{formik.errors.streetAddress}</span>} */}
              </div>
            </div>
          )}
          {addressOptions.street2AddressShowFlag && (
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="street2Address">{addressOptions.street2AddressLabel}</label>
                <input
                  disabled={!isEdit}
                  className="form-control"
                  required={addressOptions.street2AddressRequiredFlag}
                  type="text"
                  id="street2Address"
                  value={street2Address}
                  onChange={e => {
                    e.preventDefault()
                    setStreet2Address(e.target.value)
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-sm-6">
            {addressOptions.cityShowFlag && (
              <div className="form-group">
                <label htmlFor="city">{addressOptions.cityLabel}</label>
                <input
                  disabled={!isEdit}
                  className="form-control"
                  required={addressOptions.cityRequiredFlag}
                  type="text"
                  id="city"
                  value={city}
                  onChange={e => {
                    e.preventDefault()
                    setCity(e.target.value)
                  }}
                />
                {/* {formik.errors.city && <span className="form-error-msg">{formik.errors.city}</span>} */}
              </div>
            )}
          </div>
          {states.length > 0 && addressOptions.stateCodeShowFlag && (
            <div className="col-sm-3">
              <div className="form-group">
                <label htmlFor="stateCode">{addressOptions.stateCodeLabel}</label>
                <SwSelect
                  id="stateCode"
                  disabled={!isEdit}
                  required={addressOptions.stateCodeRequiredFlag}
                  value={stateCode}
                  onChange={e => {
                    e.preventDefault()
                    setStateCode(e.target.value)
                  }}
                  options={states}
                />
                {/* {formik.errors.stateCode && <span className="form-error-msg">{formik.errors.stateCode}</span>} */}
              </div>
            </div>
          )}

          {addressOptions.postalCodeShowFlag && (
            <div className="col-sm-3">
              <div className="form-group">
                <label htmlFor="postalCode">{addressOptions.postalCodeLabel}</label>
                <input
                  disabled={!isEdit}
                  className="form-control"
                  type="text"
                  required={addressOptions.postalCodeRequiredFlag}
                  id="postalCode"
                  value={postalCode}
                  onChange={e => {
                    e.preventDefault()
                    setPostalCode(e.target.value)
                  }}
                />
                {/* {formik.errors.postalCode && <span className="form-error-msg">{formik.errors.postalCode}</span>} */}
              </div>
            </div>
          )}
        </div>
        {addressOptions.localityShowFlag && (
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="locality">{addressOptions.localityLabel}</label>
                <input
                  disabled={!isEdit}
                  className="form-control"
                  required={addressOptions.localityRequiredFlag}
                  type="text"
                  id="locality"
                  value={locality}
                  onChange={e => {
                    e.preventDefault()
                    setLocality(e.target.value)
                  }}
                />
                {/* {formik.errors.locality && <span className="form-error-msg">{formik.errors.locality}</span>} */}
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="emailAddress">{t('frontend.account.emailAddress')}</label>
              <input
                disabled={!isEdit}
                className="form-control"
                type="text"
                id="emailAddress"
                value={emailAddress}
                onChange={e => {
                  e.preventDefault()
                  setEmailAddress(e.target.value)
                }}
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="phoneNumber">{t('frontend.account.phoneNumber')} </label>
              <input
                className="form-control"
                disabled={!isEdit}
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={e => {
                  e.preventDefault()
                  setPhoneNumber(e.target.value)
                }}
              />
              {/* {formik.errors.emailAddress && <span className="form-error-msg">{formik.errors.emailAddress}</span>} */}
            </div>
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
                  onChange={() => {
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
              <div className="form-group">
                <label htmlFor="accountAddressName">{t('frontend.account.nickname')}</label>
                <input
                  className="form-control"
                  type="text"
                  required={saveAddress}
                  id="accountAddressName"
                  value={accountAddressName}
                  onChange={e => {
                    e.preventDefault()
                    setAccountAddressName(e.target.value)
                  }}
                />
              </div>
            )}
          </div>
          <div className="col-sm-6 d-flex justify-content-end align-items-start mt-2">
            <button className="btn btn-primary ">
              <span className="d-inline">{t('frontend.core.save')}</span>
            </button>
            {onCancel && (
              <button className="btn btn-secondary mx-2" onClick={onCancel}>
                <span className="d-inline">{t('frontend.account.address.cancel')}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  )
}

const FulfilmentAddressSelector = ({ onSelect, onSave, fulfillment, addressTitle = 'frontend.account.addresses' }) => {
  const accountAddresses = useSelector(getAllAccountAddresses)
  const { accountAddress, shippingAddress } = fulfillment
  const [changeAddress, setChangeAddress] = useState(false)
  const [showAddress, setShowAddress] = useState(false)
  const { t } = useTranslation()
  const hasShippingAddress = shippingAddress?.addressID?.length > 0
  const showAddressCard = !changeAddress && shippingAddress?.addressID?.length > 0
  const showAddressPicker = (changeAddress || shippingAddress?.addressID?.length === 0) && !showAddress
  return (
    <div className="fulfilmentAddressSelector">
      <h5 className="h5 pt-1 pb-2 mb-3 border-bottom">{t(addressTitle)}</h5>

      {showAddressCard && (
        <div className="row ">
          <div className="bg-lightgray rounded mb-2 col-md-4 p-3" key={shippingAddress?.addressID}>
            <div>
              <b>{shippingAddress.name}</b>
              <br />
              {shippingAddress.streetAddress} <br />
              {`${shippingAddress.city}, ${shippingAddress.stateCode} ${shippingAddress.postalCode}`} <br />
            </div>
            <hr />
            <button
              className="btn btn-link p-0 text-danger"
              type="button"
              disabled={false}
              onClick={event => {
                event.preventDefault()
                setChangeAddress(true)
              }}
            >
              <i className="bi bi-times-circle"></i>
              <span className="small"> {t(`frontend.core.changeSelection`)}</span>
            </button>
          </div>
        </div>
      )}
      {showAddressPicker && (
        <div className="row mb-2">
          <div className="col-sm-12">
            {!showAddress && (
              <SwRadioSelect
                options={accountAddresses.map(({ accountAddressName, accountAddressID, address }) => {
                  const addressString = ` ${address.streetAddress}, ${address.city}, ${address.stateCode} ${address.postalCode}`
                  const name = accountAddressName ? `${accountAddressName} - ${addressString} ` : addressString
                  return { name, value: accountAddressID }
                })}
                onChange={value => {
                  !hasShippingAddress && setShowAddress(false)
                  onSelect(value).then(() => {
                    setChangeAddress(false)
                  })
                }}
                customLabel={t('frontend.checkout.receive_option')}
                selectedValue={accountAddress?.accountAddressID}
                displayNew={true}
              />
            )}
            {!showAddress && (
              <button className="btn btn-secondary mt-2" onClick={() => setShowAddress(true)}>
                {t('frontend.account.address.add')}
              </button>
            )}
          </div>
        </div>
      )}
      {showAddress && (
        <>
          <BillingAddress
            setShowAddress={showAddress}
            onSave={values => {
              onSave(values).then(() => {
                setChangeAddress(false)
                setShowAddress(false)
              })
            }}
            onCancel={() => setShowAddress(false)}
          />
        </>
      )}
    </div>
  )
}

export { FulfilmentAddressSelector }
