import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { logout } from '../../../actions/'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { getMyAccountMenu } from '../../../selectors/'

const isSelectedClass = 'active'

const AccountSidebar = () => {
  const { t } = useTranslation()
  let loc = useLocation()
  const accountMenu = useSelector(getMyAccountMenu)

  return (
    <>
      <div className="col-md-4 col-lg-3">
        <nav className="navbar flex-column align-items-start navbar-expand-md navbar-light bg-light p-2 mb-5 text-left">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse w-100" id="navbarNav">
            <ul className="navbar-nav flex-column w-100">
              <li key="/my-account" className="nav-item">
                <Link to="/my-account" className={`nav-link ${loc.pathname === `/my-account` && isSelectedClass}`}>
                  <i className="far pr-2" /> {t('frontend.account.overview')}
                </Link>
              </li>
              {accountMenu.length > 0 &&
                accountMenu.map(({ contentID, urlTitlePath, title }) => {
                  return (
                    <li key={contentID} className="nav-item">
                      <Link to={`/${urlTitlePath}`} className={`nav-link  ${loc.pathname.startsWith(`/${urlTitlePath}`) && isSelectedClass}`}>
                        <i className="far pr-2" /> {title}
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </div>
        </nav>
      </div>
    </>
  )
}

const AccountHeader = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [disableButton, setdisableButton] = useState(false)

  return (
    <div className="bg-light p-3 pt-4 mb-4 text-center no-print">
      <h1 className="display-4">{t('frontend.account.myAccount')}</h1>
      <button
        type="button"
        disabled={disableButton}
        onClick={() => {
          setdisableButton(true)
          dispatch(logout(t('frontend.account.logout_success'), t('frontend.account.logout_failure')))
        }}
        className="btn link-btn btn-link"
      >
        {t('frontend.core.logout')}
      </button>
    </div>
  )
}

const MyAccountLayout = ({ children }) => {
  return (
    <>
      <AccountHeader />
      <div className="container pb-5 mb-2 mb-md-3">
        <div className="row">
          <AccountSidebar />
          <section className="col-lg-8">{children}</section>
        </div>
      </div>
    </>
  )
}

const PromptLayout = ({ children }) => {
  const { t } = useTranslation()
  return (
    <div className="container py-4 py-lg-5 my-4">
      <div className="row d-flex justify-content-center">
        <div className="mb-5   bg-white col-md-6 ">
          <div className="container container-custom-xs">
            <div className="text-center">
              <h1 className="display-3">{t('frontend.account.myAccount')}</h1>
            </div>
            <hr />
            <div className="card-body">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AccountLayout = MyAccountLayout
export { AccountLayout, PromptLayout }
