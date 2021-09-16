import { useTranslation } from 'react-i18next'

const CCDetails = ({ creditCardPayment, hideHeading = false }) => {
  const { paymentMethod, creditCardType, nameOnCreditCard, creditCardLastFour } = creditCardPayment
  const { t } = useTranslation()

  return (
    <>
      {!hideHeading && <h6 className="h6">{t('frontend.checkout.payment_method')}</h6>}
      <p className="mb-1">
        <em>{paymentMethod.paymentMethodName}</em>
        <br />
        {nameOnCreditCard} <br />
        {`${creditCardType} ending in ${creditCardLastFour}`}
      </p>
    </>
  )
}

export { CCDetails }
