import { useTranslation } from 'react-i18next'
const GiftCardPayment = () => {
  const { t } = useTranslation()

  return (
    <>
      <h4>{t('frontend.checkout.payment.giftCard.title')}</h4>
    </>
  )
}

export { GiftCardPayment }
