import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import queryString from 'query-string'
import { useLocation, useHistory } from 'react-router-dom'
import { errorLogin } from '../../../actions/'
import { SlatwalApiService } from '../../../services'
import { getErrorMessage } from '../../../utils'
import { Button } from '../../../components'
import { useState } from 'react'

const ForgotPasswordReset = () => {
  const loc = useLocation()
  const [shouldRedirect, setRedirect] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  let { swprid } = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })

  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirm: '',
    },
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      password: Yup.string().required('Required'),
      passwordConfirm: Yup.string()
        .required('Required')
        .oneOf([Yup.ref('password'), null], t('frontend.account.forgot.match')),
    }),
    onSubmit: ({ password, passwordConfirm }) => {
      const payload = {
        swprid,
        passwordConfirm,
        password,
      }

      SlatwalApiService.account.resetPassword(payload).then(response => {
        if (response.isSuccess() && (response.success().errors === undefined || response.success().errors === null) && response.success().failureActions.length === 0) {
          toast.success(t('frontend.account.forgot.success'))
          setRedirect(true)
        } else {
          let errorMessage = response.success() && Object.keys(response.success()?.errors || {}).length ? getErrorMessage(response.success().errors) : t('frontend.account.forgot.failure')
          toast.error(errorMessage)
          dispatch(errorLogin())
        }
        formik.setSubmitting(false)
      })
    },
  })
  if (!swprid || shouldRedirect) history.replace('/my-account/Login')
  return (
    <div className="container py-4 py-lg-5 my-4">
      <div className="row d-flex justify-content-center">
        <div className="mb-5 bg-white col-md-7">
          <div className="container container-custom-xs">
            <div className="text-center">
              <h1 className="display-3">{t('frontend.account.forgot.heading')}</h1>
            </div>
            <hr />

            <form>
              <div className="row">
                <div className="mb-3">
                  <label htmlFor="password">{t('frontend.account.forgot.new')}</label>
                  <input value={formik.values.password} onBlur={formik.handleBlur} onChange={formik.handleChange} autoComplete="current-password" className="form-control" type="password" id="password" />
                  {formik.errors.password && formik.touched.password && <span className="form-error-msg">{formik.errors.password}</span>}
                </div>

                <div className="mb-3">
                  <label htmlFor="passwordConfirm">{t('frontend.account.forgot.confirm')}</label>
                  <input value={formik.values.passwordConfirm} onBlur={formik.handleBlur} onChange={formik.handleChange} autoComplete="current-password" className="form-control" type="password" id="passwordConfirm" />
                  {formik.errors.passwordConfirm && formik.touched.passwordConfirm && <span className="form-error-msg">{formik.errors.passwordConfirm}</span>}
                </div>
              </div>
              <Button isLoading={formik.isSubmitting} disabled={formik.isSubmitting} classList="btn btn-primary btn-lg mt-3" onClick={formik.handleSubmit}>
                {t('frontend.account.forgot.submit')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export { ForgotPasswordReset }
