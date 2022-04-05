import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import useFormatCurrency from '../../hooks/useFormatCurrency'
import { removeItem } from '../../actions/cartActions'
import { SimpleImage } from '..'
import { useLocation } from 'react-use'
import { getProductRoute } from '../../selectors'

const MiniCart = () => {
  let history = useHistory()
  const { t } = useTranslation()
  const cart = useSelector(state => state.cart)
  const [formatCurrency] = useFormatCurrency({})
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [miniCartOpen, setMiniCartOpen] = useState(false)
  const { isFetching, orderItems, total } = cart
  const location = useLocation()
  const productRoute = useSelector(getProductRoute)
  const wrapperRef = useRef(null)

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
        {orderItems.length > 0 && <i className="fs-6 position-absolute top-1 start-100 translate-middle badge rounded-pill bg-primary">{orderItems.length}</i>}
        <i className="bi bi-bag fs-4"></i> <span className="d-block">{t('frontend.header.cart')}</span>
      </span>
      <div className={`dropdown-menu dropdown-menu-end p-3 pt-2 border-0 shadow-lg ${show && 'show'}`} style={{ minWidth: '350px' }}>
        <div className="d-flex justify-content-between py-2 border-bottom">
          <span className="fw-bold ">
            {orderItems.length ? orderItems.length : '0'} {t('frontend.home.items')}
          </span>
          <span
            onClick={e => {
              e.preventDefault()
              history.push({ pathname: '/shopping-cart' })
              setShow(!show)
              setMiniCartOpen(!miniCartOpen)
            }}
            className="fw-bold link"
          >
            {t('frontend.cart.viewCart')}
          </span>
        </div>

        <div style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '10px' }}>
          {orderItems.length > 0 &&
            orderItems.map(({ price, sku, orderItemID, quantity }) => {
              const { skuID, product, images } = sku
              const { productName, urlTitle } = product
              return (
                <div className="d-flex align-items-center py-3 justify-content-between border-bottom border-light" key={skuID}>
                  {images && images?.length > 0 && <SimpleImage className="img-fluid mw-50px productImage" src={images[0]} alt={productName} type="product" />}
                  <Link to={`/${productRoute}/${urlTitle}`} className="cart-product-name">
                    {productName}
                  </Link>
                  <span className="text-muted small fw-bolder">
                    {quantity} x <span className="text-black">{formatCurrency(price)}</span>
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
    </li>
  )
}

export { MiniCart }
