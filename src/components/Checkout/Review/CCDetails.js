import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getAllAccountPaymentMethods } from '../../../selectors'

const CCDetails = ({ creditCardPayment, hideHeading = false }) => {
  const { paymentMethod, creditCardType, nameOnCreditCard, creditCardLastFour, accountPaymentMethod } = creditCardPayment
  const paymentMethods = useSelector(getAllAccountPaymentMethods)
  const { t } = useTranslation()
  return (
    <>
      {!hideHeading && <h6 className="h6">{t('frontend.checkout.payment_method')}</h6>}
      <p className="mb-1">
        {accountPaymentMethod?.accountPaymentMethodID?.length > 0 &&
          paymentMethods.map(method => {
            return method.accountPaymentMethodID === accountPaymentMethod?.accountPaymentMethodID ? <em key={accountPaymentMethod?.accountPaymentMethodID}>{method?.accountPaymentMethodName}</em> : null
          })}
        <br />
        <em>{paymentMethod?.paymentMethodName}</em>
        <br />
        {nameOnCreditCard} <br />
        {`${creditCardType} ending in ${creditCardLastFour}`}
      </p>
    </>
  )
}

export { CCDetails }
