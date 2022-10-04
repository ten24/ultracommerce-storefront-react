import { SlideNavigation, Overlay } from '../..'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SwRadioSelect, CCDetails } from '../..'
import { getSavedCreditCardMethods } from '../../../selectors/'
import { OrderTemplateCreditCardDetails } from './OrderTemplateCreditCardDetails'
import { SlatwalApiService } from '../../../services'
import { requestSubscriptionCart, receiveSubscriptionCart } from '../../../actions'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../../utils'
import { useCheckoutUtilities } from '../../../hooks'

const OrderTemplatePaymentSlide = ({ currentStep }) => {
  const paymentMethods = useSelector(getSavedCreditCardMethods)
  const dispatch = useDispatch()
  const { isFetching, orderTemplateID, accountPaymentMethod, shippingAccountAddress, billingAccountAddress } = useSelector(state => state.subscriptionCart)
  const [newOrderPayment, setNewOrderPayment] = useState(accountPaymentMethod ? accountPaymentMethod.accountPaymentMethodID : false)
  const { t } = useTranslation()
  const [changeSelection, setChangeSelection] = useState(true)
  const { CREDIT_CARD_CODE } = useCheckoutUtilities()
  const updatePaymentMethod = accountPaymentMethodID => {
    dispatch(requestSubscriptionCart())
    return SlatwalApiService.orderTemplate
      .updateOrderTemplateBilling({
        orderTemplateID: orderTemplateID,
        billingAccountAddress:{
          value:shippingAccountAddress?.accountAddressID,
        },
        accountPaymentMethod: {
          value: accountPaymentMethodID,
        },
        returnJSONObjects: 'orderTemplateCart',
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setChangeSelection(true)
          dispatch(receiveSubscriptionCart(response.success().orderTemplateCart))
        }
        dispatch(receiveSubscriptionCart({}))
      })
  }

  useEffect(() => {
    if (paymentMethods.length === 0) {
      // if there is no payment method found for the user , open new payment form
      setNewOrderPayment('new')
      setChangeSelection(false)
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
            ) : changeSelection && accountPaymentMethod ? (
              <>
                <p className="h4">{t('frontend.checkout.payments')}:</p>
                <div className="row ">
                  <div className="bg-lightgray rounded mb-5 col-md-4 p-3" key={accountPaymentMethod.paymentMethod.paymentMethodID}>
                    {accountPaymentMethod.paymentMethod.paymentMethodType === CREDIT_CARD_CODE && <CCDetails hideHeading={true} creditCardPayment={accountPaymentMethod} />}
                    <hr />
                    <button
                      className="btn btn-link px-0 text-danger"
                      type="button"
                      onClick={event => {
                        setChangeSelection(false)
                      }}
                    >
                      <i className="fal fa-times-circle"></i>
                      <span className="small"> {t('frontend.core.changeSelection')}</span>
                    </button>
                  </div>
                </div>
              </>
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
                  setChangeSelection(false)
                }}
              >
                {t('frontend.checkout.payment.add')}
              </button>
            )}
          </div>
        </div>
        {newOrderPayment === 'new' && !changeSelection && (
          <OrderTemplateCreditCardDetails
            onSubmit={() => {
              setNewOrderPayment(false)
            }}
            onCancel={() => {
              setNewOrderPayment('')
            }}
            setNewOrderPayment={setNewOrderPayment}
            setChangeSelection={setChangeSelection}
          />
        )}
      </>

      <SlideNavigation currentStep={currentStep} nextActive={accountPaymentMethod?.accountPaymentMethodID?.length > 0 && !!billingAccountAddress} />
    </Overlay>
  )
}

export { OrderTemplatePaymentSlide }
