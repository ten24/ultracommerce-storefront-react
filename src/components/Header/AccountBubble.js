import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

const AccountBubble = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const user = useSelector(state => state.userReducer)
  const { accountID, firstName } = user

  return (
    <span className={`nav-link text-center ${location?.pathname === '/my-account/overview' && `active`}`}>
      <i className="bi bi-person-circle fs-4"></i>
      {/* <div className="fs-6 position-absolute top-1 start-100 translate-middle badge rounded-pill bg-primary">My account</div> */}
      <span className="d-block">{accountID === '' ? ` ${t('frontend.core.hello')}, ${t('frontend.account.sign_in')}` : ` ${t('frontend.core.hello')}, ${firstName}`}</span>
    </span>
  )
}

export { AccountBubble }
