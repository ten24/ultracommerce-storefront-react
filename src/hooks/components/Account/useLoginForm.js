import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import queryString from 'query-string'
import { useLocation, useNavigate } from 'react-router'
import * as Yup from 'yup'
import { SlatwalApiService } from '../../../services'
import { toast } from 'react-toastify'
import { errorLogin, receiveLogin, receiveUser, receiveCart, getWishLists, requestLogin, requestUser, requestCart, evictAllPages } from '../../../actions/'
import { getErrorMessage } from '../../../utils'
import { receiveSubscriptionCart, requestSubscriptionCart } from '../../../actions/subscriptionCartActions'

const useLoginForm = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  let loc = useLocation()
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      loginEmail: '',
      loginPassword: '',
    },
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      loginEmail: Yup.string().email('Invalid email').required('Required'),
      loginPassword: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      dispatch(evictAllPages())
      dispatch(requestLogin())
      dispatch(requestUser())
      dispatch(requestCart())
      dispatch(requestSubscriptionCart())

      const payload = {
        emailAddress: values.loginEmail,
        password: values.loginPassword,
        returnJSONObjects: 'account,cart,orderTemplateCart',
      }

      SlatwalApiService.auth.login(payload).then(response => {
        if (response.isSuccess() && (response.success().errors === undefined || response.success().errors === null)) {
          dispatch(receiveLogin({ isAuthenticanted: true }))
          dispatch(receiveUser(response.success().account))
          dispatch(receiveCart(response.success().cart))
          dispatch(receiveSubscriptionCart(response.success()?.orderTemplateCart))
          dispatch(getWishLists())
          toast.success(t('frontend.account.auth.success'))
          if (loc.search.includes('redirect=')) {
            const params = queryString.parse(loc.search)
            navigate({
              pathname: params.redirect,
            })
          } else {
            navigate({
              pathname: '/my-account/overview',
            })
          }
        } else {
          let errorMessage = response.isSuccess() && response.success() && Object.keys(response.success()?.errors || {}).length ? getErrorMessage(response.success().errors) : t('frontend.account.auth.failure')
          if (errorMessage) toast.error(errorMessage)
          dispatch(errorLogin())
        }
        formik.setSubmitting(false)
      })
    },
  })

  return { formik }
}

export { useLoginForm }
