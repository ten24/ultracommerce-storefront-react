import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { SlatwalApiService } from '../../../services'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { getErrorMessage } from '../../../utils'
import { useDispatch } from 'react-redux'
import { getUser, getWishLists } from '../../../actions'

const useCreateAccount = () => {
  const dispatch = useDispatch()
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const history = useHistory()
  // eslint-disable-next-line no-unused-vars
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
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          if (!response.success().failureActions.length) {
            toast.success('Success')
            dispatch(getUser())
            dispatch(getWishLists())
            history.push(`/my-account`)
          }
        } else {
          toast.error('Error')
        }
      })
    },
  })

  return { formik }
}

export { useCreateAccount }
