import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getCountries, getStateCodeOptionsByCountryCode } from '../../../actions'
import { useState } from 'react'
import { useDeepCompareEffect } from 'react-use'

const initialBillingAddress = {
  countryCode: 'US',
  accountAddressName: '',
  name: '',
  company: '',
  phoneNumber: '',
  emailAddress: '',
  streetAddress: '',
  street2Address: '',
  city: '',
  stateCode: '',
  postalCode: '',
}
const useCreateOrEditAccountAddress = path => {
  const dispatch = useDispatch()
  const [billingAddress, setBillingAddress] = useState(initialBillingAddress)
  const accountAddresses = useSelector(state => state.userReducer.accountAddresses)
  const countryCodeOptions = useSelector(state => state.content.countryCodeOptions)
  const stateCodeOptions = useSelector(state => state.content.stateCodeOptions)
  const filteredAddress = accountAddresses.filter(address => address.address.addressID === path)
  const isEdit = filteredAddress.length ? true : false
  const { accountAddressID, accountAddressName, address } = filteredAddress.length ? filteredAddress[0] : {}
  useDeepCompareEffect(() => {
    setBillingAddress({ accountAddressID, accountAddressName, ...address })
  }, [dispatch, accountAddressID, accountAddressName, address])

  useEffect(() => {
    if (countryCodeOptions.length < 1) {
      dispatch(getCountries())
    }
  }, [dispatch, countryCodeOptions])
  useEffect(() => {
    dispatch(getStateCodeOptionsByCountryCode(billingAddress.countryCode))
  }, [dispatch, billingAddress?.countryCode])
  return { countryCodeOptions, stateCodeOptions, isEdit, billingAddress, setBillingAddress }
}

export { useCreateOrEditAccountAddress }
