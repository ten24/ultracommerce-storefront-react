import React, { useRef, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import queryString from 'query-string'
import { useTranslation } from 'react-i18next'

function SearchBar() {
  const textInput = useRef(null)
  let history = useHistory()
  const { t } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    if (location.search) {
      const { keyword } = queryString.parse(location.search)
      if (keyword) {
        textInput.current.value = keyword
      } else {
        textInput.current.value = ''
      }
    } else {
      textInput.current.value = ''
    }
  }, [location])

  const makeSearch = searchValue => {
    if (!searchValue || searchValue.length === 0) {
      history.push({
        pathname: '/shop',
      })
      return
    }
    history.push({
      pathname: '/shop',
      search: queryString.stringify({ keyword: searchValue }, { arrayFormat: 'comma' }),
    })
    textInput.current.value = ''
  }

  return (
    <form className="mb-0">
      <div className="input-group input-group-lg rounded-pill">
        <input
          className="form-control appended-form-control rounded-pill"
          type="text"
          ref={textInput}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              makeSearch(textInput.current.value)
            }
          }}
          placeholder={t('frontend.search.placeholder')}
          required
        />
        <button
          onClick={e => {
            e.preventDefault()
            makeSearch(textInput.current.value)
          }}
          className="btn btn-link"
          type="button"
        >
          <i className="bi bi-search"></i>
        </button>
      </div>
    </form>
  )
}

export { SearchBar }
