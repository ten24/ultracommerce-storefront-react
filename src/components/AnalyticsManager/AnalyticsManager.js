import { useSelector } from 'react-redux'
import { CookieBanner } from '@palmabit/react-cookie-law'
import { useTranslation } from 'react-i18next'

function AnalyticsManager() {
  const showCookieBanner = useSelector(state => state.configuration.analytics.showCookieBanner)
  const { t } = useTranslation()

  return (
    <>
      {showCookieBanner && (
        <CookieBanner
          message={t('frontend.coookie.banner')}
          wholeDomain={true}
          onAccept={() => {}}
          onDeclinePreferences={() => {}}
          onDeclineStatistics={() => {
            window['Statistics-Allowed'] = false
          }}
          onDeclineMarketing={() => {
            window['Marketing-Allowed'] = false
          }}
          onAcceptPreferences={() => {}}
          onAcceptStatistics={() => {
            window['Statistics-Allowed'] = true
          }}
          onAcceptMarketing={() => {
            window['Marketing-Allowed'] = true
          }}
          preferencesDefaultChecked={true}
          statisticsDefaultChecked={true}
          marketingDefaultChecked={true}
          managePreferencesButtonText={t('frontend.cookie.buttonNext')}
        />
      )}
    </>
  )
}

export { AnalyticsManager }
