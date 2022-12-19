import { SlatwalApiService } from '../../../services'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { SwSelect } from '../../'
const CancelSubscriptionModal = ({ formik, cancel, setCancel, orderInfo, showCancelSubscriptionModal, setCancelSubscriptionModal, handleSkipDeliveryOnCancel }) => {
  const [cancellationReasons, setCancellationReasons] = useState([])
  const [isLoaded, setLoaded] = useState(false)
  useEffect(() => {
    let didCancel = false
    if (!isLoaded) {
      SlatwalApiService.orderTemplate.getCancellationReasonTypeOptions({}).then(response => {
        if (response.isSuccess() && !didCancel && response.success().cancellationReasonTypeOptions) {
          var data = [{ name: '', value: '' }, ...response.success().cancellationReasonTypeOptions]
          setCancellationReasons(data.map(({ name, value }) => ({ key: name, value: value })))
          setCancel('')
          formik.resetForm()
          setLoaded(true)
        } else {
          setCancellationReasons([])
          setLoaded(false)
        }
      })
    }

    return () => {
      didCancel = true
    }
    // eslint-disable-next-line
  }, [])

  const { t } = useTranslation()
  return (
    <>
      <p>{t('frontend.account.scheduled.delivery.detail.toolbar.cancelModal.subHeading')}</p>

      <form name="add-review" onSubmit={formik.handleSubmit}>
        <button
          className="btn btn-skip-delivery btn-block mt-2 d-block m-auto"
          type="button"
          onClick={() => {
            handleSkipDeliveryOnCancel(true)
          }}
        >
          <span className="d-none d-sm-inline">{t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.skipDeliveryText')}</span>
        </button>
        <br />
        <div className="row">
          <div className="col-md-12">
            <label htmlFor="cancellationReason">{t('frontend.account.scheduled.delivery.detail.toolbar.cancelModal.nameInputLabel')}</label>
            <div className="form-group">
              <SwSelect
                id="cancellationReasonType"
                value={cancel}
                onChange={e => {
                  setCancel(e.target.value)
                }}
                options={cancellationReasons}
              />
              {!cancel ? <span className="form-error-msg">{t('frontend.core.required')}</span> : null}
            </div>
            <div className="form-group">
              <input className="form-control" type="text" id="cancellationReason" value={formik.values.cancellationReason} onChange={formik.handleChange} />
              {!formik.values.cancellationReason ? <span className="form-error-msg">{t('frontend.core.required')}</span> : null}
            </div>
          </div>
        </div>
        <button className="btn btn-primary btn-block mt-2 d-block m-auto">
          <span className=" d-sm-inline">{t('frontend.account.scheduled.delivery.detail.toolbar.subscriptionModal.saveButton')}</span>
        </button>
      </form>
    </>
  )
}
export { CancelSubscriptionModal }
