import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { eligiblePaymentMethodDetailSelector, orderPayment, getAllOrderPayments, disableInteractionSelector, fulfillmentSelector } from '../../../selectors/'
import { SlideNavigation, SwRadioSelect, Overlay, PaymentList, CreditCardPayment, TermPayment, GiftCardPayment, PayPalPayment, PayPalCommercePayment } from '../..'
import { useTranslation } from 'react-i18next'
import { useCheckoutUtilities } from '../../../hooks'
import { addPayment, removeOrderPayment } from '../../../actions'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../../utils'

const PaymentSlide = ({ currentStep, cartState }) => {
  const disableInteraction = useSelector(disableInteractionSelector)
  const fulfillment = useSelector(fulfillmentSelector)
  const orderRequirementsList = useSelector(state => state.cart.orderRequirementsList)
  const eligiblePaymentMethodDetails = useSelector(eligiblePaymentMethodDetailSelector)
  const { paymentMethod } = useSelector(orderPayment)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [paymentMethodOnOrder, setPaymentMethodOnOrder] = useState(false)
  const allPayments = useSelector(getAllOrderPayments)
  const { isFetching } = useSelector(state => state.cart)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { EXTERNAL_PAYMENT_CODE, CREDIT_CARD_CODE, GIFT_CARD_CODE, TERM_PAYMENT_CODE, PAYPAL_PAYMENT_CODE, CASH_PAYMENT_CODE, CHECK_PAYMENT_CODE, PAYPAL_COMMERCE_CODE, getPaymentMethodByIDFromList } = useCheckoutUtilities()

  const processSimplePayment = value => {
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
      setPaymentMethodOnOrder(paymentMethod)
      setSelectedPaymentMethod(paymentMethod)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod])

  return (
    <Overlay active={isFetching} spinner>
      {/* <!-- Payment Method --> */}
      <PaymentList
        payments={allPayments}
        disableInteraction={disableInteraction}
        onRemovePayment={paymentSelection => {
          dispatch(removeOrderPayment({ params: paymentSelection })).then(response => {
            if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
          })
        }}
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
                    const foundPaymentMethod = getPaymentMethodByIDFromList(eligiblePaymentMethodDetails, value)
                    setSelectedPaymentMethod(foundPaymentMethod)
                    if (foundPaymentMethod.paymentMethodType === CASH_PAYMENT_CODE || foundPaymentMethod.paymentMethodType === CHECK_PAYMENT_CODE) {
                      processSimplePayment(value)
                    }
                  }}
                  selectedValue={selectedPaymentMethod?.paymentMethodID?.length ? selectedPaymentMethod.paymentMethodID : paymentMethodOnOrder}
                />
              )}
            </div>
          </div>
          {selectedPaymentMethod.paymentMethodType === CREDIT_CARD_CODE && <CreditCardPayment method={selectedPaymentMethod.paymentMethodID} fulfillment={fulfillment} />}
          {selectedPaymentMethod.paymentMethodType === GIFT_CARD_CODE && <GiftCardPayment method={selectedPaymentMethod.paymentMethodID} />}
          {selectedPaymentMethod.paymentMethodType === TERM_PAYMENT_CODE && <TermPayment method={selectedPaymentMethod.paymentMethodID} fulfillment={fulfillment} />}
          {selectedPaymentMethod.paymentMethodType === EXTERNAL_PAYMENT_CODE && selectedPaymentMethod.paymentIntegration.integrationPackage === PAYPAL_COMMERCE_CODE && <PayPalCommercePayment method={selectedPaymentMethod.paymentMethodID} cartState={cartState} />}
          {selectedPaymentMethod.paymentMethodType === EXTERNAL_PAYMENT_CODE && selectedPaymentMethod.paymentIntegration.integrationPackage === PAYPAL_PAYMENT_CODE && <PayPalPayment />}
        </>
      )}

      <SlideNavigation currentStep={currentStep} nextActive={!orderRequirementsList.includes('payment')} />
    </Overlay>
  )
}

export { PaymentSlide }
