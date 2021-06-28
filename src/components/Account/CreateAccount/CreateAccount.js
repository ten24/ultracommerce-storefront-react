import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { SlatwalApiService } from '../../../services'
import { PromptLayout, SWForm, SWInput } from '../../'
import { useRedirect } from '../../../hooks/'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import { getErrorMessage } from '../../../utils'
import { useDispatch } from 'react-redux'
import { getUser, getWishLists } from '../../../actions'

const CreateAccount = () => {
  const dispatch = useDispatch()
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const { t } = useTranslation()
  // eslint-disable-next-line no-unused-vars
  const [redirect, setRedirect] = useRedirect({ location: '/my-account' })
  const signupSchema = Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    phoneNumber: Yup.string().required('Required').matches(phoneRegExp, 'Phone number is not valid'),
    password: Yup.string().required('Required'),
    passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    emailAddress: Yup.string().email('Invalid email').required('Required'),
    emailAddressConfirm: Yup.string()
      .email('Invalid email')
      .oneOf([Yup.ref('emailAddress'), null], 'Emails must match'),
  })

  const formik = useFormik({
    initialValues: {
      returnTokenFlag: '1',
      createAuthenticationFlag: '1',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      emailAddress: '',
      emailAddressConfirm: '',
      password: '',
      passwordConfirm: '',
    },
    validateOnChange: false,
    validationSchema: signupSchema,
    onSubmit: values => {
      SlatwalApiService.account.create(values).then(response => {
        if (response.isSuccess()) {
          if (!response.success().failureActions.length) {
            toast.success('Success')
            dispatch(getUser())
            dispatch(getWishLists())

            setRedirect({ shouldRedirect: true })
          }
          toast.error(getErrorMessage(response.success().errors))
        } else {
          toast.error('Error')
        }
      })
    },
  })

  return (
    // <div className="container py-4 py-lg-5 my-4">
    // <div className="row d-flex justify-content-center">
    //   <div className="mb-5   bg-white col-md-6 ">
    // <div className="container container-custom-xs">
    //     <div className="text-center">
    //          <h1 className="display-3">{t('frontend.account.myAccount')}</h1>
    //     </div>
    //     <hr />
    <PromptLayout>
      <h2>{t('frontend.account.createAccount')}</h2>
      <p>
        {t('frontend.account.old_account')}
        <Link className="ms-1" to={'my-account'}>
          {t('frontend.account.here')}
        </Link>
        .
      </p>

      <SWForm formik={formik} primaryButtontext="Create Account & Continue" title="">
        <div className="row align-items-center">
          <div className="col-md-6">
            <SWInput formik={formik} token="firstName" label="First Name" wrapperClasses="" />
          </div>
          <div className="col-md-5">
            <SWInput formik={formik} token="lastName" label="Last Name" wrapperClasses="" />
          </div>
          <SWInput formik={formik} token="phoneNumber" label="Phone Number" type="phone" />
          <SWInput formik={formik} token="emailAddress" label="Email Address" type="email" />
          <SWInput formik={formik} token="emailAddressConfirm" label="Confirm Email Address" type="email" />
          <SWInput formik={formik} token="password" label="Password" type="password" />
          <SWInput formik={formik} token="passwordConfirm" label="Confirm Password" type="password" />
        </div>
      </SWForm>
    </PromptLayout>
  )
}

export { CreateAccount }
