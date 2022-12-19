import { t } from 'i18next'
import { getCurrentSiteCode } from '../../utils'
//get site code
const siteCode = getCurrentSiteCode()
//set redirect url
const redirectURL = process.env.REACT_APP_ADMIN_URL + '?slatAction=main.OAuthLoginStorefrontHandler&integrationName=googlelogin&siteCode=' + siteCode

const OauthGoogleLogin = ({ buttonText }) => {
  return (
    <div id="googleLogin" className="customGPlusSignIn" onClick={() => window.location.replace(redirectURL)}>
      <span className="icon"></span>
      <span className="buttonText">{buttonText || t('frontend.oauth.googlesignin')}</span>
    </div>
  )
}

export { OauthGoogleLogin }
