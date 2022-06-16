import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { OauthGoogleLogin } from '../../OauthLogin/OauthGoogleLogin'
import { OauthFacebookLogin } from '../../OauthLogin/OauthFacebookLogin'
import { PromptLayout, SWForm, SWInput } from '../../'
import { useCreateAccount } from '../../../hooks/'
import { getSocialLogins } from '../../../selectors'

//additional button added for oAuthLogins
const OAuthSigninButtons = () => {
  const { t } = useTranslation()
  const socialLogins = useSelector(getSocialLogins)
  return (
    <div className="text-right pt-4">
      {socialLogins?.map(integration => {
        if (integration.key === 'googlelogin') return <OauthGoogleLogin key={integration.key} buttonText={t('frontend.oauth.googlesignup')} />
        if (integration.key === 'facebooklogin') return <OauthFacebookLogin key={integration.key} buttonText={t('frontend.oauth.facebooksignup')} />
        return null
      })}
    </div>
  )
}

const CreateAccount = () => {
  const { formik } = useCreateAccount()
  const { t } = useTranslation()

  return (
    <PromptLayout>
      <h2>{t('frontend.account.createAccount')}</h2>
      <p>
        {t('frontend.account.old_account')}
        <Link className="ms-1 link" to="/my-account/login">
          {t('frontend.account.here')}
        </Link>
        .
      </p>

      <SWForm formik={formik} primaryButtontext="Create Account & Continue" title="" AdditionalFormButtons={OAuthSigninButtons}>
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
