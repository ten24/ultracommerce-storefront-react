import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SwRadioSelect } from '../..'
import { getSavedCreditCardMethods } from '../../../selectors/'
import { useTranslation } from 'react-i18next'
import { CCDetails, OrderTemplateCreditCardDetails } from '../..'
import { useCheckoutUtilities } from '../../../hooks'

const EditPaymentMethod = ({ updateOrderTemplate, orderInfo, paymentMethod, setPaymentMethod, updatePaymentMethod }) => {
  const paymentMethods = useSelector(getSavedCreditCardMethods)
  const [newOrderPayment, setNewOrderPayment] = useState(false)
  const { t } = useTranslation()
  const [changeSelection, setChangeSelection] = useState(true)
  const { CREDIT_CARD_CODE } = useCheckoutUtilities()
  useEffect(() => {
    if (paymentMethods.length === 0) {
      // if there is no payment method found for the user , open new payment form
      setNewOrderPayment('new')
      setChangeSelection(false)
    } else {
      setNewOrderPayment('')
    }
  }, [paymentMethods])

  const accountPaymentMethod = {
    paymentMethod: {
      paymentMethodID: orderInfo?.accountPaymentMethod_accountPaymentMethodID,
      paymentMethodName: orderInfo?.accountPaymentMethod_accountPaymentMethodName,
    },
    nameOnCreditCard: orderInfo?.accountPaymentMethod_nameOnCreditCard,
    creditCardLastFour: orderInfo?.accountPaymentMethod_creditCardLastFour,
    creditCardType: orderInfo?.accountPaymentMethod_creditCardType,
  }

  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-12">
          {newOrderPayment === 'new' ? (
            <label className="w-100 h6">{t('frontend.checkout.cardInfo')}</label>
          ) : changeSelection && orderInfo?.accountPaymentMethod_accountPaymentMethodID ? (
            <>
              <p className="h4">{t('frontend.checkout.payments')}:</p>
              <div className="row ">
                <div className="bg-lightgray rounded mb-5 col-md-4 p-3" key={orderInfo?.accountPaymentMethod_accountPaymentMethodID}>
                  {orderInfo?.accountPaymentMethod_paymentMethod_paymentMethodType === CREDIT_CARD_CODE && <CCDetails hideHeading={true} creditCardPayment={accountPaymentMethod} />}
                  <hr />
                  <button
                    className="btn btn-link px-0 text-danger"
                    type="button"
                    onClick={event => {
                      setChangeSelection(false)
                    }}
                  >
                    <i className="fal fa-times-circle"></i>
                    <span className="small"> {t('frontend.core.changeSelection')}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <SwRadioSelect
              label={t('frontend.checkout.cardInfo')}
              options={paymentMethods}
              onChange={value => {
                setPaymentMethod(value)
                if (value === 'new') {
                  setNewOrderPayment('new')
                } else {
                  setNewOrderPayment(false)
                  updatePaymentMethod({ paymentMethodId: value })
                }
              }}
              selectedValue={paymentMethod}
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
        <OrderTemplateCreditCardDetails
          orderInfo={orderInfo}
          onSubmit={() => {
            setNewOrderPayment(false)
          }}
          onCancel={() => {
            setNewOrderPayment('')
          }}
          updateOrderTemplate={updateOrderTemplate}
          setNewOrderPayment={setNewOrderPayment}
          setChangeSelection={setChangeSelection}
        />
      )}
    </>
  )
}

export { EditPaymentMethod }
