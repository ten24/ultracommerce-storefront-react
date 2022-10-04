import React, { useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import { useTranslation } from 'react-i18next'

const SearchBar = ({ redirectToSearchPage = true }) => {
  const textInput = useRef(null)
  const navigate = useNavigate()
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
    if (redirectToSearchPage) {
      navigate({
        pathname: '/shop',
        search: queryString.stringify({ keyword: searchValue }, { arrayFormat: 'comma' }),
      })
      return
    }
    navigate({
      search: queryString.stringify({ ...queryString.parse(location.search), keyword: searchValue }, { arrayFormat: 'comma' }),
    })
    textInput.current.value = ''
  }

  return (
    <form className="mb-1">
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
