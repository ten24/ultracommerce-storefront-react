import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SlideNavigation, SwRadioSelect, Overlay, PaymentList, CreditCardPayment, TermPayment, GiftCardPayment, PayPalPayment } from '../..'
import { eligiblePaymentMethodDetailSelector, orderPayment, getAllOrderPayments } from '../../../selectors/'
import { useTranslation } from 'react-i18next'
import { useCheckoutUtilities } from '../../../hooks'
import { addPayment } from '../../../actions'

const PaymentSlide = ({ currentStep }) => {
  const orderRequirementsList = useSelector(state => state.cart.orderRequirementsList)
  const eligiblePaymentMethodDetails = useSelector(eligiblePaymentMethodDetailSelector)
  const { paymentMethod } = useSelector(orderPayment)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [paymentMethodOnOrder, setPaymentMethodOnOrder] = useState(false)
  const allPayments = useSelector(getAllOrderPayments)
  const { isFetching } = useSelector(state => state.cart)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { CREDIT_CARD, GIFT_CARD, TERM_PAYMENT, PAYPAL_PAYMENT, CASH_PAYMENT } = useCheckoutUtilities()

  const processCashPayment = value => {
    dispatch(
      addPayment({
        newOrderPayment: {
          paymentMethod: {
            paymentMethodID: value,
          },
        },
      })
    )
  }

  useEffect(() => {
    if (paymentMethod && paymentMethod.paymentMethodID && paymentMethodOnOrder !== paymentMethod.paymentMethodID) {
      setPaymentMethodOnOrder(paymentMethod.paymentMethodID)
      setSelectedPaymentMethod(paymentMethod.paymentMethodID)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod])

  return (
    <Overlay active={isFetching} spinner>
      {/* <!-- Payment Method --> */}
      <PaymentList
        resetSelection={() => {
          setPaymentMethodOnOrder('')
          setSelectedPaymentMethod('')
        }}
      />
      {allPayments.length === 0 && (
        <>
          <div className="row mb-3">
            <div className="col-sm-12">
              {eligiblePaymentMethodDetails.length === 0 && (
                <div className="alert alert-warning" role="alert">
                  {t('frontend.checkout.noPaymentEnabled')}
                </div>
              )}
              {eligiblePaymentMethodDetails.length > 0 && (
                <SwRadioSelect
                  label={t('frontend.checkout.payment.select')}
                  options={eligiblePaymentMethodDetails}
                  onChange={value => {
                    setSelectedPaymentMethod(value)
                    if (value === CASH_PAYMENT) {
                      processCashPayment(value)
                    }
                  }}
                  selectedValue={selectedPaymentMethod.length > 0 ? selectedPaymentMethod : paymentMethodOnOrder}
                />
              )}
            </div>
          </div>
          {selectedPaymentMethod === CREDIT_CARD && <CreditCardPayment />}
          {selectedPaymentMethod === GIFT_CARD && <GiftCardPayment method={selectedPaymentMethod} />}
          {selectedPaymentMethod === PAYPAL_PAYMENT && <PayPalPayment />}
          {selectedPaymentMethod === TERM_PAYMENT && <TermPayment method={selectedPaymentMethod} />}
        </>
      )}

      <SlideNavigation currentStep={currentStep} nextActive={!orderRequirementsList.includes('payment')} />
    </Overlay>
  )
}

export { PaymentSlide }
