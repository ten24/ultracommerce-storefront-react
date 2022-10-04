import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import queryString from 'query-string'
import { getUser, getWishLists } from '../../../actions'
import { getErrorMessage } from '../../../utils'
import { SlatwalApiService } from '../../../services'

const useCreateAccount = () => {
  const dispatch = useDispatch()
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  let navigate = useNavigate()
  const { search } = useLocation()
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
      SlatwalApiService.account
        .create(values)
        .then(response => {
          if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
          if (response.isSuccess()) {
            if (!response.success().failureActions.length) {
              toast.success('Success')
              dispatch(getUser()).then(() => {
                dispatch(getWishLists())
              })
            }
          } else {
            toast.error('Error')
          }
        })
        .then(() => {
          if (search.includes('redirect')) {
            const params = queryString.parse(search)
            navigate({
              pathname: params.redirect,
            })
          } else {
            navigate({
              pathname: '/my-account/overview',
            })
          }
        })
    },
  })

  return { formik }
}

export { useCreateAccount }
