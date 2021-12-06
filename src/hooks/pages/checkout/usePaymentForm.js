import { useFormik } from 'formik'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { receiveUser } from '../../../actions'
import { SlatwalApiService } from '../../../services'
import { getErrorMessage } from '../../../utils'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

const validationSchema = Yup.object({
  creditCardNumber: Yup.string().required('Required'),
  nameOnCreditCard: Yup.string().required('Required'),
  billingAddress: Yup.object({
    postalCode: Yup.string().required('Required'),
    stateCode: Yup.string().required('Required'),
    streetAddress: Yup.string().required('Required'),
    name: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
  }),
})

export const usePaymentForm = () => {
  const [formStatus, setFormStatus] = useState({ status: false, error: '' })
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const initialValues = {
    accountPaymentMethodName: '',
    paymentMethodType: 'creditCard',
    creditCardNumber: '',
    nameOnCreditCard: '',
    expirationMonth: dayjs().add(1, 'month').format('MM'),
    expirationYear: dayjs().add(1, 'month').format('YYYY'),
    securityCode: '',
    billingAccountAddress: {
      accountAddressID: '',
    },
    billingAddress: {
      countryCode: 'US',
      name: '',
      company: '',
      phoneNumber: '',
      emailAddress: '',
      streetAddress: '',
      street2Address: '',
      city: '',
      stateCode: '',
      postalCode: '',
    },
  }

  const apiHandler = payload => {
    SlatwalApiService.account.addPaymentMethod(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) {
        const errorMsg = getErrorMessage(response.success().errors)
        setFormStatus(() => ({ status: false, error: errorMsg }))
        toast.error(errorMsg)
      }
      if (response.isSuccess()) {
        if (response.success()?.failureActions.length) {
          dispatch(receiveUser())
          toast.error(JSON.stringify(response.success().errors))
          setFormStatus(() => ({ state: false, error: response.success().errors }))
        } else {
          toast.success(t('frontend.account.card.success'))
          dispatch(receiveUser(response.success().account))
          setFormStatus(() => ({ status: true, error: '' }))
        }
      } else {
        toast.error(t('frontend.account.card.error'))
        setFormStatus(() => ({ state: false, error: 'Save Failed' }))
      }
    })
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      formik.validateForm()
      // TODO: Dispatch Actions
      if (values.billingAccountAddress.accountAddressID.length) {
        delete values.billingAddress.countryCode
        delete values.billingAddress.name
        delete values.billingAddress.company
        delete values.billingAddress.phoneNumber
        delete values.billingAddress.emailAddress
        delete values.billingAddress.streetAddress
        delete values.billingAddress.street2Address
        delete values.billingAddress.city
        delete values.billingAddress.stateCode
        delete values.billingAddress.postalCode
      }
      const payload = { ...values, returnJSONObjects: 'account' }
      apiHandler(payload)
    },
  })
  return { formik, formStatus }
}
