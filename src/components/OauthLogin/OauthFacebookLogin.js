const redirectURL = process.env.REACT_APP_ADMIN_URL + '?slatAction=main.OAuthLoginStorefrontHandler&integrationName=facebooklogin'

const OauthFacebookLogin = ({ buttonText }) => {
  return (
    <div id="FacebookLogin" className="btn btn-primary btn-lg m-2" onClick={() => window.location.replace(redirectURL)}>
      <i className="bi bi-facebook m-2" />
      <span className="buttonText ml-2">{buttonText}</span>
    </div>
  )
}

export { OauthFacebookLogin }
