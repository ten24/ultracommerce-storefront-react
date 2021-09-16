import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useRedirect } from '../../../hooks/'
import { SwSelect, AccountAddressForm, AccountLayout, AccountContent } from '../../'
import { addPaymentMethod } from '../../../actions/userActions'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { SwRadioSelect } from '../../SwRadioSelect/SwRadioSelect'

const months = Array.from({ length: 12 }, (_, i) => {
  return { key: i + 1, value: i + 1 }
})
const years = Array(10)
  .fill(new Date().getFullYear())
  .map((year, index) => {
    return { key: year + index, value: year + index }
  })

const CreateOrEditAccountPaymentMethod = ({ customBody, contentTitle }) => {
  const accountAddresses = useSelector(state => state.userReducer.accountAddresses)
  const [redirect, setRedirect] = useRedirect({ location: '/my-account/cards' })
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      accountPaymentMethodName: '',
      paymentMethodType: 'creditCard',
      creditCardNumber: ``,
      nameOnCreditCard: '',
      expirationMonth: new Date().getMonth() + 2,
      expirationYear: new Date().getFullYear().toString().substring(2),
      securityCode: '',
      billingAccountAddress: {
        accountAddressID: '',
      },
      billingAddress: {
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
      },
    },
    onSubmit: values => {
      // TODO: Dispatch Actions
      if (values.billingAccountAddress.accountAddressID.length) {
        delete values.billingAddress.countryCode
        delete values.billingAddress.name
        delete values.billingAddress.company
        delete values.billingAddress.phoneNumber
        delete values.billingAddress.emailAddress
        delete values.billingAddress.streetAddress
        delete values.billingAddress.street2Address
        delete values.billingAddress.city
        delete values.billingAddress.stateCode
        delete values.billingAddress.postalCode
      }

      dispatch(addPaymentMethod(values))

      setRedirect({ ...redirect, shouldRedirect: true })
    },
  })
  let validCreditCard = formik.values.nameOnCreditCard.length > 0 && formik.values.creditCardNumber.length > 0 && formik.values.securityCode.length > 0
  return (
    <AccountLayout title={'Add Account Payment Method'}>
      <AccountContent customBody={customBody} contentTitle={contentTitle} />
      <form onSubmit={formik.handleSubmit} className="mt-5">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="paymentMethodType">{t('frontend.account.payment_method.heading')}</label>
              <SwSelect
                id="paymentMethodType"
                value={formik.values['paymentMethodType']}
                onChange={formik.handleChange}
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
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="creditCardNumber">{t('frontend.account.payment_method.ccn')}</label>
              <input className="form-control" type="text" id="creditCardNumber" value={formik.values.creditCardNumber} onChange={formik.handleChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="nameOnCreditCard">{t('frontend.account.payment_method.name')}</label>
              <input className="form-control" type="text" id="nameOnCreditCard" value={formik.values.nameOnCreditCard} onChange={formik.handleChange} />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="expirationMonth">{t('frontend.account.payment_method.expiration_month')}</label>
              <SwSelect id="expirationMonth" value={formik.values.expirationMonth} onChange={formik.handleChange} options={months} />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="expirationYear">{t('frontend.account.payment_method.expiration_year')}</label>
              <SwSelect id="expirationYear" value={formik.values.expirationYear} onChange={formik.handleChange} options={years} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="securityCode">{t('frontend.account.payment_method.cvv')}</label>
              <input className="form-control" type="text" placeholder={`***`} id="securityCode" value={formik.values.securityCode} onChange={formik.handleChange} />
            </div>
          </div>
          <div className="col-md-12">
            <hr className="my-4" />
          </div>

          {validCreditCard && (
            <div className="row">
              <div className="col-sm-12">
                <div className="col-md-6 pl-0">
                  <div className="form-group">
                    <label htmlFor="accountAddressID">{t('frontend.account.billing_address')}</label>
                    <SwRadioSelect
                      onChange={value => {
                        formik.setFieldValue('billingAccountAddress.accountAddressID', value)
                        setShowNewAddressForm(false)
                      }}
                      options={accountAddresses.map(({ accountAddressName, accountAddressID, address: { streetAddress } }) => {
                        return { name: `${accountAddressName} - ${streetAddress}`, value: accountAddressID }
                      })}
                      selectedValue={formik.values.billingAccountAddress.accountAddressID}
                    />
                    {!showNewAddressForm && (
                      <button
                        className="btn btn-secondary mt-2"
                        onClick={e => {
                          e.preventDefault()
                          setShowNewAddressForm(true)
                          formik.setFieldValue('billingAccountAddress.accountAddressID', '')
                        }}
                      >
                        New Address
                      </button>
                    )}
                  </div>
                </div>
                {showNewAddressForm && <AccountAddressForm formik={formik} />}
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <hr className="mt-4 mb-4" />
          <div className="d-flex flex-wrap justify-content-end">
            <button type="submit" className="btn btn-primary mt-3 mt-sm-0" disabled={formik.isSubmitting}>
              {t('frontend.account.payment.saveNew')}
            </button>
          </div>
        </div>
      </form>
    </AccountLayout>
  )
}
export { CreateOrEditAccountPaymentMethod }
