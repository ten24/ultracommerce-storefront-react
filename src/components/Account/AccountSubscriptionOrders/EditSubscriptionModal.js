import { useTranslation } from 'react-i18next'

const EditSubscriptionModal = ({ formik }) => {
  const { t } = useTranslation()

  return (
    <>
      <form name="add-review" onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="subscriptionName">{t('frontend.account.scheduled.delivery.detail.toolbar.subscriptionModal.nameInputLabel')}</label>
              <input className="form-control" type="text" id="subscriptionName" value={formik.values.subscriptionName} onChange={formik.handleChange} required />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block mt-2 d-block m-auto">
          <span className="d-sm-inline">{t('frontend.account.scheduled.delivery.detail.toolbar.subscriptionModal.saveButton')}</span>
        </button>
      </form>
    </>
  )
}
export { EditSubscriptionModal }
