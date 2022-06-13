import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Modal } from '../..'
import { EditSubscriptionModal, EditSubscriptionScheduleDateModal, EditSubscriptionFrequencyDateModal, EditShippingAddressModal, CancelSubscriptionModal, EditPaymentMethod } from '../../../components'
import { toast } from 'react-toastify'
import { SlatwalApiService } from '../../../services'
import { useFormik } from 'formik'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { getErrorMessage } from '../../../utils'
import { useFormatDate } from '../../../hooks'

const OrderTemplateToolbar = ({ templateID, orderTemplateInfo, updateOrderTemplate }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const [formateDate] = useFormatDate()

  const [showModal, setModal] = useState(false)
  const [showFrequencyModal, setFrequencyModal] = useState(false)
  const [showScheduleDateModal, setScheduleDateModal] = useState(false)
  const [showShippingUpdateModal, setShippingUpdateModal] = useState(false)
  const [showPaymentMethodModal, setPaymentMethodModal] = useState(false)
  const [showCancelSubscriptionModal, setCancelSubscriptionModal] = useState(false)
  const [shipping, setShipping] = useState(orderTemplateInfo.shippingAccountAddress_accountAddressID)
  const [paymentMethod, setPaymentMethod] = useState(orderTemplateInfo.accountPaymentMethod_accountPaymentMethodID)
  const [billingAddress, setBillingAddress] = useState(orderTemplateInfo.billingAccountAddress_accountAddressID)

  const formikSubscriptionName = useFormik({
    enableReinitialize: true,
    initialValues: {
      subscriptionName: orderTemplateInfo.orderTemplateName,
    },
    onSubmit: values => {
      saveSubscriptionName(values)
    },
  })

  const saveSubscriptionName = async values => {
    SlatwalApiService.orderTemplate.editOrderTemplate({ orderTemplateID: templateID, orderTemplateName: formikSubscriptionName.values.subscriptionName }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        setModal(false)
        toast.success(t('frontend.account.scheduled.delivery.detail.toolbar.subscriptionModal.successMessage'))
        updateOrderTemplate(prevState => ({
          ...prevState,
          ...response.success().orderTemplate,
        }))
      }
    })
  }

  const frequencyTermID = orderTemplateInfo.frequencyTerm_termID
  let addressID = orderTemplateInfo.shippingAccountAddress_accountAddressID
  let shippingMethod = orderTemplateInfo.shippingMethod_shippingMethodID
  const [frequencyTermValue, setFrequencyTermValue] = useState(frequencyTermID)
  const updateFrequency = async => {
    SlatwalApiService.orderTemplate.updateOrderTemplateFrequency({ orderTemplateID: templateID, frequencyTerm: { value: frequencyTermValue } }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        setFrequencyModal(false)
        toast.success(t('frontend.account.scheduled.delivery.detail.toolbar.frequencyModal.successMessage'))
        updateOrderTemplate(prevState => ({
          ...prevState,
          ...response.success().orderTemplate,
        }))
      }
    })
  }

  function convert(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2)
    return [mnth, day, date.getFullYear()].join('/')
  }

  const [skip, setSkip] = useState(false)
  const [apply, setApply] = useState(false)
  const [scheduleDateValue, setScheduleDateValue] = useState(new Date(orderTemplateInfo.scheduleOrderNextPlaceDateTime))
  const [otherScheduleDateChangeReasonNote, setOtherScheduleDateChangeReasonNote] = useState('')
  const [scheduleDateChangeReasonType, setScheduleDateChangeReasonType] = useState('')
  let scheduleDateVal = convert(scheduleDateValue)

  const handleSkipDelivery = async skip => {
    setSkip(skip)
    setApply(!skip)
    if (skip) {
      if (!otherScheduleDateChangeReasonNote) return
      const dt = new Date(orderTemplateInfo.scheduleOrderNextPlaceDateTime)
      dt.setMonth(dt.getMonth() + 1)
      updateScheduleDate(convert(dt))
    } else {
      if (!otherScheduleDateChangeReasonNote || !scheduleDateValue || !scheduleDateChangeReasonType) return
      updateScheduleDate(scheduleDateVal)
    }
  }

  const handleSkipDeliveryOnCancel = async => {
    const dt = new Date(orderTemplateInfo.scheduleOrderNextPlaceDateTime)
    dt.setMonth(dt.getMonth() + 1)
    SlatwalApiService.orderTemplate
      .updateOrderTemplateSchedule({
        orderTemplateID: templateID,
        orderTemplateScheduleDateChangeReasonTypeID: '',
        otherScheduleDateChangeReasonNotes: 'Cancel Modal Retention',
        scheduleOrderNextPlaceDateTime: dt,
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setScheduleDateModal(false)
          toast.success(t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.successMessage'))
          updateOrderTemplate(prevState => ({
            ...prevState,
            ...response.success().orderTemplate,
          }))
        }
      })
  }

  const updateScheduleDate = async scheduleDateVal => {
    SlatwalApiService.orderTemplate
      .updateOrderTemplateSchedule({
        orderTemplateID: templateID,
        orderTemplateScheduleDateChangeReasonTypeID: scheduleDateChangeReasonType,
        otherScheduleDateChangeReasonNotes: otherScheduleDateChangeReasonNote,
        scheduleOrderNextPlaceDateTime: scheduleDateVal,
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setScheduleDateModal(false)
          toast.success(t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.successMessage'))
          updateOrderTemplate(prevState => ({
            ...prevState,
            ...response.success().orderTemplate,
          }))
        }
      })
  }

  const formikCancel = useFormik({
    enableReinitialize: false,
    initialValues: {
      cancellationReason: '',
    },
    onSubmit: values => {
      cancelOrderTemplate(values)
    },
  })
  const [cancellationType, setCancellationType] = useState()
  const cancelOrderTemplate = async values => {
    if (!cancellationType || !formikCancel.values.cancellationReason) return null
    SlatwalApiService.orderTemplate
      .cancelOrderTemplate({
        orderTemplateID: templateID,
        orderTemplateCancellationReasonType: cancellationType,
        orderTemplateCancellationReasonTypeOther: formikCancel.values.cancellationReason,
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setCancelSubscriptionModal(false)
          toast.success(t('frontend.account.scheduled.delivery.detail.toolbar.cancelModal.successMessage'))
          setTimeout(() => {
            history.push('/my-account/subscription-orders')
          }, 2000)
        }
      })
  }

  let data = {}
  const updateShipping = values => {
    if (values.accountAddressID) {
      addressID = values.accountAddressID
    }
    if (values.shippingMethod) {
      shippingMethod = values.shippingMethod
    }
    if (values.accountAddressID || values.shippingMethod) {
      data = {
        orderTemplateID: templateID,
        shippingAccountAddress: {
          value: addressID,
        },
        shippingMethodID: shippingMethod,
      }
    } else {
      data = {
        orderTemplateID: templateID,
        newAccountAddress: {
          accountAddressName: values.accountAddressName,
          address: values,
        },
        shippingMethodID: shippingMethod,
      }
    }

    SlatwalApiService.orderTemplate.updateOrderTemplateShipping(data).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        setShippingUpdateModal(false)
        toast.success(t('frontend.account.scheduled.delivery.detail.toolbar.shippingModal.successMessage'))
        updateOrderTemplate(prevState => ({
          ...prevState,
          ...response.success().orderTemplate,
        }))
      }
    })
  }

  const updatePaymentMethod = values => {
    if (values.paymentMethodId) {
      data = {
        orderTemplateID: templateID,
        accountPaymentMethod: {
          billingAccountAddress_accountAddressID: orderTemplateInfo.billingAccountAddress_accountAddressID,
          value: values.paymentMethodId,
        },
        shippingMethodID: shippingMethod,
      }
    } else if (values.saveNew) {
      data = {
        orderTemplateID: templateID,
        newAccountPaymentMethod: values.saveNew,
        shippingMethodID: shippingMethod,
      }
    } else if (values.changeBillingAddress) {
      data = {
        orderTemplateID: templateID,
        billingAccountAddress: {
          value: values.changeBillingAddress,
        },
        shippingMethodID: shippingMethod,
        newAccountPaymentMethod: values.paymentMethod,
      }
    } else {
      data = {
        orderTemplateID: templateID,
        newAccountAddress: {
          accountAddressName: values.accountAddressName,
          address: values,
        },
        shippingMethodID: shippingMethod,
      }
    }
    SlatwalApiService.orderTemplate.updateOrderTemplateBilling(data).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        setPaymentMethodModal(false)
        toast.success(t('frontend.account.scheduled.delivery.detail.toolbar.paymentModal.successMessage'))
        updateOrderTemplate(prevState => ({
          ...prevState,
          ...response.success().orderTemplate,
        }))
      }
    })
  }

  return (
    <div className="row align-items-start mb-5 mr-3 scheduled-delivery-detail">
      <div className="col-sm-7">
        <div>
          <h6 className="h6">
            <span>{orderTemplateInfo?.orderTemplateName}</span>
          </h6>
        </div>
        <div className="col-sm-6">
          <div className="text-muted">
            {t('frontend.order.statusText')} <span className="badge bg-success m-0 p-2 ml-2">{orderTemplateInfo.orderTemplateStatusType_typeName}</span>
          </div>
        </div>
        <div className="text-muted"> {t('frontend.account.scheduled.delivery.createdOn') + ' ' + formateDate(orderTemplateInfo.createdDateTime)}</div>
        <div className="row text-sm mt-5">
          <div className="col-6 d-flex flex-column">
            <h6 className="h6">
              {t('frontend.account.scheduled.delivery.detail.toolbar.shippingAddress')}
              <button
                className="btn btn-link p-1"
                onClick={event => {
                  event.preventDefault()
                  setShippingUpdateModal(!showShippingUpdateModal)
                }}
              >
                {t('frontend.account.scheduled.delivery.editLink')}
              </button>
            </h6>
            <p>
              {orderTemplateInfo.shippingAccountAddress_accountAddressName} <br />
              {orderTemplateInfo.shippingAccountAddress_address_streetAddress} <br /> {orderTemplateInfo.shippingAccountAddress_address_city + ', ' + orderTemplateInfo.shippingAccountAddress_address_stateCode + ' ' + orderTemplateInfo.shippingAccountAddress_address_postalCode} <br />{' '}
            </p>
          </div>
          <div className="col-6">
            <h6 className="h6">
              {t('frontend.account.scheduled.delivery.detail.toolbar.paymentMethod')}
              <button
                className="btn btn-link p-1"
                onClick={event => {
                  event.preventDefault()
                  setPaymentMethodModal(!showPaymentMethodModal)
                }}
              >
                {t('frontend.account.scheduled.delivery.editLink')}
              </button>
            </h6>
            <p>
              {orderTemplateInfo.accountPaymentMethod_paymentMethod_paymentMethodName} <br /> {orderTemplateInfo.accountPaymentMethod_nameOnCreditCard} <br /> {t('frontend.account.scheduled.delivery.detail.toolbar.paymentCredit.text') + ' ' + orderTemplateInfo.accountPaymentMethod_creditCardLastFour}
            </p>
          </div>
        </div>
        <div className="row text-sm mt-5">
          <div className="col-6 d-flex flex-column justify-content-between">
            <h6 className="h6">
              {t('frontend.account.scheduled.delivery.detail.toolbar.deliveryFrequency')}
              <button
                className="btn btn-link p-1"
                onClick={event => {
                  event.preventDefault()
                  setFrequencyModal(!showFrequencyModal)
                }}
              >
                {t('frontend.account.scheduled.delivery.editLink')}
              </button>
            </h6>
            <p>
              {t('frontend.account.order.subscription.frequencyPrefix') + ' ' + orderTemplateInfo.frequencyTerm_termName} <br />{' '}
            </p>
          </div>
          <div className="col-6">
            <h6 className="h6">
              {t('frontend.account.scheduled.delivery.detail.toolbar.nextScheduleShipDate')}
              <button
                className="btn btn-link p-1"
                onClick={event => {
                  event.preventDefault()
                  setScheduleDateModal(!showScheduleDateModal)
                }}
              >
                {t('frontend.account.scheduled.delivery.editLink')}
              </button>
            </h6>
            <p>{convert(orderTemplateInfo.scheduleOrderNextPlaceDateTime)}</p>
          </div>
        </div>
      </div>
      <div className="col-sm-5">
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">{t('frontend.account.scheduled.delivery.manageSubscription')}</h5>
          </div>
          <ul className="list-group list-group-flush text-center">
            <li className="list-group-item">
              <button
                className="btn btn-link p-1"
                onClick={event => {
                  event.preventDefault()
                  setModal(!showModal)
                }}
              >
                {t('frontend.account.scheduled.delivery.editSubscription')}
              </button>
            </li>
            <li className="list-group-item">
              <a className="link" href="#delivery-history">
                {t('frontend.account.scheduled.delivery.viewDeliveryHistory')}
              </a>
            </li>
            <li className="list-group-item">
              <Link to="/shop" className="link">
                {t('frontend.account.scheduled.delivery.addItemsSubscription')}
              </Link>
            </li>
            <li className="list-group-item">
              <button
                className="btn btn-link p-1"
                onClick={event => {
                  event.preventDefault()
                  setCancelSubscriptionModal(!showCancelSubscriptionModal)
                }}
              >
                {t('frontend.account.scheduled.delivery.cancelSubscription')}
              </button>
            </li>
          </ul>
        </div>
      </div>
      {showModal && (
        <Modal show={showModal} setShow={setModal} title={t('frontend.account.scheduled.delivery.detail.toolbar.subscriptionModal.text')} modalClass="orderTemplateModal" size="medium">
          <div className="container">
            <EditSubscriptionModal formik={formikSubscriptionName} />
          </div>
        </Modal>
      )}
      {showFrequencyModal && (
        <Modal show={showFrequencyModal} setShow={setFrequencyModal} title={t('frontend.account.scheduled.delivery.detail.toolbar.frequencyModal.text')} modalClass="orderTemplateModal" size="medium">
          <div className="container">
            <EditSubscriptionFrequencyDateModal updateFrequency={updateFrequency} setFrequencyTerm={setFrequencyTermValue} frequencyTerm={frequencyTermValue} orderInfo={orderTemplateInfo} />
          </div>
        </Modal>
      )}
      {showScheduleDateModal && (
        <Modal show={showScheduleDateModal} setShow={setScheduleDateModal} title={t('frontend.account.scheduled.delivery.detail.toolbar.scheduleDateModal.text')} modalClass="orderTemplateModal" size="large">
          <div className="container">
            <EditSubscriptionScheduleDateModal skip={skip} handleSkipDelivery={handleSkipDelivery} scheduleDateValue={scheduleDateValue} setScheduleDateValue={setScheduleDateValue} otherScheduleDateChangeReasonNote={otherScheduleDateChangeReasonNote} setOtherScheduleDateChangeReasonNote={setOtherScheduleDateChangeReasonNote} scheduleDateChangeReasonType={scheduleDateChangeReasonType} setScheduleDateChangeReasonType={setScheduleDateChangeReasonType} apply={apply} />
          </div>
        </Modal>
      )}
      {showShippingUpdateModal && (
        <Modal show={showShippingUpdateModal} setShow={setShippingUpdateModal} title={t('frontend.account.scheduled.delivery.detail.toolbar.shippingModal.text')} modalClass="orderTemplateModal" size="large">
          <div className="container">
            <EditShippingAddressModal orderInfo={orderTemplateInfo} shipping={shipping} setShipping={setShipping} updateShipping={updateShipping} />
          </div>
        </Modal>
      )}
      {showPaymentMethodModal && (
        <Modal show={showPaymentMethodModal} setShow={setPaymentMethodModal} title={t('frontend.account.scheduled.delivery.detail.toolbar.paymentModal.text')} modalClass="orderTemplateModal" size="large">
          <div className="container">
            <EditPaymentMethod updatePaymentMethod={updatePaymentMethod} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} billingAddress={billingAddress} setBillingAddress={setBillingAddress} />
          </div>
        </Modal>
      )}
      {showCancelSubscriptionModal && (
        <Modal show={showCancelSubscriptionModal} setShow={setCancelSubscriptionModal} title={t('frontend.account.scheduled.delivery.detail.toolbar.cancelModal.text')} modalClass="orderTemplateModal" size="medium">
          <div className="container">
            <CancelSubscriptionModal formik={formikCancel} cancel={cancellationType} setCancel={setCancellationType} orderInfo={orderTemplateInfo} showCancelSubscriptionModal={showCancelSubscriptionModal} setCancelSubscriptionModal={setCancelSubscriptionModal} handleSkipDeliveryOnCancel={handleSkipDeliveryOnCancel} />
          </div>
        </Modal>
      )}
    </div>
  )
}

export { OrderTemplateToolbar }
