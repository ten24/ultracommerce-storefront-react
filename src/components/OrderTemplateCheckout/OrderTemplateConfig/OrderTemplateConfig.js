import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SlideNavigation, Overlay, SwSelect } from '../..'
import { useTranslation } from 'react-i18next'
import { SlatwalApiService } from '../../../services'
import { useFormatDate } from '../../../hooks'
import DatePicker from 'react-datepicker'
import { toast } from 'react-toastify'
import { receiveSubscriptionCart } from '../../../actions'

const OrderTemplateConfig = ({ currentStep }) => {
  const subscriptionCart = useSelector(state => state.subscriptionCart)
  const { isFetching, orderTemplateID } = subscriptionCart
  const { t } = useTranslation()
  const [formateDate] = useFormatDate()
  const dispatch = useDispatch()
  const [frequencyTermOptions, setfrequencyTermOptions] = useState([])
  const [frequencyTerm, setFrequencyTerm] = useState('')
  const [orderTemplate, setOrderTemplate] = useState('')
  const [scheduleDateValue, setScheduleDateValue] = useState('')
  const saveOrderTemplateConfig = async => {
    if (orderTemplate !== '' && scheduleDateValue !== '' && frequencyTerm !== '') {
      saveSubscriptionName().then(() => {
        updateFrequency().then(() => {
          updateScheduleDate().then(() => {
            toast.success(t('frontend.account.scheduled.delivery.detail.toolbar.subscriptionModal.successMessage'))
          })
        })
      })
    }
  }

  const updateFrequency = async () => {
    return SlatwalApiService.orderTemplate.updateOrderTemplateFrequency({ orderTemplateID, frequencyTerm: { value: frequencyTerm }, returnJsonObjects: 'orderTemplateCart' })
  }

  const updateScheduleDate = async () => {
    return SlatwalApiService.orderTemplate
      .updateOrderTemplateSchedule({
        orderTemplateID,
        orderTemplateScheduleDateChangeReasonTypeID: '',
        otherScheduleDateChangeReasonNotes: '',
        scheduleOrderNextPlaceDateTime: scheduleDateValue,
        returnJsonObjects: 'orderTemplateCart',
      })
      .then(response => {
        dispatch(receiveSubscriptionCart(response.success().orderTemplateCart))
      })
  }

  const saveSubscriptionName = async () => {
    return SlatwalApiService.orderTemplate.editOrderTemplate({ orderTemplateID, orderTemplateName: orderTemplate })
  }

  useEffect(() => {
    if (subscriptionCart.frequencyTerm.termID.length > 0) {
      setFrequencyTerm(subscriptionCart.frequencyTerm.termID)
    } else if (frequencyTermOptions.length > 0) {
      setFrequencyTerm(frequencyTermOptions.at(0).value)
    }
    setOrderTemplate(subscriptionCart.orderTemplateName)
    setScheduleDateValue(subscriptionCart.scheduleOrderNextPlaceDateTime ? new Date(subscriptionCart.scheduleOrderNextPlaceDateTime) : new Date())
  }, [subscriptionCart.orderTemplateName, subscriptionCart.scheduleOrderNextPlaceDateTime, subscriptionCart.frequencyTerm.termID, frequencyTermOptions])

  useEffect(() => {
    let didCancel = false
    SlatwalApiService.orderTemplate.getFrequencyTermOptions({}).then(response => {
      if (response.isSuccess() && !didCancel && response.success().frequencyTermOptions) {
        setfrequencyTermOptions(response.success().frequencyTermOptions.map(({ name, value }) => ({ key: name, value: value })))
        if (!frequencyTerm) {
          setFrequencyTerm(response.success().frequencyTermOptions.at(0).value)
        }
      }
    })

    return () => {
      didCancel = true
    }
    // eslint-disable-next-line
  }, [])
  const allowedToContinue = subscriptionCart.orderTemplateName?.length > 0 && subscriptionCart.frequencyTerm?.termID.length > 0 && subscriptionCart.scheduleOrderNextPlaceDateTime?.length > 0
  return (
    <Overlay active={isFetching} spinner>
      <div className="row mb-3">
        <div className="col-sm-12">
          <h5>Confirm your subscription frequency </h5>
          <p> Your first shipment will ship on {formateDate(scheduleDateValue)} </p>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="subscriptionName">{t('frontend.account.scheduled.delivery.detail.toolbar.subscriptionModal.nameInputLabel')}</label>
                <input
                  className="form-control"
                  type="text"
                  id="subscriptionName"
                  value={orderTemplate}
                  onChange={e => {
                    setOrderTemplate(e.target.value)
                  }}
                />
              </div>
            </div>
            <div className="col-md-3">
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

            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="frequencyTerm_scheduleDate">{t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.inputTitle')}</label>
                <DatePicker className="form-control" id="frequencyTerm_scheduleDate" selected={scheduleDateValue} onChange={date => setScheduleDateValue(date)} minDate={scheduleDateValue} />
                {!scheduleDateValue ? <span className="form-error-msg">{t('frontend.core.required')}</span> : null}
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <button
                  className="btn btn-primary btn-block mt-4 d-block"
                  type="button"
                  onClick={() => {
                    saveOrderTemplateConfig()
                  }}
                >
                  <span className="d-none d-sm-inline">{t('frontend.core.save')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideNavigation currentStep={currentStep} nextActive={allowedToContinue} />
    </Overlay>
  )
}

export { OrderTemplateConfig }
