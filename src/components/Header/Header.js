import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import queryString from 'query-string'
import { AccountImpersonationBanner } from '../../components'
import { useUtilities } from '../../hooks'
import { useSelector } from 'react-redux'
import { SearchBar } from './SearchBar'

const MenuItem = props => {
  const { eventHandlerForWSIWYG } = useUtilities()
  const { t } = useTranslation()
  const { linkTitle = '', linkUrl = '', children } = props

  return (
    <li key={linkTitle} className="nav-item dropdown">
      {!children?.length && (
        <Link className="nav-link" to={linkUrl}>
          {linkTitle}
        </Link>
      )}
      {!!children?.length && (
        <>
          <a className="nav-link dropdown-toggle" href={linkUrl} data-bs-toggle="dropdown">
            {linkTitle}
          </a>
          <div className="mega-menu dropdown-menu border pt-0">
            <div className="nav-shop-all ">
              <Link to={linkUrl}>
                {`${t('frontend.nav.shopall')} ${linkTitle}`}
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
            <div className="d-flex flex-wrap px-2">
              {children.map((menuPanel, index) => {
                return (
                  <div key={index} className="mega-dropdown-column py-4 px-3">
                    <div className="widget widget-links mb-3" onClick={eventHandlerForWSIWYG}>
                      {menuPanel}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </li>
  )
}
const MegaMenu = ({ children }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm pt-0 pb-0" id="mega-menu">
      <div className="container">
        <ul className="navbar-nav nav-categories w-100">{children}</ul>
      </div>
    </nav>
  )
}

const NavBar = ({ megaMenu }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const mobileTextInput = useRef(null)

  if (!megaMenu) return null

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm pt-0 pb-0">
      <div className="container ">
        <div className="input-group-overlay d-lg-none my-3 ms-0">
          <div className="input-group-prepend-overlay">
            <span className="input-group-text">
              <i
                className="bi bi-search"
                onClick={e => {
                  e.preventDefault()
                  navigate({
                    pathname: '/shop',
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
                navigate({
                  pathname: '/shop',
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
        <MegaMenu menuItems={megaMenu} />
      </div>
    </nav>
  )
}

const MainNavBar = props => {
  const { children } = props
  return (
    <div className="nav-children mb-3 mb-lg-0 order-xl-3">
      <ul className="nav justify-content-center justify-content-lg-end align-items-end">{children}</ul>
    </div>
  )
}

const Header = ({ children }) => {
  const theme = useSelector(state => state.configuration.site.theme)
  const { t } = useTranslation()

  const ribbons = children?.filter(child => child.props.el.contentElementTypeCode === 'cetRibbon')
  const menus = children?.filter(child => child.props.el.contentElementTypeCode === 'cetMenu')
  const megaMenus = children?.filter(child => child.props.el.contentElementTypeCode === 'cetMegaMenu')
  return (
    <header>
      <AccountImpersonationBanner />
      {ribbons}
      <nav className="py-3 no-print main-nav">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-center text-md-start mb-3 mb-lg-0 order-xl-1">
              <Link className="d-block" to="/">
                <span className="navbar-brand d-block">
                  <img src={`${process.env.REACT_APP_HOST_URL}${theme.logo?.trim()}`} className="img-fluid" alt={t('frontend.logo')} style={{ maxHeight: '60px', minWidth: '150px' }} />
                </span>
              </Link>
              <button className="navbar-toggler collapsed align-items-end d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <i className="bi bi-list"></i>
              </button>
            </div>
            <div className="text-center text-md-start mb-3 mb-lg-0 order-xl-3 d-none d-lg-block">{menus}</div>
            <div className="col-xl-3 order-xl-2">
              <SearchBar redirectToSearchPage={true} />
            </div>
          </div>
        </div>
      </nav>
      <div className="collapse navbar-collapse main-nav no-print" id="navbarCollapse">
        {/*  Mobile */}
        <div className="d-lg-none mobile-nav">
          <div className="mobile-nav-header">
            <h2 className="border-bottom">{t('frontend.nav.menu')}</h2>
            <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
          {[...menus, ...megaMenus]}
        </div>
        {/*  default */}
        <div className="d-none d-lg-block">{megaMenus}</div>
      </div>
    </header>
  )
}

export { Header, MainNavBar, NavBar, MegaMenu, MenuItem }
