import { SlideNavigation, Overlay } from '../..'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SwRadioSelect } from '../..'
import { getSavedCreditCardMethods } from '../../../selectors/'
import { OrderTemplateCreditCardDetails } from './OrderTemplateCreditCardDetails'
import { SlatwalApiService } from '../../../services'
import { requestSubscriptionCart, receiveSubscriptionCart } from '../../../actions'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../../utils'

const OrderTemplatePaymentSlide = ({ currentStep }) => {
  const paymentMethods = useSelector(getSavedCreditCardMethods)

  const dispatch = useDispatch()
  const { isFetching, orderTemplateID, accountPaymentMethod } = useSelector(state => state.subscriptionCart)
  const [newOrderPayment, setNewOrderPayment] = useState(accountPaymentMethod ? accountPaymentMethod.accountPaymentMethodID : false)
  const { t } = useTranslation()

  const updatePaymentMethod = accountPaymentMethodID => {
    dispatch(requestSubscriptionCart())
    return SlatwalApiService.orderTemplate
      .updateOrderTemplateBilling({
        orderTemplateID: orderTemplateID,
        accountPaymentMethod: {
          value: accountPaymentMethodID,
        },
        returnJSONObjects: 'orderTemplateCart',
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          return dispatch(receiveSubscriptionCart(response.success().orderTemplateCart))
        }
        return dispatch(receiveSubscriptionCart({}))
      })
  }
  useEffect(() => {
    if (paymentMethods.length === 0) {
      // if there is no payment method found for the user , open new payment form
      setNewOrderPayment('new')
    } else {
      setNewOrderPayment('')
    }
  }, [paymentMethods])
  return (
    <Overlay active={isFetching} spinner>
      <>
        <div className="row mb-3">
          <div className="col-sm-12">
            <hr />
            {newOrderPayment === 'new' ? (
              <label className="w-100 h4">{t('frontend.checkout.cardInfo')}</label>
            ) : (
              <SwRadioSelect
                label={t('frontend.checkout.cardInfo')}
                options={paymentMethods}
                onChange={value => {
                  if (value === 'new') {
                    setNewOrderPayment('new')
                  } else {
                    setNewOrderPayment(value)
                    updatePaymentMethod(value)
                  }
                }}
                selectedValue={accountPaymentMethod?.accountPaymentMethodID}
                displayNew={true}
              />
            )}

            {newOrderPayment !== 'new' && (
              <button
                className="btn btn-secondary mt-2"
                onClick={() => {
                  setNewOrderPayment('new')
                }}
              >
                {t('frontend.checkout.payment.add')}
              </button>
            )}
          </div>
        </div>
        {newOrderPayment === 'new' && (
          <OrderTemplateCreditCardDetails
            onSubmit={() => {
              setNewOrderPayment(false)
            }}
            onCancel={() => {
              setNewOrderPayment('')
            }}
            setNewOrderPayment={setNewOrderPayment}
          />
        )}
      </>

      <SlideNavigation currentStep={currentStep} nextActive={accountPaymentMethod?.accountPaymentMethodID?.length > 0} />
    </Overlay>
  )
}

export { OrderTemplatePaymentSlide }
