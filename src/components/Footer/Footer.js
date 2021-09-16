import React from 'react'
import { useSelector } from 'react-redux'
import { SignUpForm } from '..'
import styles from './Footer.module.css'
import { useUtilities } from '../../hooks'
import logo from '../../assets/images/slatwall-commerce-logo-white.svg'
import { useTranslation } from 'react-i18next'

function Footer() {
  const formLink = useSelector(state => state.configuration.footer.formLink)
  const content = useSelector(state => state.content)
  let { eventHandlerForWSIWYG } = useUtilities()
  const footer = content['footer']
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="container pt-5">
        <div className="row justify-content-between pt-2">
          <div className="col-md-3">
            <span>
              <small className="text-white d-block mb-3">{t('frontend.powered_by')}</small>
            </span>
            <a href="https://www.slatwallcommerce.com/" target="_blank" rel="noreferrer">
              <img src={logo} className="img-fluid mb-4" alt="Slatwall Commerce" width="185" loading="lazy" />
            </a>
            <p>
              <small>{t('frontend.slatwall_description')}</small>
            </p>
          </div>

          {footer?.children?.map(column => {
            if (column.urlTitle === 'stay-informed') return null
            return (
              <div key={column.urlTitle} className="col-md-2 col-sm-6">
                <h4>{column?.title}</h4>
                <div className="pb-2 mb-4" onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: column?.customBody }} />
                {column.urlTitle === 'stay-informed' && <SignUpForm url={formLink} />}
              </div>
            )
          })}

          {footer?.children?.map(column => {
            if (column.urlTitle !== 'stay-informed') return null
            return (
              <div key={column.urlTitle} className="col-md-4">
                <div className="pb-2 mb-4">
                  <h4>{column?.title}</h4>
                  <div className={`${styles.stayInformed}`} onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: column?.customBody }} />
                  <SignUpForm url={formLink} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </footer>
  )
}

export { Footer }
