import { useSelector } from 'react-redux'
import { SwSelect, Button, PaymentAddressSelector } from '../..'
import { useTranslation } from 'react-i18next'
import { fulfillmentSelector } from '../../../selectors'
import { useCreditCard, useCheckoutUtilities } from '../../../hooks'

const CreditCardDetails = ({ onSubmit, setNewOrderPayment }) => {
  const { t } = useTranslation()
  const { fulfillmentMethod } = useSelector(fulfillmentSelector)
  const { months, years } = useCheckoutUtilities()
  const { formik, validCreditCard, addCreditCardToOrder, addAccountAndSetAsBillingAddress, addSingleUseCreditCardAndSingleUseAddress, saveShippingAsBilling } = useCreditCard({ onSubmit })

  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-12">
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="nameOnCreditCard">{t('frontend.account.payment_method.name')}</label>
                <input className="form-control" type="text" id="nameOnCreditCard" value={formik.values.nameOnCreditCard} onChange={formik.handleChange} />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="creditCardNumber">{t('frontend.account.payment_method.ccn')}</label>
                <input className="form-control" type="text" id="creditCardNumber" value={formik.values.creditCardNumber} onChange={formik.handleChange} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <div className="form-group">
                <label htmlFor="securityCode">{t('frontend.account.payment_method.cvv')}</label>
                <input className="form-control" type="text" id="securityCode" value={formik.values.securityCode} onChange={formik.handleChange} />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label htmlFor="expirationMonth">{t('frontend.account.payment_method.expiration_month')}</label>
                <SwSelect id="expirationMonth" value={formik.values.expirationMonth} onChange={formik.handleChange} options={months} />
              </div>
            </div>
            <div className="col-sm-2">
              <div className="form-group">
                <label htmlFor="expirationYear">{t('frontend.account.payment_method.expiration_year')}</label>
                <SwSelect id="expirationYear" value={formik.values.expirationYear} onChange={formik.handleChange} options={years} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="accountPaymentMethodName">{t('frontend.account.payment_method.nickname')}</label>
                <input className="form-control" type="text" id="accountPaymentMethodName" value={formik.values.accountPaymentMethodName} onChange={formik.handleChange} />{' '}
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-6">
                  {fulfillmentMethod.fulfillmentMethodType === 'shipping' && (
                    <div className="custom-control custom-checkbox mt-2">
                      <input className="custom-control-input" type="checkbox" id="saveShippingAsBilling" checked={formik.values.saveShippingAsBilling} onChange={formik.handleChange} />
                      <label className="custom-control-label ms-2" htmlFor="saveShippingAsBilling">
                        {t('frontend.checkout.shipping_address_clone')}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {validCreditCard && !formik.values.saveShippingAsBilling && (
        <div className="row mb-3">
          <div className="col-sm-12">
            {!formik.values.saveShippingAsBilling && (
              <PaymentAddressSelector
                isShipping={false}
                addressTitle={'Billing Address'}
                selectedAccountID={formik.values.accountAddressID}
                onSelect={addCreditCardToOrder}
                onSave={values => {
                  if (formik.values.savePaymentMethodToAccount && values.saveAddress) {
                    // Create account address
                    // Create account Payment
                    // Payment with new Account Address and new Account Payment Method
                  } else if (values.saveAddress) {
                    // Create account address
                    // Payment with new Account Address and Single use CC
                    addAccountAndSetAsBillingAddress(values)
                  } else {
                    // and payment with new single use CC and Single use address
                    addSingleUseCreditCardAndSingleUseAddress(values)
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-12 text-end">
          {formik.values.saveShippingAsBilling && validCreditCard && <Button label="Submit" onClick={saveShippingAsBilling} />}
          <Button classList="mx-2 btn btn-secondary" label={t('frontend.checkout.payment.cancel')} onClick={() => setNewOrderPayment(false)} />
        </div>
      </div>
    </>
  )
}

export { CreditCardDetails }
