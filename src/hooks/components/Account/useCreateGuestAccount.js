import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { SlatwalApiService } from '../../../services'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { getErrorMessage } from '../../../utils'
import { useDispatch } from 'react-redux'
import { receiveCart, receiveUser } from '../../../actions'

const useCreateGuestAccount = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  // eslint-disable-next-line no-unused-vars
  const signupSchema = Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    emailAddress: Yup.string().email().required('Required'),
  })

  const formik = useFormik({
    initialValues: {
      returnTokenFlag: '1',
      firstName: '',
      lastName: '',
      emailAddress: '',
      returnJSONObjects: 'account,cart',
    },
    validateOnChange: false,
    validationSchema: signupSchema,
    onSubmit: values => {
      SlatwalApiService.account.createGuestAccount(values).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          if (!response.success().failureActions.length) {
            toast.success('Success')
            dispatch(receiveUser(response.success().account))
            dispatch(receiveCart(response.success().cart))
            history.push('/checkout')
          }
        } else {
          toast.error('Error')
        }
      })
    },
  })

  return { formik }
}

export { useCreateGuestAccount }
