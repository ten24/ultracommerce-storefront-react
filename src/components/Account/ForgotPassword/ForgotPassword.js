import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { SlatwalApiService } from '../../../services'
import { PromptLayout, SWForm, SWInput } from '../../'
import { useRedirect } from '../../../hooks'
import { Link } from 'react-router-dom'
import { getErrorMessage } from '../../../utils'

const ForgotPassword = () => {
  const { t } = useTranslation()
  // eslint-disable-next-line no-unused-vars
  const [redirect, setRedirect] = useRedirect({ location: '/my-account' })

  const formik = useFormik({
    initialValues: {
      emailAddress: '',
    },
    onSubmit: values => {
      SlatwalApiService.account.forgotPassword(values).then(response => {
        if (response.isSuccess()) {
          if (!response.success().failureActions.length) {
            toast.success('Success')
            setRedirect({ shouldRedirect: true })
          }
          toast.error(getErrorMessage(response.success().errors))
        } else {
          toast.success('Failure')
        }
      })
    },
  })
  return (
    <PromptLayout>
      <SWForm formik={formik} title="Forgot Password" primaryButtontext="Send Me Reset Email">
        <SWInput required={true} formik={formik} token="emailAddress" label="Email Address" type="email" />
        <Link to="/my-account">{t('frontend.account.back_to_login')}</Link>
      </SWForm>
    </PromptLayout>
  )
}
//
export { ForgotPassword }
