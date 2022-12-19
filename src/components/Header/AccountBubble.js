import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getMyAccountUrl, isAuthenticated } from '../../utils'
import { logout } from '../../actions'
import { useState } from 'react'

const AccountBubble = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const user = useSelector(state => state.userReducer)
  const { firstName } = user
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [disableButton, setdisableButton] = useState(false)
  const isLoggedIn = isAuthenticated()
  //TODO: Eventually this needs to be a config with dropdown

  return (
    <>
      <Link to={getMyAccountUrl()} className="nav-item link-button">
        <span className={`nav-link text-center ${location?.pathname === '/my-account/overview' && `active`}`}>
          <i className="bi bi-person-circle fs-4"></i>
          {/* <div className="fs-6 position-absolute top-1 start-100 translate-middle badge rounded-pill bg-primary">My account</div> */}
          <span className="d-block">{!isLoggedIn ? ` ${t('frontend.core.hello')}, ${t('frontend.account.sign_in')}` : ` ${t('frontend.core.hello')}, ${firstName}`}</span>
        </span>
      </Link>
      {isLoggedIn && (
        <button
          type="button"
          disabled={disableButton}
          onClick={() => {
            setdisableButton(true)
            dispatch(logout(t('frontend.account.logout_success'), t('frontend.account.logout_failure'))).then(() => {
              navigate({
                pathname: '/',
              })
            })
          }}
          className=" nav-item  nav-link text-center link-button"
        >
          {t('frontend.core.logout')}
        </button>
      )}
    </>
  )
}

export { AccountBubble }
