import { useTranslation } from 'react-i18next'

const CheckPaymentDetails = ({ payment, hideHeading }) => {
  const { paymentMethod } = payment
  const { t } = useTranslation()

  return (
    <>
      {!hideHeading && <h6 className="h6">{t('frontend.checkout.payment_method')}</h6>}
      <p className="mb-1">
        <em>{paymentMethod.paymentMethodName}</em>
        <br />
      </p>
    </>
  )
}
export { CheckPaymentDetails }
