import { useFormik } from 'formik'
import { useRedirect } from '../../../hooks/'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { SlatwalApiService } from '../../../services'
import { AccountContent, AccountLayout } from '../../'

const UpdatePassword = ({ path, heading, redirectLocation = '/my-account/profile', customBody, contentTitle, action = 'Update Password' }) => {
  const { t } = useTranslation()
  const [redirect, setRedirect] = useRedirect({ location: redirectLocation })
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      accountPassword: '',
      accountPasswordConfirm: '',
    },
    onSubmit: values => {
      SlatwalApiService.account
        .changePassword({
          password: values.accountPassword,
          passwordConfirm: values.accountPasswordConfirm,
        })
        .then(response => {
          if (response.isSuccess()) {
            if (response.success().successfulActions.length) {
              toast.success(t('frontend.account.password_update'))
              setRedirect({ ...redirect, shouldRedirect: true })
            } else {
              let errors = response.success().errors.password ? response.success().errors.password : response.success().errors.passwordConfirm
              toast.error(errors.join(' '))
            }
          } else {
            toast.error('Network Error')
          }
        })
    },
  })
  return (
    <AccountLayout title={`Add ${action}`}>
      <AccountContent customBody={customBody} contentTitle={contentTitle} />
      <form onSubmit={formik.handleSubmit}>
        <h2>{heading}</h2>
        <div className="row">
          <div className="form-group col-md-6">
            <label htmlFor="accountPassword">{t('frontend.account.password')}</label>
            <input className="form-control" type="password" id="accountPassword" onChange={formik.handleChange} />
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="accountPasswordConfirm">{t('frontend.account.password_confirm')}</label>
            <input className="form-control" type="password" id="accountPasswordConfirm" onChange={formik.handleChange} />
          </div>

          <div className="col-12">
            <hr className="mt-2 mb-3" />
            <div className="d-flex flex-wrap justify-content-end">
              <button type="submit" className="btn btn-primary mt-3 mt-sm-0">
                {t('frontend.core.save')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </AccountLayout>
  )
}
//
export { UpdatePassword }
