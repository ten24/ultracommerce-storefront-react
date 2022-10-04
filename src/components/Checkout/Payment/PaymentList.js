import { GiftCardDetails, CCDetails, CheckPaymentDetails, TermPaymentDetails, ExternalPaymentDetails, CashPaymentDetails } from '../..'
import { useTranslation } from 'react-i18next'
import { useCheckoutUtilities } from '../../../hooks'
import { CHECK_PAYMENT_CODE } from '../../../hooks/components/Checkout/useCheckoutUtilities'

const PaymentList = ({ resetSelection, payments, onRemovePayment = () => {}, disableInteraction = false }) => {
  const { CREDIT_CARD_CODE, GIFT_CARD_CODE, TERM_PAYMENT_CODE, CASH_PAYMENT_CODE, EXTERNAL_PAYMENT_CODE } = useCheckoutUtilities()
  const { t } = useTranslation()
  if (payments.length === 0) return null
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
              {payment.paymentMethod.paymentMethodType === CHECK_PAYMENT_CODE && <CheckPaymentDetails hideHeading={true} payment={payment} />}
              {payment.paymentMethod.paymentMethodType === EXTERNAL_PAYMENT_CODE && <ExternalPaymentDetails hideHeading={true} payment={payment} />}
              <hr />
              <button
                className="btn btn-link px-0 text-danger"
                type="button"
                disabled={disableInteraction}
                onClick={event => {
                  resetSelection()
                  onRemovePayment({ orderPaymentID: payment.orderPaymentID })
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
