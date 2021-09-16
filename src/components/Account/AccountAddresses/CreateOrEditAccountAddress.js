import { useDispatch } from 'react-redux'
import { useCreateOrEditAccountAddress } from '../../../hooks/'
import { AccountContent, AccountLayout, SwSelect } from '../../'
import { useTranslation } from 'react-i18next'
import { getStateCodeOptionsByCountryCode } from '../../../actions/'

const CreateOrEditAccountAddress = ({ path, heading, redirectLocation = '/my-account/addresses', customBody, contentTitle, action = 'Account Address' }) => {
  const dispatch = useDispatch()

  const { t } = useTranslation()

  const { formik, countryCodeOptions, stateCodeOptions, isEdit } = useCreateOrEditAccountAddress({ path, redirectLocation })
  return (
    <AccountLayout title={`Add ${action}`}>
      <AccountContent customBody={customBody} contentTitle={contentTitle} />
      <h2 className="h3 mb-3">{isEdit ? t('frontend.account.address.edit') : t('frontend.account.address.add')}</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="row"></div>
        <h2>{heading}</h2>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="countryCode">{t('frontend.account.countryCode')}</label>
              <SwSelect
                id="countryCode"
                value={formik.values.countryCode}
                onChange={e => {
                  e.preventDefault()
                  dispatch(getStateCodeOptionsByCountryCode(e.target.value))
                  formik.handleChange(e)
                }}
                options={countryCodeOptions}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="name">{t('frontend.account.name')}</label>
              <input className="form-control" type="text" id="name" value={formik.values['name']} onChange={formik.handleChange} />
              {formik.errors.name && <span className="form-error-msg">{formik.errors.name}</span>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="company">{t('frontend.account.company')}</label>
              <input className="form-control" type="text" id="company" value={formik.values['company']} onChange={formik.handleChange} />
              {formik.errors.company && <span className="form-error-msg">{formik.errors.company}</span>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="phoneNumber">{t('frontend.account.phoneNumber')} </label>
              <input className="form-control" type="text" id="phoneNumber" value={formik.values['phoneNumber']} onChange={formik.handleChange} />
              {formik.errors.emailAddress && <span className="form-error-msg">{formik.errors.emailAddress}</span>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="emailAddress">{t('frontend.account.emailAddress')} </label>
              <input className="form-control" type="text" id="emailAddress" value={formik.values['emailAddress']} onChange={formik.handleChange} />
              {formik.errors.emailAddress && <span className="form-error-msg">{formik.errors.emailAddress}</span>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="streetAddress">{t('frontend.account.streetAddress')}</label>
              <input className="form-control" type="text" id="streetAddress" value={formik.values['streetAddress']} onChange={formik.handleChange} />
              {formik.errors.streetAddress && <span className="form-error-msg">{formik.errors.streetAddress}</span>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="street2Address">{t('frontend.account.street2Address')}</label>
              <input className="form-control" type="text" id="street2Address" value={formik.values['street2Address']} onChange={formik.handleChange} />
              {formik.errors.street2Address && <span className="form-error-msg">{formik.errors.street2Address}</span>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="city">{t('frontend.account.city')}</label>
              <input className="form-control" type="text" id="city" value={formik.values['city']} onChange={formik.handleChange} />
              {formik.errors.city && <span className="form-error-msg">{formik.errors.city}</span>}
            </div>
          </div>
          <div className="col-md-3">
            {stateCodeOptions[formik.values.countryCode] && stateCodeOptions[formik.values.countryCode].length > 0 && (
              <div className="form-group">
                <label htmlFor="stateCode">{t('frontend.account.stateCode')}</label>
                <SwSelect
                  id="stateCode"
                  value={formik.values['stateCode']}
                  onChange={e => {
                    e.preventDefault()
                    formik.handleChange(e)
                  }}
                  options={stateCodeOptions[formik.values.countryCode]}
                />
                {formik.errors.stateCode && <span className="form-error-msg">{formik.errors.stateCode}</span>}
              </div>
            )}
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="postalCode">{t('frontend.account.postalCode')}</label>
              <input className="form-control" type="text" id="postalCode" value={formik.values['postalCode']} onChange={formik.handleChange} />
              {formik.errors.postalCode && <span className="form-error-msg">{formik.errors.postalCode}</span>}
            </div>
          </div>
        </div>

        <div className="col-12">
          <hr className="mt-5 mb-5" />
          <div className="d-flex flex-wrap justify-content-end">
            <button type="submit" className="btn btn-primary mt-3 mt-sm-0">
              {isEdit ? `${t('frontend.core.save')} ${action}` : `${t('frontend.core.saveNew')} ${action}`}
            </button>
          </div>
        </div>
      </form>
    </AccountLayout>
  )
}

export { CreateOrEditAccountAddress }
