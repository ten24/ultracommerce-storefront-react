import { t } from 'i18next'
//get site code
const siteCode = localStorage.getItem('siteCode') ? localStorage.getItem('siteCode') : process.env.REACT_APP_SITE_CODE
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
