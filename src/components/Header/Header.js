import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import queryString from 'query-string'
import { useSelector } from 'react-redux'
import { AccountBubble, MiniCart, AccountImpersonationBanner, LanguagePicker } from '../../components'
import { useLocation } from 'react-use'
import { useUtilities } from '../../hooks'
import { SearchBar } from './SearchBar'
import { MultiSitePicker } from '../MultiSitePicker/MultiSitePicker'
import { getMyAccountUrl } from '../../utils'
import { getThemeConfig } from '../../selectors'

const MegaMenuPanel = ({ subMenu = [] }) => {
  const { eventHandlerForWSIWYG } = useUtilities()
  return (
    <div className="d-flex flex-wrap px-2">
      {subMenu.map((menuPanel, index) => {
        return (
          <div key={index} className="mega-dropdown-column py-4 px-3">
            <div
              className="widget widget-links mb-3"
              onClick={eventHandlerForWSIWYG}
              dangerouslySetInnerHTML={{
                __html: menuPanel?.contentBody,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
const MegaMenu = ({ menuItems = [] }) => {
  const { t } = useTranslation()
  const { shopByManufacturer } = useSelector(state => state.configuration)

  return (
    <ul className="navbar-nav nav-categories w-100">
      {menuItems.map(menuItem => {
        return (
          <li key={menuItem.linkTitle} className="nav-item dropdown">
            {!menuItem.columns.length > 0 && (
              <Link className="nav-link" to={menuItem.linkUrl}>
                {menuItem.linkTitle}
              </Link>
            )}
            {menuItem.columns.length > 0 && (
              <>
                <a className="nav-link dropdown-toggle" href={menuItem.linkUrl} data-bs-toggle="dropdown">
                  {menuItem.linkTitle}
                </a>
                <div className="mega-menu dropdown-menu border pt-0 pb-3">
                  <div className="nav-shop-all ">
                    <Link to={menuItem.linkUrl}>
                      {`${t('frontend.nav.shopall')} ${menuItem.linkTitle}`}
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>
                  <MegaMenuPanel subMenu={menuItem.columns} />
                </div>
              </>
            )}
          </li>
        )
      })}
      {shopByManufacturer.showInMenu && (
        <li className="nav-item">
          <Link className="nav-link" to={shopByManufacturer.slug}>
            {t('frontend.nav.manufacturer')}
          </Link>
        </li>
      )}
    </ul>
  )
}

const NavBar = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const menu_items = useSelector(state => state.content?.header?.mega_menu?.menu_items)
  const mobileTextInput = useRef(null)

  if (!menu_items) {
    return null
  }

  return (
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
          <MegaMenu menuItems={menu_items} />
        </div>
      </div>
    </nav>
  )
}

const MainNavBar = () => {
  const { eventHandlerForWSIWYG } = useUtilities()
  const mainNavigation = useSelector(state => state.content?.header?.utility_menu?.menu_items)
  const location = useLocation()
  const { themeKey } = useSelector(getThemeConfig)
  return (
    <div className="col-xl-auto col-md-10 mb-3 mb-lg-0 order-xl-3">
      {themeKey === 'default' && (
        <ul className="nav justify-content-center justify-content-lg-end">
          {mainNavigation && !Array.isArray(mainNavigation) && (
            <div
              className="d-flex column"
              onClick={eventHandlerForWSIWYG}
              dangerouslySetInnerHTML={{
                __html: mainNavigation || '',
              }}
            />
          )}
          {mainNavigation &&
            Array.isArray(mainNavigation) &&
            mainNavigation?.map(({ bootstrapIconClass, linkUrl, linkTitle }) => {
              return (
                <Link to={linkUrl} className="nav-item link-button" key={linkUrl}>
                  <span className={`nav-link text-center ${location?.pathname === linkUrl && `active`}`} aria-current="page">
                    <i className={bootstrapIconClass}></i> <span className="d-block">{linkTitle}</span>
                  </span>
                </Link>
              )
            })}
          <Link to={getMyAccountUrl()} className="nav-item link-button">
            <AccountBubble />
          </Link>

          <MiniCart />

          <MultiSitePicker />

          <LanguagePicker />
        </ul>
      )}

      {themeKey === 'industrial' && (
        <ul className="nav justify-content-center justify-content-lg-end">
          {mainNavigation && !Array.isArray(mainNavigation) && (
            <div
              className="d-flex column"
              onClick={eventHandlerForWSIWYG}
              dangerouslySetInnerHTML={{
                __html: mainNavigation || '',
              }}
            />
          )}
          {mainNavigation &&
            Array.isArray(mainNavigation) &&
            mainNavigation?.map(({ bootstrapIconClass, linkUrl, linkTitle }) => {
              return (
                <Link to={linkUrl} className="nav-item link-button" key={linkUrl}>
                  <span className={`nav-link text-center ${location?.pathname === linkUrl && `active`}`} aria-current="page">
                    <i className={bootstrapIconClass}></i> <span className="d-block">{linkTitle}</span>
                  </span>
                </Link>
              )
            })}

          <MultiSitePicker />

          <LanguagePicker />
        </ul>
      )}
    </div>
  )
}

const UtilityBar = ({ socialItems = [] }) => {
  if (!socialItems) {
    return null
  }

  return (
    <nav className="navbar-default top-bar">
      <div className="container">
        <div className="row justify-content-end">
          <div className="col-auto">
            <ul className="nav d-none d-lg-block d-md-block d-xl-block ms-auto justify-content-end">
              {socialItems.map(menuItem => {
                return (
                  <li key={menuItem.linkTitle} className="nav-item">
                    <a href={menuItem.linkUrl} className="nav-link" target="_blank" rel="noreferrer">
                      <i className={`bi bi-${menuItem.linkTitle}`}></i>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

const Header = ({ logo }) => {
  const { t } = useTranslation()
  const social_items = useSelector(state => state.content?.header?.social_menu?.social_items)
  const { themeKey } = useSelector(getThemeConfig)

  return (
    <>
      <AccountImpersonationBanner />
      <UtilityBar socialItems={social_items} />

      {themeKey === 'default' && (
        <nav className="my-3 no-print">
          <div className="container">
            <div className="row justify-content-center justify-content-lg-between align-items-center">
              <div className="col-xl-3 col-md-2 col-9 text-center text-md-start mb-3 mb-lg-0 order-xl-1">
                <Link className="d-block" to="/">
                  <span className="navbar-brand d-block">
                    <img src={logo} className="img-fluid" alt={t('frontend.logo')} style={{ maxHeight: '60px', minWidth: '150px' }} />
                  </span>
                </Link>
              </div>
              <button className="navbar-toggler collapsed align-items-end d-xl-none d-lg-none col-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="bi bi-list h1"></span>
              </button>
              <div className="col-xl-6 col-md-10 mb-3 mb-lg-0 order-xl-3 d-none d-lg-block d-xl-block">
                <MainNavBar />
              </div>
              <div className="col-xl-3 order-xl-2">
                <SearchBar redirectToSearchPage={true} />
              </div>
            </div>
          </div>
        </nav>
      )}

      {themeKey === 'industrial' && (
        <nav className="py-3 no-print navbar-dark">
          <div className="container">
            <div className="row justify-content-center justify-content-lg-between align-items-center">
              <div className="col-xl-3 col-md-2 col-9 text-center text-md-start mb-3 mb-lg-0 order-xl-1">
                <Link className="d-block" to="/">
                  <span className="navbar-brand d-block">
                    <img src={logo} className="img-fluid" alt={t('frontend.logo')} style={{ maxHeight: '60px', minWidth: '150px' }} />
                  </span>
                </Link>
              </div>
              <button className="navbar-toggler collapsed align-items-end d-xl-none d-lg-none col-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="bi bi-list h1"></span>
              </button>
              <div className="col-xl-auto col-md-10 mb-3 mb-lg-0 order-xl-3 d-none d-lg-block d-xl-block">
                <div className="navbar-topright">
                  <SearchBar redirectToSearchPage={true} />
                  <Link to={'/my-account/login'} className="nav-item link-button">
                    <AccountBubble />
                  </Link>

                  <ul>
                    <MiniCart />
                  </ul>
                </div>

                <MainNavBar />
              </div>
            </div>
          </div>
        </nav>
      )}

      <NavBar />
    </>
  )
}

export { Header }
