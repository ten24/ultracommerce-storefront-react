import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCountries, getStateCodeOptionsByCountryCode } from '../../../actions/'
import { useFormik } from 'formik'

let initialBillingAddressValues = {
  name: '',
  company: '',
  streetAddress: '',
  street2Address: '',
  city: '',
  stateCode: '',
  emailAddress: '',
  postalCode: '',
  countryCode: 'US',
  accountAddressName: '',
  saveAddress: false,
  blindShip: false,
}
const useBillingAddress = ({ onSave, initialValues = initialBillingAddressValues }) => {
  const dispatch = useDispatch()
  const isFetching = useSelector(state => state.content.isFetching)
  const countryCodeOptions = useSelector(state => state.content.countryCodeOptions)
  const stateCodeOptions = useSelector(state => state.content.stateCodeOptions)
  const [isEdit, setEdit] = useState(true)

  const formik = useFormik({
    enableReinitialize: false,
    initialValues: initialValues,
    onSubmit: values => {
      setEdit(!isEdit)
      onSave(values)
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

  return { initialBillingAddressValues, formik, isEdit }
}

export { useBillingAddress }
