import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCountries, getStateCodeOptionsByCountryCode } from '../../../actions'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { getDefaultCountry } from '../../../selectors/configurationSelectors'

let initialFulfilmentAddressValues = {
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
const useFulfilmentAddress = ({ onSave }) => {
  const dispatch = useDispatch()
  const isFetching = useSelector(state => state.content.isFetching)
  const countryCodeOptions = useSelector(state => state.content.countryCodeOptions)
  const stateCodeOptions = useSelector(state => state.content.stateCodeOptions)
  const [isEdit, setEdit] = useState(true)
  const countryCode = useSelector(getDefaultCountry)

  const formik = useFormik({
    enableReinitialize: false,
    initialValues: { ...initialFulfilmentAddressValues, countryCode },
    validationSchema: yup.object({
      name: yup.string().required('Required field'),
      streetAddress: yup.string().required('Required field'),
      city: yup.string().required('Required field'),
      stateCode: yup.string().required('Required field'),
      postalCode: yup.string().required('Required field'),
    }),
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

  return { initialFulfilmentAddressValues, formik, isEdit }
}

export { useFulfilmentAddress }
