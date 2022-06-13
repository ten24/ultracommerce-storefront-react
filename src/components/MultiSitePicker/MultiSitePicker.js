import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { getEnableMultiSite, getSites } from '../../selectors'

const MultiSitePicker = () => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShow(false)
      }
    }
    if (show) document.addEventListener('mousedown', handleClickOutside)
    else document.removeEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef, show])
  const sites = useSelector(getSites)
  const currentSiteCode = localStorage.getItem('siteCode')
  const enableMultiSite = useSelector(getEnableMultiSite)
  const switchSite = siteCode => {
    localStorage.setItem('siteCode', siteCode)
    window.location.reload(true)
  }
  if (sites?.length < 2) return null
  if (!enableMultiSite) return null
  return (
    <li ref={wrapperRef} className="nav-item dropdown">
      <span
        onClick={() => {
          setShow(!show)
        }}
        id="navbarDropdown"
        className={`cart position-relative nav-link text-center clickable`}
      >
        <i className="fs-6 position-absolute top-1 start-100 translate-middle badge rounded-pill bg-primary"></i>
        <i className="bi bi-globe"></i> <span className="d-block">{t('frontend.sitePicker.changeSite')}</span>
      </span>
      <div className={`dropdown-menu dropdown-menu-end p-0 border-0 shadow-lg ${show && 'show'}`} style={{ minWidth: '350px' }}>
        <div className="accordion change-site-dropdown">
          <h3>{t('frontend.sitePicker.allSite')}</h3>
          <ul>
            {sites.map(({ siteName, siteCode }) => {
              return (
                <li key={siteCode}>
                  <button
                    className={`btn link-btn ${currentSiteCode === siteCode ? 'active' : ''}`}
                    onClick={e => {
                      e.preventDefault()
                      switchSite(siteCode)
                    }}
                  >
                    {siteName}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </li>
  )
}

export { MultiSitePicker }
