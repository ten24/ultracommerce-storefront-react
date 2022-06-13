import { PromptLayout, SWForm, SWInput } from '../../'
import { useCreateGuestAccount } from '../../../hooks/'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const CreateGuestAccount = () => {
  const { formik } = useCreateGuestAccount()
  const { t } = useTranslation()

  return (
    <PromptLayout>
      <h2>{t('frontend.account.guest.checkout')}</h2>
      <p>
        {t('frontend.account.old_account')}
        <Link className="ms-1 link" to="/my-account">
          {t('frontend.account.here')}
        </Link>
        .
      </p>

      <SWForm formik={formik} primaryButtontext="Continue" title="">
        <div className="row">
          <div className="col-md-6">
            <SWInput formik={formik} token="firstName" label={t('frontend.account.create.guest.account.firstName')} wrapperClasses="" />
          </div>
          <div className="col-md-6">
            <SWInput formik={formik} token="lastName" label={t('frontend.account.create.guest.account.lastName')} wrapperClasses="" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <SWInput formik={formik} token="emailAddress" label={t('frontend.account.create.guest.account.emailAddress')} wrapperClasses="" />
          </div>
        </div>
      </SWForm>
    </PromptLayout>
  )
}

export { CreateGuestAccount }
