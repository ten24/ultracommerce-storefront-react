import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CreditCardDetails, SwRadioSelect } from '../..'
import { addPayment } from '../../../actions/'
import { getSavedCreditCardMethods, orderPayment } from '../../../selectors/'
import { useTranslation } from 'react-i18next'

const CreditCardPayment = () => {
  const paymentMethods = useSelector(getSavedCreditCardMethods)
  const [newOrderPayment, setNewOrderPayment] = useState(false)
  const { accountPaymentMethod = { accountPaymentMethodID: '' } } = useSelector(orderPayment)
  const dispatch = useDispatch()
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
          <hr />
          {newOrderPayment === 'new' ? (
            <label className="w-100 h4">{t('frontend.checkout.cardInfo')}</label>
          ) : (
            <SwRadioSelect
              label={t('frontend.checkout.cardInfo')}
              options={paymentMethods}
              onChange={value => {
                if (value === 'new') {
                  setNewOrderPayment('new')
                } else {
                  setNewOrderPayment(false)
                  dispatch(
                    addPayment({
                      accountPaymentMethodID: value,
                    })
                  )
                }
              }}
              selectedValue={newOrderPayment ? newOrderPayment : accountPaymentMethod.accountPaymentMethodID}
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
        <CreditCardDetails
          onSubmit={() => {
            setNewOrderPayment(false)
          }}
          setNewOrderPayment={setNewOrderPayment}
        />
      )}
    </>
  )
}

export { CreditCardPayment }
