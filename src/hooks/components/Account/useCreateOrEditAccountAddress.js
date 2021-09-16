import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { useRedirect } from '../..'
import { addNewAccountAddress, updateAccountAddress } from '../../../actions'
import { useEffect } from 'react'
import { getCountries, getStateCodeOptionsByCountryCode } from '../../../actions'
import * as yup from 'yup'

const useCreateOrEditAccountAddress = ({ path, redirectLocation = '/my-account/addresses' }) => {
  const [redirect, setRedirect] = useRedirect({ location: redirectLocation })
  const dispatch = useDispatch()
  const accountAddresses = useSelector(state => state.userReducer.accountAddresses)
  const countryCodeOptions = useSelector(state => state.content.countryCodeOptions)
  const stateCodeOptions = useSelector(state => state.content.stateCodeOptions)
  const isFetching = useSelector(state => state.content.isFetching)
  const filteredAddress = accountAddresses.filter(address => address.address.addressID === path)
  const isEdit = filteredAddress.length ? true : false
  const accountAddress = filteredAddress.length ? filteredAddress[0] : null

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      accountAddressID: accountAddress ? accountAddress.accountAddressID : '',
      accountAddressName: accountAddress ? accountAddress.accountAddressName : '',
      countryCode: accountAddress ? accountAddress.address.countryCode : 'US',
      name: accountAddress ? accountAddress.address.name : '',
      company: accountAddress ? accountAddress.address.company : '',
      emailAddress: accountAddress ? accountAddress.address.emailAddress : '',
      phoneNumber: accountAddress ? accountAddress.address.phoneNumber : '',
      streetAddress: accountAddress ? accountAddress.address.streetAddress : '',
      street2Address: accountAddress ? accountAddress.address.street2Address : '',
      city: accountAddress ? accountAddress.address.city : '',
      stateCode: accountAddress ? accountAddress.address.stateCode : '',
      postalCode: accountAddress ? accountAddress.address.postalCode : '',
    },

    validationSchema: yup.object({
      name: yup.string().required('Required field'),
      streetAddress: yup.string().required('Required field'),
      city: yup.string().required('Required field'),
      stateCode: yup.string().required('Required field'),
      postalCode: yup.string().required('Required field'),
    }),
    onSubmit: values => {
      // TODO: Dispatch Actions
      if (isEdit) {
        dispatch(updateAccountAddress(values))
      } else {
        dispatch(addNewAccountAddress(values))
      }
      setRedirect({ ...redirect, shouldRedirect: true })
    },
  })

  useEffect(() => {
    if (countryCodeOptions.length === 0 && !isFetching) {
      dispatch(getCountries())
    }
    if (!stateCodeOptions[formik.values.countryCode] && !isFetching) {
      dispatch(getStateCodeOptionsByCountryCode(formik.values.countryCode))
    }
  }, [dispatch, formik, stateCodeOptions, countryCodeOptions, isFetching])

  return { formik, countryCodeOptions, stateCodeOptions, isEdit }
}

export { useCreateOrEditAccountAddress }
