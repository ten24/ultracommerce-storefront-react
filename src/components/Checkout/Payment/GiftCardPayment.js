import { useState } from 'react'
import { useSelector } from 'react-redux'
import { PaymentAddressSelector, Button } from '../../'
import { billingAccountAddressSelector } from '../../../selectors'
import { useTranslation } from 'react-i18next'
import { useGiftCardPayment } from '../../../hooks/'

const GiftCardPayment = ({ method }) => {
  const { t } = useTranslation()
  const selectedAccountID = useSelector(billingAccountAddressSelector)
  const [saveShippingAsBilling, setSaveShippingAsBilling] = useState('')
  const { onPaymentAddressSelect, onPaymentAddressSave, onSaveShippingAsBilling, fulfillmentMethodType, accountAddressID, setGiftCardNumber, giftCardNumber } = useGiftCardPayment({ method })

  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="giftCardNumber">{t('frontend.checkout.payment.giftCard.title')}</label>
            <input
              className="form-control"
              type="text"
              id="giftCardNumber"
              value={giftCardNumber}
              onChange={e => {
                e.preventDefault()
                setGiftCardNumber(e.target.value)
              }}
            />
          </div>
        </div>
        {fulfillmentMethodType === 'shipping' && (
          <div className="col-sm-12 mt-2">
            <div className="form-group">
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
                  {t(`frontend.checkout.payment.sameAsShippingAddress`)}
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      {saveShippingAsBilling && setGiftCardNumber && setGiftCardNumber.length > 0 && <Button label="Submit" onClick={onSaveShippingAsBilling} />}
      {!saveShippingAsBilling && setGiftCardNumber && setGiftCardNumber.length > 0 && <PaymentAddressSelector addressTitle={'Billing Address'} selectedAccountID={selectedAccountID || accountAddressID} onSelect={onPaymentAddressSelect} onSave={onPaymentAddressSave} />}
    </>
  )
}
export { GiftCardPayment }
