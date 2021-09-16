import { CartLineItem, CartPromoBox, Layout, OrderSummary } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { getCart, clearCartData } from '../../actions/cartActions'
import { useEffect, useState } from 'react'
import { disableInteractionSelector } from '../../selectors'

const Cart = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const disableInteraction = useSelector(disableInteractionSelector)
  const { orderItems, isFetching } = useSelector(state => state.cart)
  const [removeitem, setRemoveitem] = useState(false)
  let history = useHistory()

  useEffect(() => {
    dispatch(getCart())
  }, [dispatch])
  return (
    <Layout>
      <div className="page-header bg-light p-5 text-center">
        <h1 className="display-4">{t('frontend.cart.title')}</h1>
      </div>
      <div className="container my-5">
      {orderItems && orderItems.length === 0 && <div className="text-center p-3"><h3>{t('frontend.cart.empty_cart')}</h3></div>}
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
                          <div className="col-sm-3"><small>{t('frontend.product.price')}</small></div>
                          <div className="col-sm-3"><small>{t('frontend.cart.quantity')}</small></div>
                          <div className="col-sm-4"><small>{t('frontend.cart.total')}</small></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body py-0">
                    {orderItems &&
                      orderItems.map(orderItem => {
                        return <CartLineItem key={orderItem.orderItemID} orderItemID={orderItem.orderItemID} orderItem={orderItem} setRemoveitem={setRemoveitem} />
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
          {orderItems && orderItems.length !== 0 &&
          <div className="col-lg-4 col-md-12">
            <div className="row">
              <div className="col-sm-12">
                <OrderSummary />
              </div>
              <CartPromoBox />
              <div className="ps-2 pe-2">
                <button
                  className="col-md-12 btn btn-primary w-100 mt-2 "
                  disabled={disableInteraction}
                  onClick={e => {
                    e.preventDefault()
                    history.push('/checkout')
                  }}
                >
                  {t('frontend.order.to_checkout')}
                </button>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </Layout>
  )
}

export default Cart
