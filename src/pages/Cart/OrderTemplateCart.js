import { OrderTemplateCartLineItem, OrderTemplateCartPromoBox, Layout, OrderTemplateSummary } from '../../components'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { sdkURL, axios } from '../../services'
import { requestSubscriptionCart, clearSubscriptionCart } from '../../actions'
import { useState } from 'react'
import { disableInteractionForOrderTemplateCheckoutSelector } from '../../selectors'

const OrderTemplateCart = () => {
  const { t } = useTranslation()
  const disableInteraction = useSelector(disableInteractionForOrderTemplateCheckoutSelector)
  const { orderTemplateItems, isFetching, orderTemplateID } = useSelector(state => state.subscriptionCart)
  const [removeitem, setRemoveitem] = useState(false)
  const dispatch = useDispatch()
  let history = useHistory()
  const clearSubscriptionCartData = orderTemplateID => {
    dispatch(requestSubscriptionCart())
    axios({
      method: 'POST',
      withCredentials: true,
      url: `${sdkURL}api/scope/deleteOrderTemplate`,
      data: { orderTemplateID, returnJsonObjects: 'orderTemplateCart' },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.status === 200) {
        dispatch(clearSubscriptionCart())
      } else {
        return null
      }
    })
  }
  return (
    <Layout>
      <div className="page-header bg-light p-5 text-center">
        <h1 className="display-4">{t('frontend.cart.title')}</h1>
      </div>
      <div className="container my-5">
        {orderTemplateItems.length === 0 && (
          <div className="text-center p-3">
            <h3>{t('frontend.cart.empty_cart')}</h3>
          </div>
        )}
        {isFetching && removeitem && <div className="alert alert-success">{t('frontend.cart.removeCartItem')}</div>}
        <div className="row">
          <div className="col-lg-8 col-md-12">
            {orderTemplateItems && orderTemplateItems.length > 0 && (
              <>
                <div className="card mb-4">
                  <div className="card-header">
                    <div className="row">
                      <div className="col-sm-12 col-md-6">
                        <h4 className="mb-0">{t('frontend.cart.orderItem')}</h4>
                      </div>
                      <div className="col-sm-12 col-md-6 d-none d-md-block">
                        <div className="row">
                          <div className="col-sm-3">
                            <small>{t('frontend.product.price')}</small>
                          </div>
                          <div className="col-sm-4">
                            <small>{t('frontend.cart.quantity')}</small>
                          </div>
                          <div className="col-sm-4">
                            <small>{t('frontend.cart.total')}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body py-0">
                    {orderTemplateItems &&
                      orderTemplateItems.map(orderTemplateItem => {
                        return <OrderTemplateCartLineItem key={orderTemplateItem.orderTemplateItemID} orderTemplateItemID={orderTemplateItem.orderTemplateItemID} orderTemplateItem={orderTemplateItem} orderTemplateID={orderTemplateID} setRemoveitem={setRemoveitem} />
                      })}
                  </div>
                </div>
                <div className="white-background">
                  <button className="btn btn-link link-btn" onClick={() => clearSubscriptionCartData(orderTemplateID)}>
                    {t('frontend.cart.clearCart')}
                  </button>
                </div>
              </>
            )}
          </div>
          {orderTemplateItems && orderTemplateItems.length !== 0 && (
            <div className="col-lg-4 col-md-12">
              <div className="row">
                <div className="col-sm-12">
                  <OrderTemplateSummary orderTemplateID={orderTemplateID} />
                </div>
                <OrderTemplateCartPromoBox orderTemplateID={orderTemplateID} />
                <div className="ps-2 pe-2">
                  <button
                    className="col-md-12 btn btn-primary w-100 mt-2 "
                    disabled={disableInteraction}
                    onClick={e => {
                      e.preventDefault()
                      history.push('/scheduled-delivery-checkout')
                    }}
                  >
                    {t('frontend.order.to_checkout')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default OrderTemplateCart
