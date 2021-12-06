import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { addPayment } from '../../../actions'
import { SlatwalApiService } from '../../../services'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../../utils'
import { useCheckoutUtilities } from './useCheckoutUtilities'
import dayjs from 'dayjs'

/* see: userAction addPaymentMethod */

const useCreditCard = ({ onSubmit }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const billingAccountAddress = useSelector(state => state.cart.billingAccountAddress)
  const { CREDIT_CARD } = useCheckoutUtilities()
  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      creditCardNumber: '',
      nameOnCreditCard: '',
      expirationMonth: dayjs().add(1, 'month').format('MM'),
      expirationYear: dayjs().add(1, 'month').format('YYYY'),
      securityCode: '',
      accountPaymentMethodName: '',
      accountAddressID: billingAccountAddress ? billingAccountAddress.accountAddressID : '',
      saveShippingAsBilling: false,
      savePaymentMethodToAccount: false,
      returnJSONObjects: 'cart',
    },
    onSubmit: values => {
      let payload = {
        accountPaymentMethodName: values.accountPaymentMethodName,
        paymentMethodType: 'creditCard',
        nameOnCreditCard: values.nameOnCreditCard,
        creditCardNumber: values.creditCardNumber,
        expirationMonth: values.expirationMonth,
        expirationYear: values.expirationYear,
        securityCode: values.securityCode,
        billingAccountAddress: {
          accountAddressID: values.accountAddressID,
        },
      }
      if (values.saveShippingAsBilling) {
        payload.newOrderPayment['saveShippingAsBilling'] = 1
        delete payload.newOrderPayment.accountAddressID
      }

      addPaymentMethodAndSetAsPayment(payload).then(() => {
        onSubmit()
      })
    },
  })

  let validCreditCard = formik.values.nameOnCreditCard.length > 0 && formik.values.creditCardNumber.length > 0 && formik.values.securityCode.length > 0

  const addCreditCardToOrder = value => {
    dispatch(
      addPayment({
        newOrderPayment: {
          accountAddressID: value,
          nameOnCreditCard: formik.values.nameOnCreditCard,
          creditCardNumber: formik.values.creditCardNumber,
          expirationMonth: formik.values.expirationMonth,
          expirationYear: formik.values.expirationYear,
          securityCode: formik.values.securityCode,
          paymentMethod: {
            paymentMethodID: CREDIT_CARD,
          },
        },
      })
    )
  }

  const addAccountAndSetAsBillingAddress = values => {
    const payload = {
      name: values.name,
      streetAddress: values.streetAddress,
      street2Address: values.street2Address,
      city: values.city,
      statecode: values.stateCode,
      postalcode: values.postalCode,
      countrycode: values.countryCode,
      returnJSONObjects: 'account',
    }

    SlatwalApiService.cart.addEditAccountAndSetAsBillingAddress(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(
          addPayment({
            newOrderPayment: {
              nameOnCreditCard: formik.values.nameOnCreditCard,
              creditCardNumber: formik.values.creditCardNumber,
              expirationMonth: formik.values.expirationMonth,
              expirationYear: formik.values.expirationYear,
              securityCode: formik.values.securityCode,
              paymentMethod: {
                paymentMethodID: CREDIT_CARD,
              },
            },
          })
        )
      }
    })
  }
  // and payment with new single use CC and Single use address
  const addSingleUseCreditCardAndSingleUseAddress = values => {
    dispatch(
      addPayment({
        newOrderPayment: {
          billingAddress: {
            name: values.name,
            streetAddress: values.streetAddress,
            street2Address: values.street2Address,
            city: values.city,
            statecode: values.stateCode,
            postalcode: values.postalCode,
            countrycode: values.countryCode,
          },
          nameOnCreditCard: formik.values.nameOnCreditCard,
          creditCardNumber: formik.values.creditCardNumber,
          expirationMonth: formik.values.expirationMonth,
          expirationYear: formik.values.expirationYear,
          securityCode: formik.values.securityCode,
          paymentMethod: {
            paymentMethodID: CREDIT_CARD,
          },
        },
      })
    )
  }

  const addPaymentMethodAndSetAsPayment = newPaymentMethod => {
    return SlatwalApiService.account.addPaymentMethod({ ...newPaymentMethod, returnJSONObjects: 'account' }).then(response => {
      if (response.isSuccess()) {
        const { accountPaymentMethod } = response.success()
        dispatch(addPayment({ accountPaymentMethodID: accountPaymentMethod.accountPaymentMethodID }))
      } else {
        toast.error(t('frontend.core.save_failed'))
      }
    })
  }

  const saveShippingAsBilling = e => {
    e.preventDefault()
    //TODO: BROKEN
    if (formik.values.savePaymentMethodToAccount && formik.values.saveShippingAsBilling) {
      // Create account Payment and use cloned shpiing address
      // Payment with Account  CC
    } else {
      // Payment with Single use CC and address cloned from billing
      //  TODO: broken
      dispatch(
        addPayment({
          newOrderPayment: {
            saveShippingAsBilling: 1,
            nameOnCreditCard: formik.values.nameOnCreditCard,
            creditCardNumber: formik.values.creditCardNumber,
            expirationMonth: formik.values.expirationMonth,
            expirationYear: formik.values.expirationYear,
            securityCode: formik.values.securityCode,
            paymentMethod: {
              paymentMethodID: CREDIT_CARD,
            },
          },
        })
      )
    }
  }
  return { formik, validCreditCard, addCreditCardToOrder, addAccountAndSetAsBillingAddress, addSingleUseCreditCardAndSingleUseAddress, saveShippingAsBilling }
}

export { useCreditCard }
