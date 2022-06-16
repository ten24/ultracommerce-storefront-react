import { useState } from 'react'
import { PaymentAddressSelector, Button } from '../../'
import { useTranslation } from 'react-i18next'
import { useTermPayment } from '../../../hooks'

const TermPayment = ({ method, fulfillment, isQuote = false, orderID, updateQuote }) => {
  const { t } = useTranslation()
  const selectedAccountID = ''
  const [saveShippingAsBilling, setSaveShippingAsBilling] = useState('')
  const { onPaymentAddressSelect, onPaymentAddressSave, onSaveShippingAsBilling, fulfillmentMethodType, accountAddressID, setTermOrderNumber, termOrderNumber } = useTermPayment({ method, fulfillment, isQuote, orderID })

  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="purchaseOrderNumber">{t('frontend.checkout.payment.po.number')}</label>
            <input
              className="form-control"
              type="text"
              id="purchaseOrderNumber"
              value={termOrderNumber}
              onChange={e => {
                e.preventDefault()
                setTermOrderNumber(e.target.value)
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
      {saveShippingAsBilling && termOrderNumber && termOrderNumber.length > 0 && (
        <Button
          label="Submit"
          onClick={e => {
            onSaveShippingAsBilling(e).then(response => {
              if (response.isSuccess() && isQuote && response.success().quote) updateQuote(response.success().quote)
            })
          }}
        />
      )}
      {!saveShippingAsBilling && termOrderNumber && termOrderNumber.length > 0 && (
        <PaymentAddressSelector
          addressTitle={'Billing Address'}
          selectedAccountID={selectedAccountID || accountAddressID}
          onSelect={e => {
            onPaymentAddressSelect(e).then(response => {
              if (response.isSuccess() && isQuote && response.success().quote) updateQuote(response.success().quote)
            })
          }}
          onSave={e => {
            onPaymentAddressSave(e).then(response => {
              if (response.isSuccess() && isQuote && response.success().quote) updateQuote(response.success().quote)
            })
          }}
        />
      )}
    </>
  )
}
export { TermPayment }
