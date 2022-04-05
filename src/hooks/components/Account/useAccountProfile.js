import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { updateUser } from '../../../actions'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify'
import { SlatwalApiService } from '../../../services'

const useAccountProfile = () => {
  const dispatch = useDispatch()
  const MySwal = withReactContent(Swal)
  const user = useSelector(state => state.userReducer)
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      accountFirstName: user.firstName,
      accountLastName: user.lastName,
      accountEmailAddress: user.primaryEmailAddress.emailAddress,
      // accountPhoneNumber: user.primaryPhoneNumber.phoneNumber,
      // accountExt: '',
      accountCompany: user.company,
    },
    onSubmit: values => {
      dispatch(
        updateUser({
          firstName: values.accountFirstName,
          lastName: values.accountLastName,
          primaryEmailAddress: {
            emailAddress: values.accountEmailAddress
          },
          company: values.accountCompany,
          returnJSONObjects: 'account',
        })
      )
    },
  })

  const updatePassword = event => {
    event.preventDefault()

    MySwal.fire({
      title: 'Update Password',
      html: '<input id="accountPassword" placeholder="Password" class="swal2-input"><input id="accountPasswordConfirm" placeholder="Confirm Password" class="swal2-input">',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return [document.getElementById('accountPassword').value, document.getElementById('accountPasswordConfirm').value]
      },
    }).then(data => {
      if (data.isConfirmed) {
        if (data.value.length === 2 && data.value[0] === data.value[1]) {
          SlatwalApiService.account
            .changePassword({
              password: data.value[0],
              passwordConfirm: data.value[1],
            })
            .then(response => {
              if (response.isSuccess()) {
                if (response.success().successfulActions.length) {
                  toast.success('Password Update Successful')
                } else {
                  toast.error(response.success().errors.password.join(' '))
                }
              } else {
                toast.error('Network Error')
              }
            })
        } else {
          toast.error('Password Mismatch')
        }
      }
    })
  }

  return { formik, updatePassword }
}

export { useAccountProfile }
