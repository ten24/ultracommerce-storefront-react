import MailchimpSubscribe from 'react-mailchimp-subscribe'
import styles from './SignUpForm.module.css'
import { useTranslation } from 'react-i18next'

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
    <>
      <div className="input-group input-group-lg rounded-pill">
        <input className={`${styles.customInput} form-control text-white appended-form-control rounded-pill px-4`} type="email" ref={node => (email = node)} placeholder={t('frontend.account.email')} required />
        <div className="input-group-append">
          <button className="btn btn-link" type="submit" onClick={submit} required>
            <i className="bi bi-envelope text-white fs-4"></i>
          </button>
        </div>
      </div>
      <div className="subscribe-status">
        {status === 'sending' && <div style={{ color: 'blue' }}>{t('frontend.mc.sending')}</div>}
        {status === 'error' && <div style={{ color: 'red' }} dangerouslySetInnerHTML={{ __html: message }} />}
        {status === 'success' && <div style={{ color: 'green' }} dangerouslySetInnerHTML={{ __html: message }} />}
      </div>
    </>
  )
}

const SignUpForm = ({ url }) => {
  return (
    <MailchimpSubscribe
      url={url}
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
  )
}
export { SignUpForm }
