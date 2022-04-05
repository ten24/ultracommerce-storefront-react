import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../actions'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

const AccountBubble = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const user = useSelector(state => state.userReducer)
  const { accountID, firstName } = user
  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])
  return (
    <span className={`nav-link text-center ${location?.pathname === '/my-account' && `active`}`}>
      <i className="bi bi-person-circle fs-4"></i>
      {/* <div className="fs-6 position-absolute top-1 start-100 translate-middle badge rounded-pill bg-primary">My account</div> */}
      <span className="d-block">{accountID === '' ? ` ${t('frontend.core.hello')}, ${t('frontend.account.sign_in')}` : ` ${t('frontend.core.hello')}, ${firstName}`}</span>
    </span>
  )
}

export { AccountBubble }
