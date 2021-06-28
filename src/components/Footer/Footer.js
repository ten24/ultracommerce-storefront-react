import React from 'react'
import { useSelector } from 'react-redux'
import { ActionBanner, SignUpForm } from '..'
import styles from './Footer.module.css'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getAllFooterContentSelector } from '../../selectors'

function Footer() {
  const { t } = useTranslation()
  let history = useHistory()
  const formLink = useSelector(state => state.configuration.footer.formLink)
  const footerContent = useSelector(getAllFooterContentSelector)
  let getInTouch,
    stayInformed,
    siteLinks = ''
  if (footerContent.length) {
    getInTouch = footerContent.map(content => (content.key === 'footer/get-in-touch' ? content : null)).filter(item => item)
    getInTouch = getInTouch.length ? getInTouch[0].customBody : ''

    stayInformed = footerContent.map(content => (content.key === 'footer/stay-informed' ? content : null)).filter(item => item)
    stayInformed = stayInformed.length ? stayInformed[0].customBody : ''

    siteLinks = footerContent.map(content => (content.key === 'footer/site-links' ? content : null)).filter(item => item)
    siteLinks = siteLinks.length ? siteLinks[0].customBody : ''
  }

  return (
    <footer className="footer  pt-5">
      <ActionBanner />
      <div className={`${styles.bottomBar} p-5`}>
        <div className="container">
          <div className="row pt-2">
            <div className="col-md-2 col-sm-6">
              {typeof siteLinks === 'string' && (
                <div
                  className="pb-2 mb-4"
                  onClick={event => {
                    event.preventDefault()
                    if (event.target.getAttribute('href')) {
                      history.push(event.target.getAttribute('href'))
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: siteLinks }}
                />
              )}
              {typeof siteLinks !== 'string' && <div className="pb-2 mb-4 footer-content">{siteLinks}</div>}
            </div>
            <div className="col-md-4 col-sm-6">
              {typeof getInTouch === 'string' && <div className="pb-2 mb-4" dangerouslySetInnerHTML={{ __html: getInTouch }} />}
              {typeof getInTouch !== 'string' && <div className="pb-2 mb-4 ">{getInTouch}</div>}
            </div>
            <div className="col-md-6">
              <div className="pb-2 mb-4">
                {typeof stayInformed === 'string' && <div className={`${styles.stayInformed}`} dangerouslySetInnerHTML={{ __html: stayInformed }} />}
                {typeof stayInformed !== 'string' && <div className={`${styles.stayInformed}`}>{stayInformed}</div>}

                <SignUpForm url={formLink} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer text-center bg-light p-3">
        <p className="m-0">{`@${new Date().getFullYear()} ${t('frontend.copywrite')}`}</p>
      </div>
    </footer>
  )
}

export { Footer }
