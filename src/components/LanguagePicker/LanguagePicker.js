import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { getAvailableLocales } from '../../selectors'

const LanguagePicker = () => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const wrapperRef = useRef(null)
  const [defaultSelectedLocale, setDefaultLocale] = useState('en_us')
  const getAvailableLocalesList = useSelector(getAvailableLocales)?.split(',')
  const languageNames = new Intl.DisplayNames(['en'], {
    type: 'language',
  })

  useEffect(() => {
    const isDefaultExistInLanguageList = getAvailableLocalesList?.filter(locale => locale === defaultSelectedLocale).length
    if (isDefaultExistInLanguageList === 0) {
      window.localStorage.setItem('i18nextLng', 'en_us')
      setDefaultLocale('en_us')
    } else {
      setDefaultLocale(localStorage.getItem('i18nextLng'))
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperRef, show])
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
        <i className="bi bi-translate"></i> <span className="d-block">{t('frontend.languagePicker.changeLanguage')}</span>
      </span>
      <div className={`dropdown-menu dropdown-menu-end p-0 border-0 shadow-lg ${show && 'show'}`} style={{ minWidth: '180px' }}>
        <div className="accordion change-site-dropdown">
          <h3>{t('frontend.languagePicker.setlanguage')}</h3>
          <ul>
            {getAvailableLocalesList?.map(value => {
              const code = value.split('_').at(0)
              return (
                <li key={code}>
                  <button
                    type="button"
                    className={`btn link-btn ${defaultSelectedLocale === value ? 'active' : ''}`}
                    onClick={() => {
                      i18next.changeLanguage(code)
                      window.localStorage.setItem('i18nextLng', value)
                      setDefaultLocale(value)
                      toast.success(t('frontend.languagePicker.languageChanged'))
                    }}
                  >
                    {languageNames.of(code)}
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

export { LanguagePicker }
