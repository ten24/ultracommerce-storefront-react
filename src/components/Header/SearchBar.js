import React, { useRef, useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import { axios, SlatwalApiService } from '../../services'
import { useDebounce } from 'react-use'

const SearchEntry = ({ optionvalue, spellingSuggestion, toPrefix, setHide }) => {
  return (
    <>
      <Link to={toPrefix + optionvalue.slug + '?keyword=' + spellingSuggestion} className="search-text-span px-2">
        <span className="text-secondary search-text-span" onClick={() => setHide(false)}>
          {spellingSuggestion} in <span className="fw-bold text-dark">{optionvalue.slug}</span>
        </span>
      </Link>
    </>
  )
}

const SearchBar = ({ redirectToSearchPage = true, searchBoxPlaceholder, searchBoxTypeaheadFlag = false, searchBoxTypeaheadKeys = '', searchBoxShowTopProductsFlag = false }) => {
  const textInput = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [searched, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [hide, _setHide] = useState(false)
  const headers = {}
  var searchCount = 0 //To limit the number of search results to be displayed.LL
  const wrapperRef = useRef(null)

  useDebounce(
    () => {
      predictiveSearch(searchTerm)
    },
    500,
    [searchTerm]
  )

  const setHide = val => searchBoxTypeaheadFlag && _setHide(val)

  const searchBoxTypeaheadKeyArray = searchBoxTypeaheadKeys?.split(',')
  const keyIsAccepted = k => searchBoxTypeaheadKeyArray?.reduce((acc, curr) => acc || curr === k, false) ?? true
  const keyToLinkPrefix = k => {
    if (!keyIsAccepted) throw new Error('Key is not in accepted keys')
    if (k === 'productType') return '/product-type'
    else return `/${k}/`
  }

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

  const predictiveSearch = value => {
    setHide(true)
    let source = axios.CancelToken.source()
    let payload = { keyword: value }
    if (value === '') {
      setHide(false)
      setSearch()
      return null
    }
    SlatwalApiService.products.searchTypeahead(payload, headers, source).then(res => {
      if (res.isSuccess()) {
        setSearch(res.success().data)
      }
    })
  }

  return (
    <form
      ref={wrapperRef}
      className="mb-1"
      onBlur={e => {
        e.preventDefault()
        if (!e.currentTarget.contains(e.relatedTarget)) setHide(false)
      }}
      onFocus={e => {
        e.preventDefault()
        setHide(true)
      }}
    >
      <div className="input-group input-group-lg rounded-pill">
        <input
          className="form-control appended-form-control rounded-pill"
          type="text"
          ref={textInput}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              setHide(false)
              makeSearch(textInput.current.value)
            }
          }}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={searchBoxPlaceholder}
          required
        />

        {hide && searched && (
          <div className={`d-flex flex-row w-100 predictive-search-container shadow-sm`} style={{ borderRadius: '0 0 5px 5px' }}>
            <div className="w-100">
              {!!searched?.spellingSuggestion?.[0] && ++searchCount && (
                <div
                  className="d-flex flex-column search-prediction-container"
                  onClick={() => {
                    setHide(false)
                    makeSearch(searched?.spellingSuggestion?.[0]?.text)
                  }}
                >
                  <div className="search-text-span px-2">
                    <span className="fw-bold text-dark spelling_suggestion">{searched?.spellingSuggestion?.[0]?.text}</span>
                  </div>
                </div>
              )}
              {searched?.spellingSuggestion?.map((spellingSuggestion, idx) => {
                searchCount += 1
                return (
                  <div key={idx}>
                    {Object.entries(searched?.potentialFilters).map(([key, value]) => {
                      if (value?.options !== [] && searchCount <= 8) {
                        return (
                          <div className="d-flex flex-column search-prediction-container" key={key}>
                            {keyIsAccepted(key) &&
                              value.options.map((optionvalue, index) => {
                                searchCount += 1
                                return <SearchEntry key={key + index} toPrefix={keyToLinkPrefix(key)} spellingSuggestion={spellingSuggestion?.text} optionvalue={optionvalue} setHide={setHide} />
                              })}
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        )}

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
