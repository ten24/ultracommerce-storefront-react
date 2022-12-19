import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getCart, clearCartData, removePromoCode } from '../../actions/cartActions'
import { useEffect, useState } from 'react'
import { disableInteractionSelector } from '../../selectors/orderSelectors'
import { applyPromoCode, updateItemQuantity, removeItem } from '../../actions/cartActions'
import DynamicPage from '../DynamicPage/DynamicPage'
import { useElementContext } from '../../contexts/ElementContextProvider'

const Cart = () => {
  const { CartLineItem, CartPromoBox, OrderSummary } = useElementContext()

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const disableInteraction = useSelector(disableInteractionSelector)
  const [removeitem, setRemoveitem] = useState(false)
  const navigate = useNavigate()
  const cart = useSelector(state => state.cart)
  const { orderItems, isFetching } = cart
  useEffect(() => {
    dispatch(getCart())
  }, [dispatch])

  return (
    <DynamicPage ignoreLayout={true}>
      {/* <LoadDataTrackingScript /> */}
      <div className="page-header bg-light p-5 text-center">
        <h1 className="display-4">{t('frontend.cart.title')}</h1>
      </div>
      <div className="container my-5">
        {orderItems && orderItems.length === 0 && (
          <div className="text-center p-3">
            <h3>{t('frontend.cart.empty_cart')}</h3>
          </div>
        )}
        {isFetching && removeitem && <div className="alert alert-success">{t('frontend.cart.removeCartItem')}</div>}
        <div className="row">
          <div className="col-lg-8 col-md-12">
            {orderItems && orderItems.length > 0 && (
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
                    {orderItems &&
                      orderItems
                        .filter(item => item.parentOrderItemID === '')
                        .map((orderItem, key) => {
                          return (
                            <CartLineItem
                              key={`${orderItem.orderItemID}-${key}`}
                              orderItem={orderItem}
                              setRemoveitem={setRemoveitem}
                              childBundleItems={orderItems?.filter(item => item?.parentOrderItemID === orderItem.orderItemID)}
                              onUpdateQty={itemCount => {
                                dispatch(updateItemQuantity(orderItem.orderItemID, itemCount))
                              }}
                              onRemoveItem={event => {
                                setRemoveitem(true)
                                event.preventDefault()
                                dispatch(removeItem(orderItem.orderItemID))
                              }}
                            />
                          )
                        })}
                  </div>
                </div>
                <div className="white-background">
                  <button className="btn btn-link link-btn" onClick={() => dispatch(clearCartData())}>
                    {t('frontend.cart.clearCart')}
                  </button>
                </div>
              </>
            )}
          </div>
          {orderItems && orderItems.length !== 0 && (
            <div className="col-lg-4 col-md-12">
              <div className="row">
                <div className="col-sm-12">
                  <OrderSummary
                    cart={cart}
                    disabled={disableInteraction}
                    onRemovePromoCode={(event, promotionCode) => {
                      event.preventDefault()
                      dispatch(removePromoCode(promotionCode, undefined, t('frontend.cart.promo_code_removed')))
                    }}
                  />
                </div>
                <CartPromoBox
                  disabledInteraction={disableInteraction}
                  onApplyCode={(promoCode, setPromoCode) => {
                    dispatch(applyPromoCode(promoCode, t('frontend.cart.promo_code_applied')))
                    setPromoCode('')
                  }}
                />
                <div className="ps-2 pe-2">
                  <button
                    className="col-md-12 btn btn-primary w-100 mt-2 "
                    disabled={disableInteraction}
                    onClick={e => {
                      e.preventDefault()
                      navigate('/checkout')
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
    </DynamicPage>
  )
}

export default Cart
