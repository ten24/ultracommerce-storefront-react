import { isImpersonating } from '../../../utils'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
const AccountImpersonationBanner = () => {
  const { t } = useTranslation()
  const { firstName, lastName } = useSelector(state => state.userReducer)
  if (!isImpersonating()) return null
  return (
    <div className="container-fluid impersonation-banner">
      <div className="row d-flex justify-content-center  align-items-center bg-primary ">
        <div className="col-auto py-2">
          <div className="">
            {t('frontend.account.account_impersonation_banner')}
            <span className="fw-bolder">{`, ${firstName} ${lastName}. `}</span>
            <Link to={'/my-account/impersonation'} className="link">
              {t('frontend.account.end_impersonation')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AccountImpersonationBanner }
