import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { SwSelect, Button } from '..'
import { toast } from 'react-toastify'
import { SlatwalApiService } from '../../services'
import DatePicker from 'react-datepicker'
import { getErrorMessage, isAuthenticated } from '../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { receiveSubscriptionCart } from '../../actions'

const AddProductToSubscriptionModal = ({ quantity, sku, show, setShow, orderTemplates, frequencyTermOptions }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [frequencyTerm, setFrequencyTerm] = useState(frequencyTermOptions[0].value)
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const [scheduleDateValue, setScheduleDateValue] = useState(tomorrowDate)
  const [isLoading, setLoading] = useState(false)
  const [isLoadingForExisting, setLoadingForExisting] = useState(false)
  const [existingOrderTemplate, setExistingOrderTemplate] = useState(orderTemplates?.at(0) ? orderTemplates?.at(0)['orderTemplateID'] : {})
  const orderTemplateItems = useSelector(state => state.subscriptionCart.orderTemplateItems)

  useEffect(() => {
    setExistingOrderTemplate(orderTemplates?.at(0)?.['orderTemplateID'])
    // eslint-disable-next-line
  },[orderTemplates?.length])

  const saveOrderTemplateItem = () => {
    const payload = { quantity: quantity, skuID: sku.skuID, returnJsonObjects: 'orderTemplateCart' }
    SlatwalApiService.orderTemplate.addItem(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) {
        toast.error(getErrorMessage(response.success().errors))
      } else {
        if (response.isSuccess()) {
            if (Object.keys(response.success().orderTemplateCart).length > 0) updateScheduleDate(response.success().orderTemplateCart.orderTemplateID)
            updateFrequency(response.success().orderTemplateCart.orderTemplateID)
            setShow(false)
            setLoading(false)
        }
      }
    })
  }

  const saveExistingOrderTemplateItem = templateID => {
    if(!templateID) return null
    const payload = { orderTemplateID: templateID, quantity: quantity, skuID: sku.skuID, returnJsonObjects: 'orderTemplateCart' }
    setLoadingForExisting(true)
    SlatwalApiService.orderTemplate.addItem(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) {
        toast.error(getErrorMessage(response.success().errors))
      } else {
        if (response.isSuccess()) {
            setShow(false)
            setLoadingForExisting(false)
        }
      }
    })
  }

  const updateFrequency = async templateID => {
    SlatwalApiService.orderTemplate.updateOrderTemplateFrequency({ orderTemplateID: templateID, frequencyTerm: { value: frequencyTerm }, returnJsonObjects: 'orderTemplateCart' }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveSubscriptionCart(response.success().orderTemplateCart))
        toast.success(t('frontend.cart.template.successMessage'))
      }
    })
  }

  const updateScheduleDate = async templateID => {
    SlatwalApiService.orderTemplate.updateOrderTemplateSchedule({
      orderTemplateID: templateID,
      orderTemplateScheduleDateChangeReasonTypeID: '',
      otherScheduleDateChangeReasonNotes: '',
      scheduleOrderNextPlaceDateTime: scheduleDateValue,
    })
  }
  return (
    <>
      {isAuthenticated() && orderTemplates?.length > 0 && (
        <>
          <form name="add-to-exisiting-subscription">
            <div className="row text-align-center">
              <div className="col-md-12 d-flex justify-content-center">
                <div className="form-group col-md-4 p-3">
                  <label htmlFor="existingSubscription">{t('frontend.product.existingSubscription')}</label>
                  <SwSelect
                    id="existingSubscription"
                    value={existingOrderTemplate}
                    onChange={e => {
                      setExistingOrderTemplate(e.target.value)
                    }}
                    options={orderTemplates.length > 0 ? orderTemplates.map(({ orderTemplateID, orderTemplateName }) => ({ key: orderTemplateName, value: orderTemplateID })) : []}
                  />
                  {!existingOrderTemplate ? <span className="form-error-msg">{t('frontend.core.required')}</span> : null}
                </div>
                <div className="form-group p-3">
                  <Button
                    isLoading={isLoadingForExisting}
                    classList="btn btn-primary btn-block mt-4"
                    type="button"
                    onClick={() => {
                      if (!!existingOrderTemplate) saveExistingOrderTemplateItem(existingOrderTemplate)
                    }}
                    disabled={isLoadingForExisting}
                  >
                    <span className="d-none d-sm-inline">{t('frontend.product.addThisToSubscription')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <hr className="hr-text" data-content={t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.orText')} />
        </>
      )}

      <form name="add-subscription">
        <div className="row">
          {orderTemplateItems.length === 0 && (
            <div className="col-md-12 d-flex">
              <div className="form-group col-md-4 p-3">
                <label htmlFor="frequencyTerm_termName">{t('frontend.account.scheduled.delivery.detail.toolbar.frequencyModal.inputTitle')}</label>
                <SwSelect
                  id="frequencyTerm_termName"
                  value={frequencyTerm}
                  onChange={e => {
                    setFrequencyTerm(e.target.value)
                  }}
                  options={frequencyTermOptions}
                />
                {!frequencyTerm ? <span className="form-error-msg">{t('frontend.core.required')}</span> : null}
              </div>
              <div className="form-group col-md-4 p-3">
                <label htmlFor="frequencyTerm_scheduleDate">{t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.inputTitle')}</label>
                <DatePicker className="form-control" id="frequencyTerm_scheduleDate" selected={scheduleDateValue} onChange={date => setScheduleDateValue(date)} minDate={new Date()} />
                {!scheduleDateValue ? <span className="form-error-msg">{t('frontend.core.required')}</span> : null}
              </div>
              <div className="form-group col-md-4 p-3">
                <Button
                  disabled={isLoading}
                  isLoading={isLoading}
                  classList="btn btn-primary btn-block mt-4 d-block"
                  label={t('frontend.product.createNewSubscription')}
                  onClick={() => {
                    setLoading(true)
                    saveOrderTemplateItem()
                  }}
                />
              </div>
            </div>
          )}
          {orderTemplateItems.length > 0 && (
            <div className="col-md-12 d-flex justify-content-center  ">
              <div className="form-group  p-3">
                <Button
                  disabled={isLoading}
                  isLoading={isLoading}
                  classList="btn btn-primary btn-block mt-4 d-block"
                  label={t('frontend.product.addToSubscriptionCart')}
                  onClick={() => {
                    setLoading(true)
                    saveOrderTemplateItem()
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </>
  )
}
export { AddProductToSubscriptionModal }
