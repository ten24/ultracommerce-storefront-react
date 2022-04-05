import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

const useValidation = () => {
  const { t } = useTranslation()

  const creditCardNumberOnChangeValidation = Yup.object({
    creditCardNumber: Yup.string().matches(/^\d+$/).min(0).max(19, t('frontend.account.payment_method.creditCard.max')),
  })
  const creditCardNumberOnBlurValidationSchema = Yup.object({
    creditCardNumber: Yup.string().required().min(13, t('frontend.account.payment_method.creditCard.min')).max(19, t('frontend.account.payment_method.creditCard.max')),
  })

  return { creditCardNumberOnChangeValidation, creditCardNumberOnBlurValidationSchema }
}
export { useValidation }
