import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStateCodeOptionsByCountryCode } from '../../../actions/'
import { SwRadioSelect, SwSelect } from '../..'
import { useTranslation } from 'react-i18next'
import { clearOrderFulfillment } from '../../../actions'
import { useFulfilmentAddress } from '../../../hooks'

const BillingAddress = ({ onSave, onCancel }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const countryCodeOptions = useSelector(state => state.content.countryCodeOptions)
  const stateCodeOptions = useSelector(state => state.content.stateCodeOptions)
  const { formik, isEdit } = useFulfilmentAddress({ onSave })

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="row mt-3">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="name">{t('frontend.account.name')}</label>
              <input disabled={!isEdit} className="form-control" type="text" id="name" value={formik.values.name} onChange={formik.handleChange} />
              {formik.errors.name && <span className="form-error-msg">{formik.errors.name}</span>}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="checkout-country">{t('frontend.account.countryCode')}</label>
              <SwSelect
                id="countryCode"
                disabled={!isEdit}
                value={formik.values.countryCode}
                onChange={e => {
                  e.preventDefault()
                  dispatch(getStateCodeOptionsByCountryCode(e.target.value))
                  formik.handleChange(e)
                }}
                options={countryCodeOptions}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="streetAddress">{t('frontend.account.streetAddress')}</label>
              <input disabled={!isEdit} className="form-control" type="text" id="streetAddress" value={formik.values.streetAddress} onChange={formik.handleChange} />
              {formik.errors.streetAddress && <span className="form-error-msg">{formik.errors.streetAddress}</span>}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="street2Address">{t('frontend.account.street2Address')}</label>
              <input disabled={!isEdit} className="form-control" type="text" id="street2Address" value={formik.values.street2Address} onChange={formik.handleChange} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="city">{t('frontend.account.city')}</label>
              <input disabled={!isEdit} className="form-control" type="text" id="city" value={formik.values.city} onChange={formik.handleChange} />
              {formik.errors.city && <span className="form-error-msg">{formik.errors.city}</span>}
            </div>
          </div>
          {stateCodeOptions[formik.values.countryCode] && stateCodeOptions[formik.values.countryCode].length > 0 && (
            <div className="col-sm-3">
              <div className="form-group">
                <label htmlFor="stateCode">{t('frontend.account.stateCode')}</label>
                <SwSelect
                  id="stateCode"
                  disabled={!isEdit}
                  value={formik.values.stateCode}
                  onChange={e => {
                    e.preventDefault()
                    formik.handleChange(e)
                  }}
                  options={stateCodeOptions[formik.values.countryCode]}
                />
                {formik.errors.stateCode && <span className="form-error-msg">{formik.errors.stateCode}</span>}
              </div>
            </div>
          )}

          <div className="col-sm-3">
            <div className="form-group">
              <label htmlFor="postalCode">{t('frontend.account.postalCode')}</label>
              <input disabled={!isEdit} className="form-control" type="text" id="postalCode" value={formik.values.postalCode} onChange={formik.handleChange} />
              {formik.errors.postalCode && <span className="form-error-msg">{formik.errors.postalCode}</span>}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="emailAddress">{t('frontend.account.emailAddress')}</label>
              <input disabled={!isEdit} className="form-control" type="text" id="emailAddress" value={formik.values.emailAddress} onChange={formik.handleChange} />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="phoneNumber">{t('frontend.account.phoneNumber')} </label>
              <input className="form-control" type="text" id="phoneNumber" value={formik.values['phoneNumber']} onChange={formik.handleChange} />
              {formik.errors.emailAddress && <span className="form-error-msg">{formik.errors.emailAddress}</span>}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <div className="custom-control custom-checkbox mt-1">
                <input className="custom-control-input" type="checkbox" id="saveAddress" checked={formik.values.saveAddress} onChange={formik.handleChange} />
                <label className="custom-control-label ms-1" htmlFor="saveAddress">
                  {t('frontend.account.save_to')}
                </label>
              </div>
            </div>

            {/* only display nickname field if "save address" is checked */}
            {!!formik.values.saveAddress && (
              <div className="form-group">
                <label htmlFor="accountAddressName">{t('frontend.account.nickname')}</label>
                <input className="form-control" type="text" id="accountAddressName" value={formik.values.accountAddressName} onChange={formik.handleChange} />
              </div>
            )}
          </div>
          <div className="col-sm-6 d-flex justify-content-end align-items-start mt-2">
            <button className="btn btn-primary " onClick={formik.handleSubmit}>
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

const FulfilmentAddressSelector = ({ onSelect, onSave, selectedAccountID, addressTitle = 'frontend.account.addresses', isShipping = true }) => {
  const accountAddresses = useSelector(state => state.userReducer.accountAddresses)
  const fulfillments = useSelector(state => state.cart.orderFulfillments)
  const [showAddress, setShowAddress] = useState(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  if (showAddress || accountAddresses.length === 0) {
    selectedAccountID = 'new'
  }
  const hasShippingAddress = fulfillments.length > 0 && fulfillments[0].shippingAddress.addressID.length > 0
  const showNewAddress = showAddress || selectedAccountID === 'new'

  return (
    <>
      <h2 className="h6 pt-1 pb-2 mb-3 border-bottom">{t(addressTitle)}</h2>

      {hasShippingAddress && (
        <div className="row ">
          {fulfillments.map(({ shippingAddress, orderFulfillmentID }) => {
            return (
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
                    dispatch(clearOrderFulfillment(orderFulfillmentID))
                  }}
                >
                  <i className="bi bi-times-circle"></i>
                  <span className="small"> {t(`frontend.core.changeSelection`)}</span>
                </button>
              </div>
            )
          })}
        </div>
      )}
      {!hasShippingAddress && accountAddresses && (
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
                  onSelect(value)
                }}
                customLabel={t('frontend.checkout.receive_option')}
                selectedValue={selectedAccountID}
                displayNew={true}
              />
            )}
            {!showNewAddress && (
              <button className="btn btn-secondary mt-2" onClick={() => setShowAddress(true)}>
                {t('frontend.account.address.add')}
              </button>
            )}
          </div>
        </div>
      )}
      {showNewAddress && (
        <>
          <BillingAddress
            isShipping={isShipping}
            setShowAddress={showAddress}
            onSave={values => {
              setShowAddress(false)
              onSave(values)
            }}
            onCancel={() => setShowAddress(false)}
          />
        </>
      )}
    </>
  )
}

export { FulfilmentAddressSelector }
