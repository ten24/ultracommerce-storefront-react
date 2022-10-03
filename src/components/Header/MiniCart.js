import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import useFormatCurrency from '../../hooks/useFormatCurrency'
import { removeItem } from '../../actions/cartActions'
import { SimpleImage } from '..'
import { useLocation } from 'react-use'
import { getProductRoute } from '../../selectors'
import { removeOrderTemplateItem } from '../../actions/subscriptionCartActions'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../utils'

const MiniCart = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const cart = useSelector(state => state.cart)
  const orderTemplateCart = useSelector(state => state.subscriptionCart)
  const [formatCurrency] = useFormatCurrency({})
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [miniCartOpen, setMiniCartOpen] = useState(false)
  const { isFetching, orderItems, total } = cart
  const { orderTemplateItems, orderTemplateID, calculatedSubTotal } = orderTemplateCart
  const location = useLocation()
  const productRoute = useSelector(getProductRoute)
  const wrapperRef = useRef(null)
  const cartItems = orderItems.filter(item => item.parentOrderItemID === '')

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShow(false)
        setMiniCartOpen(false)
      }
    }
    if (show) document.addEventListener('mousedown', handleClickOutside)
    else document.removeEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef, show])

  return (
    <li ref={wrapperRef} className="nav-item dropdown">
      <span
        onClick={() => {
          setShow(!show)
          setMiniCartOpen(!miniCartOpen)
        }}
        id="navbarDropdown"
        className={`cart position-relative nav-link text-center clickable ${show && 'show'} ${location?.pathname === '/shopping-cart' && `active`}`}
      >
        {cartItems.length > 0 && <i className="fs-6 position-absolute top-1 start-100 translate-middle badge rounded-pill bg-primary">{cartItems.length}</i>}
        {orderItems.length === 0 && orderTemplateItems.length > 0 && <i className="fs-6 position-absolute top-1 start-100 translate-middle badge rounded-pill bg-primary">{orderTemplateItems.length}</i>}
        <i className="bi bi-bag fs-4"></i> <span className="d-block">{t('frontend.header.cart')}</span>
      </span>
      <div className={`dropdown-menu dropdown-menu-end p-0 border-0 shadow-lg ${show && 'show'}`} style={{ minWidth: '350px' }}>
        <div className="accordion cart-dropdown" id="miniCartAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#cart-panel" aria-expanded="true" aria-controls="cart-panel">
                {t('frontend.checkout.cart')}
              </button>
            </h2>
            <div id="cart-panel" className="accordion-collapse collapse show" aria-labelledby="">
              <div className="accordion-body">
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="fw-bold ">
                    {orderItems.length ? orderItems.length : '0'} {t('frontend.home.items')}
                  </span>
                  <span
                    onClick={e => {
                      e.preventDefault()
                      navigate({ pathname: '/shopping-cart' })
                      setShow(!show)
                      setMiniCartOpen(!miniCartOpen)
                    }}
                    className="fw-bold link"
                  >
                    {t('frontend.cart.viewCart')}
                  </span>
                </div>
                <div style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '10px' }}>
                  {cartItems.length > 0 &&
                    cartItems.map(({ extendedUnitPriceAfterDiscount, sku, orderItemID, quantity }, key) => {
                      const { product, images } = sku
                      const { productName, urlTitle } = product
                      const childBundleItems = orderItems?.filter(filteritem => filteritem?.parentOrderItemID === orderItemID)
                      return (
                        <div key={orderItemID} className="d-flex align-items-center py-3 justify-content-between border-bottom border-light flex-wrap">
                          {images && images?.length > 0 && <SimpleImage className="img-fluid mw-50px productImage" src={images?.at(0)} alt={productName} type="product" />}
                          <Link to={`/${productRoute}/${urlTitle}`} className="cart-product-name">
                            {productName}
                          </Link>
                          <span className="text-muted small fw-bolder">
                            {quantity} x <span className="text-black">{formatCurrency(extendedUnitPriceAfterDiscount)}</span>
                          </span>
                          <figure className="m-0">
                            <i
                              onClick={() => {
                                dispatch(removeItem(orderItemID))
                              }}
                              className="bi bi-x-circle"
                              role="button"
                            ></i>
                          </figure>
                          {childBundleItems && childBundleItems.length > 0 && (
                            <div className="accordion mt-3 w-100">
                              <div className="accordion-item">
                                <p className="accordion-header" id="headingOne">
                                  <button className="accordion-button p-1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse_${orderItemID}`} aria-expanded="false" aria-controls="collapseOne">
                                    {t('frontend.cart.bundleProducts.child_items')}
                                  </button>
                                </p>
                                <div id={`collapse_${orderItemID}`} className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                  <div className="accordion-body">
                                    {childBundleItems.map(childBundleItem => {
                                      return (
                                        <div key={childBundleItem.orderItemID} className="d-flex align-items-center py-3 justify-content-between border-bottom border-light flex-wrap">
                                          {childBundleItem.sku.images && childBundleItem.sku.images?.length > 0 && <SimpleImage className="img-fluid mw-50px productImage" src={childBundleItem.sku.images?.at(0)} alt={childBundleItem.sku.product.productName} type="product" />}
                                          <Link to={`/${productRoute}/${urlTitle}`} className="cart-product-name">
                                            {childBundleItem.sku.product.productName}
                                          </Link>
                                          <span className="text-muted small fw-bolder">
                                            {childBundleItem.quantity} x <span className="text-black">{formatCurrency(childBundleItem.extendedUnitPriceAfterDiscount)}</span>
                                          </span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
                {orderItems.length > 0 ? (
                  <>
                    <div className="d-flex justify-content-center border-top border-bottom py-2 mb-4">
                      <label className="text-muted">{t('frontend.home.subtotal')}: </label> <span className="fw-bold">&nbsp;{formatCurrency(total)}</span>
                    </div>
                    <Link to="/checkout" className="btn btn-dark d-block ">
                      {t('frontend.header.checkout')}
                    </Link>
                    {isFetching && <div className="alert alert-info m-2 small">{t('frontend.cart.removeCartItem')}</div>}
                  </>
                ) : (
                  <div className="alert alert-secondary m-2 small">{t('frontend.cart.empty_cart')}</div>
                )}
              </div>
            </div>
            {orderTemplateItems.length > 0 && (
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#subscription-cart-panel" aria-expanded="true" aria-controls="subscription-cart-panel">
                    {t('frontend.cart.orderTemplateCart')}
                  </button>
                </h2>
                <div id="subscription-cart-panel" className="accordion-collapse collapse" aria-labelledby="">
                  <div className="accordion-body">
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span className="fw-bold ">
                        {orderTemplateItems && orderTemplateItems.length ? orderTemplateItems.length : '0'} {t('frontend.home.items')}
                      </span>
                      <span
                        onClick={e => {
                          e.preventDefault()
                          navigate({ pathname: '/scheduled-delivery-cart' })
                          setShow(!show)
                          setMiniCartOpen(!miniCartOpen)
                        }}
                        className="fw-bold link"
                      >
                        {t('frontend.cart.viewSubscriptionCart')}
                      </span>
                    </div>
                    <div style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '10px' }}>
                      {orderTemplateItems &&
                        orderTemplateItems.length > 0 &&
                        orderTemplateItems.map(({ calculatedTotal, sku, quantity, orderTemplateItemID }, key) => {
                          const { product, images } = sku
                          const { productName, urlTitle } = product
                          return (
                            <div className="d-flex align-items-center py-3 justify-content-between border-bottom border-light" key={key}>
                              {images && images?.length > 0 && <SimpleImage className="img-fluid mw-50px productImage" src={images?.at(0)} alt={productName} type="product" />}
                              <Link to={`/${productRoute}/${urlTitle}`} className="cart-product-name">
                                {productName}
                              </Link>
                              <span className="text-muted small fw-bolder">
                                {quantity} x <span className="text-black">{formatCurrency(calculatedTotal)}</span>
                              </span>
                              <figure className="m-0">
                                <i
                                  onClick={() => {
                                    dispatch(removeOrderTemplateItem(orderTemplateID, orderTemplateItemID)).then(response => {
                                      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                                      if (response.isSuccess()) toast.success(t('frontend.cart.removeCartItem'))
                                    })
                                  }}
                                  className="bi bi-x-circle"
                                  role="button"
                                ></i>
                              </figure>
                            </div>
                          )
                        })}
                    </div>
                    {orderTemplateItems && orderTemplateItems.length > 0 ? (
                      <>
                        <div className="d-flex justify-content-center border-top border-bottom py-2 mb-4">
                          <label className="text-muted">{t('frontend.home.subtotal')}: </label> <span className="fw-bold">&nbsp;{formatCurrency(calculatedSubTotal)}</span>
                        </div>
                        <Link to="/scheduled-delivery-checkout" className="btn btn-dark d-block ">
                          {t('frontend.header.checkout')}
                        </Link>
                        {isFetching && <div className="alert alert-info m-2 small">{t('frontend.cart.removeCartItem')}</div>}
                      </>
                    ) : (
                      <div className="alert alert-secondary m-2 small">{t('frontend.cart.empty_cart')}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

export { MiniCart }
