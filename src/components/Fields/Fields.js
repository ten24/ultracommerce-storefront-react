import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

const TextInput = ({ name = '', label = '', value = '', type = '', isError = false, errorMessage = '', onChange, onBlur }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        className="form-control"
        type={type || "text"}
        id={name}
        value={value}
        onChange={event => {
          event.preventDefault()
          return onChange(event.target.value)
        }}
        onBlur={event => {
          event.preventDefault()
          return onBlur(event.target.value)
        }}
      />
      {isError && <span className="form-error-msg">{errorMessage}</span>}
    </div>
  )
}

const CreditCardNumber = ({ name = 'creditCardNumber', value = '', isError = false, errorMessage = '', onSet, onChange, onBlur }) => {
  const { t } = useTranslation()

  const onChangeValidation = Yup.object({
    creditCardNumber: Yup.string().matches(/^\d+$/).min(0).max(19, t('frontend.account.payment_method.creditCard.max')),
  })
  const onBlurValidationSchema = Yup.object({
    creditCardNumber: Yup.string().required().min(13, t('frontend.account.payment_method.creditCard.min')).max(19, t('frontend.account.payment_method.creditCard.max')),
  })
  return (
    <div className="form-group">
      <label htmlFor={name}>{t('frontend.account.payment_method.ccn')}</label>
      <input
        className="form-control"
        type="text"
        id={name}
        value={value}
        onChange={async e => {
          e.preventDefault()
          const { value } = e.target
          const isFormValid = await onChangeValidation.isValid({ creditCardNumber: value })
          if (isFormValid || value === '') onSet(value)
        }}
        onBlur={event => {
          event.preventDefault()
          const { value } = event.target
          onBlurValidationSchema
            .validate({ creditCardNumber: value }, { abortEarly: false })
            .then(valid => {})
            .catch(err => {
              err.inner.reduce((acc, { message, path }) => {
                return {
                  ...acc,
                  [path]: { path, message },
                }
              }, {})
              //  setPaymentMethodErrors(errors)
            })
        }}
      />
      {isError && <span className="form-error-msg">{t('') || errorMessage}</span>}
    </div>
  )
}
export { CreditCardNumber, TextInput }
