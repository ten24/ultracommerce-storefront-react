import { useSelector } from 'react-redux'
import { CookieBanner } from '@palmabit/react-cookie-law'
import { useTranslation } from 'react-i18next'
import { useUtilities } from '../../hooks'

const AnalyticsManager = ({ cookieSettings }) => {
  const showCookieBanner = useSelector(state => state.configuration.analytics.showCookieBanner)
  const { eventHandlerForWSIWYG } = useUtilities()

  const { t } = useTranslation()
  const settings = {
    message: t('frontend.coookie.banner'),
    wholeDomain: true,
    onAccept: () => {},
    onAcceptPreferences: () => {},
    onAcceptStatistics: () => {
      window['Statistics-Allowed'] = true
    },
    onAcceptMarketing: () => {
      window['Statistics-Allowed'] = true
    },
    preferencesDefaultChecked: true,
    statisticsDefaultChecked: true,
    marketingDefaultChecked: true,
    policyLink: '/governance-and-policies',
    privacyPolicyLinkText: t('frontend.cookie_policy'),
    ...cookieSettings,
  }
  return <div onClick={eventHandlerForWSIWYG}>{showCookieBanner && <CookieBanner {...settings} />}</div>
}

export { AnalyticsManager }
