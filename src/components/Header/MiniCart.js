import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import useFormatCurrency from '../../hooks/useFormatCurrency'
import { removeItem } from '../../actions/cartActions'
import { ProductImage } from '..'
import { useLocation } from 'react-use'
import { getProductRoute } from '../../selectors'

const MiniCart = () => {
  let history = useHistory()
  const { t } = useTranslation()
  const cart = useSelector(state => state.cart)
  const cartQuantity = cart.orderItems.reduce((accumulator, orderItem) => accumulator + orderItem.quantity, 0)
  const [formatCurrency] = useFormatCurrency({})
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [miniCartOpen, setMiniCartOpen] = useState(false)
  const { isFetching, orderItems, total } = cart
  const location = useLocation()
  const productRoute = useSelector(getProductRoute)
  return (
    <li className="nav-item dropdown">
      <span onClick={() => setMiniCartOpen(!miniCartOpen)} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className={`cart position-relative nav-link text-center dropdown-toggle ${show && 'show'} ${location?.pathname === '/shopping-cart' && `active`}`}>
        {cartQuantity > 0 && <i className="fs-6 position-absolute top-1 start-100 translate-middle badge rounded-pill bg-primary">{cartQuantity}</i>}
        <i className="bi bi-bag fs-4"></i> <span className="d-block">{t('frontend.header.cart')}</span>
      </span>
      <div className={`dropdown-menu dropdown-menu-end p-3 pt-2 border-0 shadow-lg ${show && 'show'}`} aria-labelledby="navbarDropdown" style={{ minWidth: '350px' }}>
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
              const { skuID, product, imageFile } = sku
              const { productName, productID, urlTitle } = product
              return (
                <div className="d-flex align-items-center py-3 justify-content-between border-bottom border-light" key={skuID}>
                  {<ProductImage productID={productID} skuID={skuID} imageFile={imageFile} customClass="img-fluid mw-50px" />}
                  <Link to={`/${productRoute}/${urlTitle}`} className="cart-product-name">
                    {productName}
                  </Link>
                  <span className="text-muted small fw-bolder">
                    {quantity} x <span className="text-black">{formatCurrency(price)}</span>
                  </span>
                  <figure className="m-0">
                    <i
                      onClick={event => {
                        event.preventDefault()
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
              <label className="text-muted">{t('frontend.home.subtotal')}:</label> <span className="fw-bold">{formatCurrency(total)}</span>
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
