import { SlatwalApiService } from '../../../services'
import { useTranslation } from 'react-i18next'
import { SwSelect } from '../../'
import { useEffect, useState } from 'react'

const EditSubscriptionFrequencyDateModal = ({ updateFrequency, frequencyTerm, setFrequencyTerm, orderInfo }) => {
  const { t } = useTranslation()
  const [frequencyTermOptions, setfrequencyTermOptions] = useState([])
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    let didCancel = false
    if (!isLoaded) {
      SlatwalApiService.orderTemplate.getFrequencyTermOptions({}).then(response => {
        if (response.isSuccess() && !didCancel && response.success().frequencyTermOptions) {
          setfrequencyTermOptions(response.success().frequencyTermOptions.map(({ name, value }) => ({ key: name, value: value })))
          setLoaded(true)
        } else {
          setfrequencyTermOptions([])
          setLoaded(false)
        }
      })
    }

    return () => {
      didCancel = true
    }
    // eslint-disable-next-line
  }, [])

  const handleSubmit = event => {
    event.preventDefault()
    updateFrequency()
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="frequencyTerm_termName">{t('frontend.account.scheduled.delivery.detail.toolbar.frequencyModal.inputTitle')}</label>
              <SwSelect
                id="frequencyTerm_termName"
                value={frequencyTerm}
                onChange={e => {
                  setFrequencyTerm(e.target.value)
                }}
                options={frequencyTermOptions}
              />
            </div>
          </div>
        </div>

        <button className="btn btn-primary btn-block mt-2 d-block m-auto" type="submit">
          <span className="d-sm-inline">{t('frontend.account.scheduled.delivery.frequencyModal.submit')}</span>
        </button>
      </form>
    </>
  )
}
export { EditSubscriptionFrequencyDateModal }
