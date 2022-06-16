import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { SlatwalApiService } from '../../../services'
import * as Yup from 'yup'
import { getErrorMessage } from '../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { receiveUser } from '../../../actions'

const validate = values => {
  const errors = {}
  if (values.password !== values.confirmPassword) {
    errors.firstName = 'Passwords do not match.'
  }

  return errors
}

const useCreateAccountFromGuestAccount = () => {
  const dispatch = useDispatch()
  const { accountID } = useSelector(state => state.userReducer)
  const { orderID } = useSelector(state => state.cart)
  // eslint-disable-next-line no-unused-vars
  const signupSchema = Yup.object().shape({
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string().required('Required'),
  })

  const formik = useFormik({
    initialValues: {
      returnTokenFlag: '1',
      password: '',
      returnJSONObjects: 'account',
    },
    validate,
    onSubmit: values => {
      SlatwalApiService.account.createGuestAccountPassword({...values,accountID, orderID}).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          if (!response.success().failureActions.length) {
            toast.success('Success')
            dispatch(receiveUser(response.success().account))
          }
        } else {
          toast.error('Error')
        }
      })
    },
  })

  return { formik }
}

export { useCreateAccountFromGuestAccount }
