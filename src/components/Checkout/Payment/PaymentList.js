import { useDispatch, useSelector } from 'react-redux'
import { GiftCardDetails, CCDetails, TermPaymentDetails, ExternalPaymentDetails, CashPaymentDetails } from '../..'
import { removePayment } from '../../../actions/'
import { getAllOrderPayments, disableInteractionSelector } from '../../../selectors/'
import { useTranslation } from 'react-i18next'
import { useCheckoutUtilities } from '../../../hooks'

const PaymentList = ({ resetSelection }) => {
  const payments = useSelector(getAllOrderPayments)
  const disableInteraction = useSelector(disableInteractionSelector)
  const { CREDIT_CARD_CODE, GIFT_CARD_CODE, TERM_PAYMENT_CODE, CASH_PAYMENT_CODE, EXTERNAL_PAYMENT_CODE } = useCheckoutUtilities()

  const { t } = useTranslation()
  const dispatch = useDispatch()
  if (payments.length === 0) {
    return null
  }

  return (
    <>
      <p className="h4">{t('frontend.checkout.payments')}:</p>
      <div className="row ">
        {payments.map(payment => {
          return (
            <div className="bg-lightgray rounded mb-5 col-md-4 p-3" key={payment.orderPaymentID}>
              {payment.paymentMethod.paymentMethodType === CREDIT_CARD_CODE && <CCDetails hideHeading={true} creditCardPayment={payment} />}
              {payment.paymentMethod.paymentMethodType === GIFT_CARD_CODE && <GiftCardDetails method={payment.paymentMethod.paymentMethodType} />}
              {payment.paymentMethod.paymentMethodType === TERM_PAYMENT_CODE && <TermPaymentDetails hideHeading={true} termPayment={payment} />}
              {payment.paymentMethod.paymentMethodType === CASH_PAYMENT_CODE && <CashPaymentDetails hideHeading={true} cashPayment={payment} />}
              {payment.paymentMethod.paymentMethodType === EXTERNAL_PAYMENT_CODE && <ExternalPaymentDetails hideHeading={true} payment={payment} />}
              <hr />
              <button
                className="btn btn-link px-0 text-danger"
                type="button"
                disabled={disableInteraction}
                onClick={event => {
                  resetSelection()
                  dispatch(removePayment({ orderPaymentID: payment.orderPaymentID }))
                }}
              >
                <i className="fal fa-times-circle"></i>
                <span className="small"> {t('frontend.core.changeSelection')}</span>
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}
export { PaymentList }
