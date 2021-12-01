import { useTranslation } from 'react-i18next'

const GiftCardDetails = ({ hideHeading }) => {
  const { t } = useTranslation()
  return (
    <>
      {!hideHeading && <h6 className="h6">{t('frontend.checkout.payment_method')}</h6>}
      <p>{t('frontend.checkout.payment.giftCard.heading')}</p>
    </>
  )
}

export { GiftCardDetails }
