import { login } from '../../../actions/'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useRouteMatch } from 'react-router-dom'
import * as Yup from 'yup'

const LoginForm = () => {
  const dispatch = useDispatch()
  let match = useRouteMatch()
  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: {
      loginEmail: '',
      loginPassword: '',
    },
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      loginEmail: Yup.string().email('Invalid email').required('Required'),
      loginPassword: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      dispatch(login(values.loginEmail, values.loginPassword, t('frontend.account.login_success'), t('frontend.account.login_failure')))
    },
  })

  return (
    <>
      <div className="mb-5 bg-white col-md-7">
        <div className="container container-custom-xs">
          <div className="text-center">
            <h1 className="display-3">{t('frontend.account.myAccount')}</h1>
          </div>
          <hr />
          <h2>{t('frontend.account.sign_in')}</h2>
          <p>
            {t('frontend.account.no_account')} <Link to={`${match.path}/createAccount`}>{t('frontend.account.here')}</Link>.
          </p>
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
              <Link to={`${match.path}/forgotPassword`} className="nav-link-inline font-size-sm">
                {t('frontend.account.forgot_password')}
              </Link>
            </div>
            <button className="btn btn-primary btn-lg mt-3" type="submit">
              {t('frontend.account.sign_in')}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

const AccountLogin = () => {
  return (
    <div className="container py-4 py-lg-5 my-4">
      <div className="row d-flex justify-content-center">
        <LoginForm />
      </div>
    </div>
  )
}

export { AccountLogin }
