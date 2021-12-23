import { useDispatch, useSelector } from 'react-redux'
import { useCreateOrEditAccountAddress } from '../../../hooks/'
import { AccountContent, AccountLayout, SwSelect, TextInput, Button } from '../../'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { useState } from 'react'
import { receiveUser, requestUser } from '../../../actions'
import { SlatwalApiService } from '../../../services'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../../utils'
import { useHistory } from 'react-router'
import { getDefaultCountry } from '../../../selectors'

const CreateOrEditAccountAddress = ({ path, heading, action = 'Account Address' }) => {
  const dispatch = useDispatch()
  const [billingAddressErrors, setBillingAddressErrors] = useState({})
  let [isFetching, setFetching] = useState(false)
  const history = useHistory()
  const countryCode = useSelector(getDefaultCountry)

  const { t } = useTranslation()

  const { countryCodeOptions, stateCodeOptions, isEdit, billingAddress, setBillingAddress } = useCreateOrEditAccountAddress(path)
  const addNewAccountAddress = address => {
    dispatch(requestUser())
    SlatwalApiService.account.addAddress({ ...address, returnJSONObjects: 'account' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Account Address Save Successful')
        dispatch(receiveUser(response.success().account))
        setTimeout(() => {
          history.push('/my-account/addresses')
        }, 2000)
      } else {
        dispatch(receiveUser({}))
        toast.error('Error')
      }
      setFetching(false)
    })
  }

  const updateAccountAddress = address => {
    dispatch(requestUser())
    delete address.addressID
    SlatwalApiService.account.updateAddress({ ...address, returnJSONObjects: 'account' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success('Update Successful')
        dispatch(receiveUser(response.success().account))
        setTimeout(() => {
          history.push('/my-account/addresses')
        }, 2000)
      } else {
        dispatch(receiveUser({}))
        toast.error('Update Failed')
      }
      setFetching(false)
    })
  }

  const verifyOnSubmit = address => {
    try {
      Yup.object()
        .shape({
          accountAddressName: Yup.string().required('Required'),
          name: Yup.string().required('Required'),
          streetAddress: Yup.string().required('Required'),
          city: Yup.string().required('Required'),
          stateCode: Yup.string().required('Required'),
          postalCode: Yup.string().required('Required'),
        })
        .validateSync(address, { abortEarly: false })
      return true
    } catch (err) {
      setBillingAddressErrors(
        err.inner.reduce((acc, { path, message }) => {
          return {
            ...acc,
            [path]: { path, message },
          }
        }, billingAddressErrors)
      )
    }
    return false
  }

  const requiredValidation = async ({ value, name, msg }) => {
    return await Yup.string()
      .required(msg)
      .validate(value, { abortEarly: false })
      .then(() => {
        let newErrors = { ...billingAddressErrors }
        delete newErrors[name]
        setBillingAddressErrors(newErrors)
      })
      .catch(err => {
        setBillingAddressErrors(
          err.inner.reduce((acc, { message }) => {
            return {
              ...acc,
              [name]: { path: name, message },
            }
          }, billingAddressErrors)
        )
      })
  }

  return (
    <AccountLayout title={`Add ${action}`}>
      <AccountContent />
      <h2 className="h3 mb-3">{isEdit ? t('frontend.account.address.edit') : t('frontend.account.address.add')}</h2>
      <form>
        <div className="row"></div>
        <h2>{heading}</h2>
        <div className="row">
          <div className="col-md-6">
            <TextInput
              name={billingAddress.accountAddressName}
              label={t('frontend.account.nickname')}
              value={billingAddress.accountAddressName}
              isError={!!billingAddressErrors?.accountAddressName}
              errorMessage={billingAddressErrors?.accountAddressName?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  accountAddressName: value,
                })
              }}
              onBlur={value => requiredValidation({ value, name: 'accountAddressName', msg: t('frontend.core.required') })}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <TextInput
              name={billingAddress.name}
              label={t('frontend.account.name')}
              value={billingAddress.name}
              isError={!!billingAddressErrors?.name}
              errorMessage={billingAddressErrors?.name?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  name: value,
                })
              }}
              onBlur={value => requiredValidation({ value, name: 'name', msg: t('frontend.core.required') })}
            />
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="countryCode">{t('frontend.account.countryCode')}</label>
              <SwSelect
                id="countryCode"
                value={billingAddress.countryCode || countryCode}
                onChange={e => {
                  e.preventDefault()
                  setBillingAddress({
                    ...billingAddress,
                    countryCode: e.target.value,
                    stateCode: null,
                  })
                }}
                options={countryCodeOptions}
                onBlur={value => requiredValidation({ value, name: 'countryCode', msg: t('frontend.core.required') })}
              />
              {!!billingAddressErrors.countryCode && <span className="form-error-msg">{billingAddressErrors.countryCode}</span>}
            </div>
          </div>

          <div className="col-md-6">
            <TextInput
              name={billingAddress.streetAddress}
              label={t('frontend.account.streetAddress')}
              value={billingAddress.streetAddress}
              isError={!!billingAddressErrors?.streetAddress}
              errorMessage={billingAddressErrors?.streetAddress?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  streetAddress: value,
                })
              }}
              onBlur={value => requiredValidation({ value, name: 'streetAddress', msg: t('frontend.core.required') })}
            />
          </div>
          <div className="col-md-6">
            <TextInput
              name={billingAddress.street2Address}
              label={t('frontend.account.street2Address')}
              value={billingAddress.street2Address}
              isError={!!billingAddressErrors?.street2Address}
              errorMessage={billingAddressErrors?.street2Address?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  street2Address: value,
                })
              }}
              // onBlur={value => requiredValidation({ value, name: 'street2Address', msg: t('frontend.core.required') })}
            />
          </div>
          <div className="col-md-6">
            <TextInput
              name={billingAddress.city}
              label={t('frontend.account.city')}
              value={billingAddress.city}
              isError={!!billingAddressErrors?.city}
              errorMessage={billingAddressErrors?.city?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  city: value,
                })
              }}
              onBlur={value => requiredValidation({ value, name: 'city', msg: t('frontend.core.required') })}
            />
          </div>
          <div className="col-md-3">
            {stateCodeOptions[billingAddress.countryCode] && stateCodeOptions[billingAddress.countryCode].length > 0 && (
              <div className="form-group">
                <label htmlFor="stateCode">{t('frontend.account.stateCode')}</label>
                <SwSelect
                  id="stateCode"
                  value={billingAddress.stateCode}
                  onChange={e => {
                    setBillingAddress({
                      ...billingAddress,
                      stateCode: e.target.value,
                    })
                  }}
                  onBlur={value => requiredValidation({ value, name: 'stateCode', msg: t('frontend.core.required') })}
                  options={stateCodeOptions[billingAddress.countryCode]}
                />
                {!!billingAddressErrors.stateCode && <span className="form-error-msg">{billingAddressErrors.stateCode}</span>}
              </div>
            )}

            {(!stateCodeOptions[billingAddress.countryCode] || stateCodeOptions[billingAddress.countryCode].length < 1) && (
              <TextInput
                name={billingAddress.stateCode}
                label={t('frontend.account.stateCode')}
                value={billingAddress.stateCode}
                isError={!!billingAddressErrors?.stateCode}
                errorMessage={billingAddressErrors?.stateCode?.message}
                onChange={value => {
                  setBillingAddress({
                    ...billingAddress,
                    stateCode: value,
                  })
                }}
                onBlur={value => requiredValidation({ value, name: 'stateCode', msg: t('frontend.core.required') })}
              />
            )}
          </div>
          <div className="col-md-3">
            <TextInput
              name={billingAddress.postalCode}
              label={t('frontend.account.postalCode')}
              value={billingAddress.postalCode}
              isError={!!billingAddressErrors?.postalCode}
              errorMessage={billingAddressErrors?.postalCode?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  postalCode: value,
                })
              }}
              onBlur={value => requiredValidation({ value, name: 'postalCode', msg: t('frontend.core.required') })}
            />
          </div>
          <div className="col-md-6">
            <TextInput
              name={billingAddress.emailAddress}
              label={t('frontend.account.emailAddress')}
              value={billingAddress.emailAddress}
              isError={!!billingAddressErrors?.emailAddress}
              errorMessage={billingAddressErrors?.emailAddress?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  emailAddress: value,
                })
              }}
              onBlur={value => {
                return null
              }}
            />
          </div>
          <div className="col-md-6">
            <TextInput
              name={billingAddress.phoneNumber}
              label={t('frontend.account.phoneNumber')}
              value={billingAddress.phoneNumber}
              isError={!!billingAddressErrors?.phoneNumber}
              errorMessage={billingAddressErrors?.phoneNumber?.message}
              onChange={value => {
                setBillingAddress({
                  ...billingAddress,
                  phoneNumber: value,
                })
              }}
              onBlur={value => requiredValidation({ value, name: 'phoneNumber', msg: t('frontend.core.required') })}
            />
          </div>
        </div>

        <div className="col-12">
          <hr className="mt-5 mb-5" />
          <div className="d-flex flex-wrap justify-content-end">
            <Button
              disabled={isFetching}
              isLoading={isFetching}
              label={isEdit ? `${t('frontend.core.save')} ${action}` : `${t('frontend.core.saveNew')} ${action}`}
              classList="btn btn-primary mt-3 mt-sm-0"
              onClick={() => {
                if (verifyOnSubmit(billingAddress)) {
                  setFetching(true)
                  if (isEdit) updateAccountAddress(billingAddress)
                  if (!isEdit) addNewAccountAddress(billingAddress)
                }
              }}
            />
          </div>
        </div>
      </form>
    </AccountLayout>
  )
}

export { CreateOrEditAccountAddress }
