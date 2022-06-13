import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useLoginForm } from '../../../hooks'
import { OauthGoogleLogin } from '../../OauthLogin/OauthGoogleLogin'
import { getSocialLogins } from '../../../selectors'

const LoginForm = ({ isCheckout = false }) => {
  const { t } = useTranslation()
  const { formik } = useLoginForm()
  const location = useLocation()
  const allowGuestCheckout = useSelector(state => state.configuration.allowGuestCheckout)
  const socialLogins = useSelector(getSocialLogins)

  return (
    <>
      <div className="mb-5 bg-white col-md-7">
        <div className="container container-custom-xs">
          <div className="text-center">
            <h1 className="display-3">{t('frontend.account.myAccount')}</h1>
          </div>
          <hr />
          <h2>{t('frontend.account.sign_in')}</h2>

          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="mb-3">
                <label htmlFor="loginEmail">{t('frontend.account.email')}</label>
                <input value={formik.values.loginEmail} onBlur={formik.handleBlur} onChange={formik.handleChange} autoComplete="email" className="form-control" type="email" id="loginEmail" />
                {formik.errors.loginEmail && <span className="form-error-msg">{formik.errors.loginEmail}</span>}
              </div>
              <div className="mb-3">
                <label htmlFor="loginPassword">{t('frontend.account.password')}</label>
                <input value={formik.values.loginPassword} onBlur={formik.handleBlur} onChange={formik.handleChange} autoComplete="current-password" className="form-control" type="password" id="loginPassword" />
                {formik.errors.loginPassword && formik.touched.loginPassword && <span className="form-error-msg">{formik.errors.loginPassword}</span>}
              </div>
              <Link to={`/my-account/forgotPassword`} className="nav-link-inline font-size-sm link">
                {t('frontend.account.forgot_password')}
              </Link>
            </div>
            <div className="row my-2">
              <p>
                {t('frontend.account.no_account')}
                <Link className="link mx-1" to={`/my-account/createAccount${location.search}`}>
                  {t('frontend.account.here')}
                </Link>
              </p>
            </div>
            <div className="row">
              <div className="col-12">
                <button className="btn btn-primary btn-lg" type="submit">
                  {t('frontend.account.sign_in')}
                </button>
                {socialLogins.map(integration => {
                  if (integration.key === 'googlelogin') return <OauthGoogleLogin key={integration.key} />
                  return null
                })}
              </div>
            </div>
            {allowGuestCheckout && isCheckout && (
              <Link className="btn btn-primary btn-lg mt-3 ms-3" to={`/checkout/createGuestAccount${location.search}`}>
                {t('frontend.account.checkout.as.guest')}
              </Link>
            )}
          </form>
        </div>
      </div>
    </>
  )
}

const AccountLogin = ({ isCheckout = false }) => {
  return (
    <div className="container py-4 py-lg-5 my-4">
      <div className="row d-flex justify-content-center">
        <LoginForm isCheckout={isCheckout} />
      </div>
    </div>
  )
}

export { AccountLogin }
