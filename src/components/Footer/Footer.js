import React from 'react'
import { useSelector } from 'react-redux'
import { SignUpForm } from '..'
import styles from './Footer.module.css'
import { useUtilities } from '../../hooks'
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
          {footer?.children?.map(column => {
            if (column.urlTitle === 'stay-informed') return null
            return (
              <div key={column.urlTitle} className="col-md-2 col-sm-6">
                <h5>{column?.title}</h5>
                <div className="pb-2 mb-4 small" onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: column?.contentBody }} />
                {column.urlTitle === 'stay-informed' && <SignUpForm url={formLink} />}
              </div>
            )
          })}

          {footer?.children?.map(column => {
            if (column.urlTitle !== 'stay-informed') return null
            return (
              <div key={column.urlTitle} className="col-md-3">
                <div className="pb-2 mb-4">
                  <h5>{column?.title}</h5>
                  <small className={`${styles.stayInformed}`} onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: column?.contentBody }} />
                  <SignUpForm url={formLink} />
                </div>
              </div>
            )
          })}

          <div className={`${styles.bgFooter} p-4`}>
            <div className="container">
              <div className="text-center text-secondary small">{`@${new Date().getFullYear()} ${t('frontend.copywrite')}`}</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
