import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { SlatwalApiService } from '../../../services'
import { PromptLayout, SWForm, SWInput } from '../../'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../../../utils'

const ForgotPassword = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      emailAddress: '',
    },
    onSubmit: values => {
      SlatwalApiService.account.forgotPassword(values).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          navigate(`/my-account/login`)
          toast.success('Success')
        } else {
          toast.error('Failure')
        }
      })
    },
  })
  return (
    <PromptLayout>
      <SWForm formik={formik} title="Forgot Password" primaryButtontext="Send Me Reset Email">
        <SWInput required={true} formik={formik} token="emailAddress" label="Email Address" type="email" />
        <Link className="link" to="/my-account/login">
          {t('frontend.account.back_to_login')}
        </Link>
      </SWForm>
    </PromptLayout>
  )
}
//
export { ForgotPassword }
