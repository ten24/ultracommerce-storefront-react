import { t } from 'i18next'

const redirectURL = process.env.REACT_APP_ADMIN_URL + '?slatAction=main.OAuthLoginStorefrontHandler&integrationName=googlelogin'

const OauthGoogleLogin = ({ buttonText }) => {
  return (
    <div id="googleLogin" className="customGPlusSignIn" onClick={() => window.location.replace(redirectURL)}>
      <span className="icon"></span>
      <span className="buttonText">{buttonText || t('frontend.oauth.googlesignin')}</span>
    </div>
  )
}

export { OauthGoogleLogin }
