import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { getMyAccountUrl } from '../../utils'

const AccountBubble = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const user = useSelector(state => state.userReducer)
  const { accountID, firstName } = user

  return (
    <Link to={getMyAccountUrl()} className="nav-item link-button">
      <span className={`nav-link text-center ${location?.pathname === '/my-account/overview' && `active`}`}>
        <i className="bi bi-person-circle fs-4"></i>
        {/* <div className="fs-6 position-absolute top-1 start-100 translate-middle badge rounded-pill bg-primary">My account</div> */}
        <span className="d-block">{accountID === '' ? ` ${t('frontend.core.hello')}, ${t('frontend.account.sign_in')}` : ` ${t('frontend.core.hello')}, ${firstName}`}</span>
      </span>
    </Link>
  )
}

export { AccountBubble }
