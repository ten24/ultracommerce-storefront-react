import { PromptLayout, SWForm, SWInput } from '../../'
import { useCreateAccount } from '../../../hooks/'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const CreateAccount = () => {
  const { formik } = useCreateAccount()
  const { t } = useTranslation()

  return (
    <PromptLayout>
      <h2>{t('frontend.account.createAccount')}</h2>
      <p>
        {t('frontend.account.old_account')}
        <Link className="ms-1 link" to="my-account">
          {t('frontend.account.here')}
        </Link>
        .
      </p>

      <SWForm formik={formik} primaryButtontext="Create Account & Continue" title="">
        <div className="row">
          <div className="col-md-6">
            <SWInput formik={formik} token="firstName" label="First Name" wrapperClasses="" />
          </div>
          <div className="col-md-6">
            <SWInput formik={formik} token="lastName" label="Last Name" wrapperClasses="" />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <SWInput formik={formik} token="phoneNumber" label="Phone Number" type="phone" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <SWInput formik={formik} token="emailAddress" label="Email Address" type="email" />
          </div>
          <div className="col-md-6">
            <SWInput formik={formik} token="emailAddressConfirm" label="Confirm Email Address" type="email" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <SWInput formik={formik} token="password" label="Password" type="password" />
          </div>
          <div className="col-md-6">
            <SWInput formik={formik} token="passwordConfirm" label="Confirm Password" type="password" />
          </div>
        </div>
      </SWForm>
    </PromptLayout>
  )
}

export { CreateAccount }
