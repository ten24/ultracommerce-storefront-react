import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import { useEffect, useState } from 'react'
import { SlatwalApiService } from '../../../services'
import { SwSelect } from '../../'
const EditSubscriptionScheduleDateModal = ({ apply, scheduleDateValue, setScheduleDateValue, skip, handleSkipDelivery, setOtherScheduleDateChangeReasonNote, otherScheduleDateChangeReasonNote, scheduleDateChangeReasonType, setScheduleDateChangeReasonType }) => {
  const { t } = useTranslation()
  const [scheduleDateChangeReasonTypeOptions, setScheduleDateChangeReasonTypeOptions] = useState([])
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    let didCancel = false
    if (!isLoaded) {
      SlatwalApiService.orderTemplate.getScheduleDateChangeReasonTypeOptions({}).then(response => {
        if (response.isSuccess() && !didCancel && response.success().scheduleDateChangeReasonTypeOptions) {
          var data = [{ name: '', value: '' }, ...response.success().scheduleDateChangeReasonTypeOptions]
          setScheduleDateChangeReasonTypeOptions(data.map(({ name, value }) => ({ key: name, value: value })))
          setLoaded(true)
        } else {
          setScheduleDateChangeReasonTypeOptions([])
          setLoaded(false)
        }
      })
    }

    return () => {
      didCancel = true
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="frequencyTerm_termName">{t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.reasonTypeText')}</label>
            <SwSelect id="frequencyTerm_termName" options={scheduleDateChangeReasonTypeOptions} disabled={skip ? 'disabled' : ''} onChange={e => setScheduleDateChangeReasonType(e.target.value)} value={scheduleDateChangeReasonType} />
            {!scheduleDateChangeReasonType && apply ? <span className="form-error-msg">{t('frontend.core.required')}</span> : null}
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="otherScheduleDateChangeReasonNote">{t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.reasonNote')}</label>
            <input className="form-control" type="text" id="otherScheduleDateChangeReasonNote" value={otherScheduleDateChangeReasonNote} onChange={e => setOtherScheduleDateChangeReasonNote(e.target.value)} />
            {!otherScheduleDateChangeReasonNote && (skip || apply) ? <span className="form-error-msg">{t('frontend.core.required')}</span> : null}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="frequencyTerm_scheduleDate">{t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.inputTitle')}</label>
            <DatePicker className="form-control" id="frequencyTerm_scheduleDate" selected={scheduleDateValue} onChange={date => setScheduleDateValue(date)} minDate={new Date()} disabled={skip ? 'disabled' : ''} />
            {!scheduleDateValue && apply ? <span className="form-error-msg">{t('frontend.core.required')}</span> : null}
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary btn-block mt-2 d-block m-auto"
        type="button"
        onClick={() => {
          handleSkipDelivery(false)
        }}
      >
        <span className="d-sm-inline">{t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.buttonTitle')}</span>
      </button>

      <hr className="hr-text" data-content={t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.orText')} />

      <button
        className="btn btn-skip-delivery btn-block mt-2 d-block m-auto"
        type="button"
        onClick={() => {
          handleSkipDelivery(true)
        }}
      >
        <span className="d-sm-inline">{t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.skipDeliveryText')}</span>
      </button>
    </>
  )
}
export { EditSubscriptionScheduleDateModal }
