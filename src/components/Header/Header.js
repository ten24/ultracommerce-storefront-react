import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import queryString from 'query-string'
import { useSelector } from 'react-redux'
import useFormatCurrency from '../../hooks/useFormatCurrency'
import { removeItem } from '../../actions/cartActions'
import { AccountBubble, ProductImage } from '../../components'
import { groupBy } from '../../utils'
import { useLocation } from 'react-use'

const extractMenuFromContent = content => {
  let menu = Object.keys(content)
    .map(key => {
      return key.includes('productcategories') ? content[key] : null
    })
    .filter(item => {
      return item
    })
    .sort((a, b) => {
      return a.sortOrder - b.sortOrder
    })
  if (menu.length) {
    const groupedItems = groupBy(menu, 'parentContent_contentID')
    menu = menu
      .map(item => {
        item.children = groupedItems.hasOwnProperty(item.contentID) ? groupedItems[item.contentID] : []
        return item
      })
      .filter(item => {
        return item.children.length
      })
      .filter(item => {
        return item.urlTitle !== 'productcategories'
      })
      .sort((a, b) => {
        return a.sortOrder - b.sortOrder
      })
  }
  return menu
}

const MegaMenu = props => {
  let history = useHistory()
  const { t } = useTranslation()

  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href={props.linkUrl || '/'} data-bs-toggle="dropdown">
        {props.title}
      </a>
      <div className="mega-menu dropdown-menu  pt-0 pb-3">
        <div className="nav-shop-all ">
          <Link to={props.linkUrl || '/'}>
            {`${t('frontend.nav.shopall')} ${props.title}`}
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
        <div className="d-flex flex-wrap px-2">
          {props.subMenu.map((productCategory, index) => {
            return (
              <div key={index} className="mega-dropdown-column py-4 px-3">
                <div
                  className="widget widget-links mb-3"
                  onClick={event => {
                    event.preventDefault()
                    if (event.target.getAttribute('href')) {
                      history.push(event.target.getAttribute('href'))
                    }
                  }}
                  dangerouslySetInnerHTML={{
                    __html: productCategory['customBody'],
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </li>
  )
}

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
  return (
    <li className="nav-item dropdown">
      <span onClick={() => setMiniCartOpen(!miniCartOpen)} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className={`cart position-relative nav-link text-center dropdown-toggle ${show && 'show'} ${location?.pathname === '/shopping-cart' && `active`}`}>
        {cartQuantity > 0 && <i className="fs-6 position-absolute top-1 start-100 translate-middle badge rounded-pill bg-primary">{cartQuantity}</i>}
        <i className="bi bi-bag fs-4"></i> <span className="d-block">{t('frontend.header.cart')}</span>
      </span>
      <div className={`dropdown-menu dropdown-menu-end p-4 border-0 shadow-lg ${show && 'show'}`} aria-labelledby="navbarDropdown">
        <div className="d-flex justify-content-between py-2 border-bottom mn-width">
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
        {orderItems.length > 0 &&
          orderItems.map(({ price, sku, orderItemID, quantity }) => {
            const { skuID, product } = sku
            const { productName, productID } = product
            return (
              <div className="d-flex align-items-center py-3 justify-content-between" key={skuID}>
                <span className="link-secondary small">{productName}</span>
                <br />
                <span className="text-muted small fw-bolder">
                  {quantity} x <span className="price_color">{formatCurrency(price)}</span>
                </span>
                <figure className="position-relative me-2">
                  {miniCartOpen && <ProductImage productID={productID} skuID={skuID} customClass="img-fluid img-placeholder  m-auto image_container" />}
                  <i
                    onClick={event => {
                      event.preventDefault()
                      dispatch(removeItem(orderItemID))
                    }}
                    className="bi bi-x-circle-fill fs-4 fw-bolder position-absolute top-0 start-100 translate-middle"
                    role="button"
                  ></i>
                </figure>
              </div>
            )
          })}
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

const Header = ({ logo }) => {
  const { t } = useTranslation()
  let history = useHistory()
  const location = useLocation()
  const content = useSelector(state => state.content)
  let mainNavigation = content['header/main-navigation'] ? content['header/main-navigation'].customBody : ''
  const textInput = useRef(null)

  const { shopByManufacturer } = useSelector(state => state.configuration)
  const menuItems = extractMenuFromContent(content)
  const mobileTextInput = useRef(null)

  return (
    <>
      <div className="p5 header-bg"></div>
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
        <div className="container-fluid">
          <div className="d-md-flex w-100 justify-content-between align-items-center me-5">
            <div className="d-sm-flex align-items-center flex-grow-1">
              <Link to="/">
                <span className="navbar-brand">
                  <img src={logo} alt={t('frontend.logo')} />
                </span>
              </Link>
              <form className="flex-grow-1">
                <div className="input-group m-width mt-3">
                  <input
                    className="form-control appended-form-control"
                    type="text"
                    ref={textInput}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        history.push({
                          pathname: '/search',
                          search: queryString.stringify({ keyword: e.target.value }, { arrayFormat: 'comma' }),
                        })
                        textInput.current.value = ''
                      }
                    }}
                    placeholder={t('frontend.search.placeholder')}
                  />
                  <button
                    onClick={e => {
                      e.preventDefault()
                      history.push({
                        pathname: '/search',
                        search: queryString.stringify({ keyword: textInput.current.value }, { arrayFormat: 'comma' }),
                      })
                      textInput.current.value = ''
                    }}
                    className="btn btn-secondary clr-white d-flex justify-content-between align-items-center"
                    type="button"
                    id="button-addon2"
                  >
                    <i className="bi bi-search clr-white"></i>
                    <div className="clr-white ps-1"> {t('frontend.header.search')}</div>
                  </button>
                </div>
              </form>
            </div>

            <div className="float-md-end">
              <ul className="nav">
                {typeof mainNavigation === 'string' && (
                  <div
                    className="d-flex column"
                    onClick={event => {
                      event.preventDefault()
                      if (event.target.getAttribute('href')) {
                        event.target.setAttribute('class', 'nav-link text-center active')
                        history.push(event.target.getAttribute('href'))
                      }
                    }}
                    dangerouslySetInnerHTML={{
                      __html: mainNavigation,
                    }}
                  />
                )}
                {mainNavigation &&
                  typeof mainNavigation !== 'string' &&
                  mainNavigation?.mainNav?.map(({ bootstrapIconClass, linkUrl, title }) => {
                    return (
                      <Link to={linkUrl} className="link-button" key={linkUrl}>
                        <span className={`nav-link text-center ${location?.pathname === linkUrl && `active`}`} aria-current="page">
                          <i className={bootstrapIconClass}></i> <span className="d-block">{title}</span>
                        </span>
                      </Link>
                    )
                  })}
                <Link to="/my-account" className="link-button">
                  <AccountBubble />
                </Link>
                <MiniCart />
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {menuItems.length > 0 && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm pt-0 pb-0">
          <div className="container ">
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="input-group-overlay d-lg-none my-3 ms-0">
                <div className="input-group-prepend-overlay">
                  <span className="input-group-text">
                    <i
                      className="bi bi-search"
                      onClick={e => {
                        e.preventDefault()
                        history.push({
                          pathname: '/search',
                          search: mobileTextInput.stringify({ keyword: mobileTextInput.current.value }, { arrayFormat: 'comma' }),
                        })
                        mobileTextInput.current.value = ''
                      }}
                    />
                  </span>
                </div>
                <input
                  className="form-control prepended-form-control"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      history.push({
                        pathname: '/search',
                        search: queryString.stringify({ keyword: e.target.value }, { arrayFormat: 'comma' }),
                      })
                      mobileTextInput.current.value = ''
                    }
                  }}
                  type="text"
                  ref={mobileTextInput}
                  placeholder={t('frontend.search.placeholder')}
                />
              </div>

              <ul className="navbar-nav nav-categories">
                {menuItems.map((menuItem, index) => {
                  return <MegaMenu key={index} subMenu={menuItem.children} title={menuItem.title} linkUrl={menuItem.linkUrl} />
                })}
              </ul>
              {shopByManufacturer.showInMenu && (
                <ul className="navbar-nav mega-nav">
                  <li className="nav-item">
                    <Link className="nav-link white-text" to={shopByManufacturer.slug}>
                      <i className="bi bi-gear me-2"></i>
                      {t('frontend.nav.manufacturer')}
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </nav>
      )}
    </>
  )
}

export { Header }
