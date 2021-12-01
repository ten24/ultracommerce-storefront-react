import { AccountLayout, AccountContent } from '../../'
import { useTranslation } from 'react-i18next'
import { useAccountProfile } from '../../../hooks'
import { Link } from 'react-router-dom'

const AccountProfile = ({ crumbs, title, contentBody, contentTitle }) => {
  const { t } = useTranslation()
  const { formik } = useAccountProfile()

  return (
    <AccountLayout crumbs={crumbs} title={title}>
      <AccountContent />

      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="accountFirstName">{t('frontend.account.first_name')}</label>
              <input className="form-control" type="text" id="accountFirstName" value={formik.values.accountFirstName} onChange={formik.handleChange} />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="accountLastName">{t('frontend.account.last_name')}</label>
              <input className="form-control" type="text" id="accountLastName" value={formik.values.accountLastName} onChange={formik.handleChange} />
            </div>
          </div>
          <div className="col-sm-6 mt-1">
            <div className="form-group">
              <label htmlFor="accountEmailAddress">{t('frontend.account.email')}</label>
              <input className="form-control" type="email" id="accountEmailAddress" value={formik.values.accountEmailAddress} onChange={formik.handleChange} disabled="disabled" />
            </div>
          </div>
          {/* <div className="col-sm-4">
            <div className="form-group">
              <label htmlFor="accountPhoneNumber">Phone Number</label>
              <input className="form-control" type="text" id="accountPhoneNumber" value={formik.values.accountPhoneNumber} onChange={formik.handleChange} required="" />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label htmlFor="accountExt">Ext.</label>
              <input className="form-control" type="text" id="accountExt" value={formik.values.accountExt} onChange={formik.handleChange} required="" />
            </div>
          </div> */}
          <div className="col-sm-6 mt-1">
            <div className="form-group">
              <label htmlFor="accountCompany">{t('frontend.account.company')}</label>
              <input className="form-control" value={formik.values.accountCompany} type="text" onChange={formik.handleChange} id="accountCompany" />
            </div>
          </div>
          <div className="col-12 mt-2 d-flex justify-content-end">
            <Link className="btn btn-secondary mt-3 mt-sm-0 mr-3" to="/my-account/updatePassword">
              {t('frontend.account.password_update')}
            </Link>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary btn-lg mt-3">
              {t('frontend.core.save')}
            </button>
          </div>
        </div>
      </form>
    </AccountLayout>
  )
}

export { AccountProfile }
