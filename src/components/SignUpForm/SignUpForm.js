import MailchimpSubscribe from 'react-mailchimp-subscribe'
import styles from './SignUpForm.module.css'
import { useTranslation } from 'react-i18next'
import { useUtilities } from '../../hooks'

const MyForm = ({ status, message, onValidated }) => {
  const { t } = useTranslation()

  let email, fName, lName, company
  const submit = () => {
    email &&
      lName &&
      fName &&
      company &&
      email.value.indexOf('@') > -1 &&
      onValidated({
        EMAIL: email.value,
        LNAME: lName.value,
        FNAME: fName.value,
        COMPANY: company.value,
      })
  }

  return (
    <div className="mailchimpSubscribeForm">
      <form
        onSubmit={e => {
          submit()
          e.preventDefault()
        }}
      >
        <div className="input-group input-group-lg rounded-pill">
          <input className={`${styles.customInput} form-control appended-form-control rounded-pill px-4`} type="email" ref={node => (email = node)} placeholder={t('frontend.account.email')} required />
          <div className="input-group-append">
            <button className="btn btn-link" type="submit" onClick={submit} required>
              <i className="bi bi-envelope fs-4"></i>
            </button>
          </div>
        </div>
      </form>
      <div className="subscribe-status">
        {status === 'sending' && <div style={{ color: 'blue' }}>{t('frontend.mc.sending')}</div>}
        {status === 'error' && <div style={{ color: 'red' }} dangerouslySetInnerHTML={{ __html: message }} />}
        {status === 'success' && <div style={{ color: 'green' }} dangerouslySetInnerHTML={{ __html: message }} />}
      </div>
    </div>
  )
}

const SignUpForm = ({ urlTitle, title, contentBody, mailchimpFormLink = '', systemCode }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <div key={urlTitle} className={`d-flex my-3 SignUpForm ${systemCode}`}>
      <h5>{title}</h5>
      <div className="pb-2 mb-4 small" onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: contentBody }} />
      <MailchimpSubscribe
        url={mailchimpFormLink}
        render={({ subscribe, status, message }) => (
          <div>
            <MyForm
              status={status}
              message={message}
              onValidated={formData => {
                subscribe(formData)
              }}
            />
          </div>
        )}
      />
    </div>
  )
}
export { SignUpForm }
