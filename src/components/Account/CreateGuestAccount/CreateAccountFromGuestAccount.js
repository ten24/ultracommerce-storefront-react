import { PromptLayout, SWForm, SWInput } from '../..'
import { useCreateAccountFromGuestAccount } from '../../../hooks'
import { useTranslation } from 'react-i18next'

const CreateAccountFromGuestAccount = () => {
  const { formik } = useCreateAccountFromGuestAccount()
  const { t } = useTranslation()

  return (
    <PromptLayout>
      <h2>{t('frontend.account.createAccount')}</h2>

      <SWForm formik={formik} primaryButtontext="Continue" title="">
        <div className="row">
          <div className="col-md-6">
            <SWInput formik={formik} token="password" label={t('frontend.account.create.guest.account.password')} wrapperClasses="" />
          </div>
          <div className="col-md-6">
            <SWInput formik={formik} token="confirmPassword" label={t('frontend.account.create.guest.account.confirmPassword')} wrapperClasses="" />
          </div>
        </div>
      </SWForm>
    </PromptLayout>
  )
}

export { CreateAccountFromGuestAccount }
