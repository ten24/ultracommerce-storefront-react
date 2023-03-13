import React, { useRef, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { SlatwalApiService } from '../../services'
import { Link } from 'react-router-dom'
import { ProductImage } from '../../components'
import { getProductRoute } from '../../selectors'
import { useSelector } from 'react-redux'
import { useFormatCurrency } from '../../hooks/'

const SearchBar = ({ redirectToSearchPage = false, setMobileModalOpen = '', setModalSearched = '', setModalHide = '', toggle = true }) => {
  const textInput = useRef(null)
  let navigate = useNavigate()
  const { t } = useTranslation()
  const location = useLocation()
  const [searched, setSearch] = useState('')
  const wrapperRef = useRef()
  const [formatCurrency] = useFormatCurrency({})
  const headers = {}
  var searchCount = 0
  let productSearchCount = 0
  const productRouting = useSelector(getProductRoute)
  const [searchTerm, setSearchTerm] = useState('')
  const [hide, setHide] = useState(false)
  let [opened, setOpened] = useState(false)

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpened(false)
        setHide(false)
      }
    }

    if (hide || opened) document.addEventListener('mousedown', handleClickOutside)
    else document.removeEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  useEffect(() => {
    if (location.search) {
      setOpened(true)
      const { keyword } = queryString.parse(location.search)
      if (keyword) {
        textInput.current.value = keyword
      } else {
        textInput.current.value = ''
      }
    } else {
      setOpened(false)
      textInput.current.value = ''
    }
  }, [location])

  const makeSearch = searchValue => {
    if (redirectToSearchPage) {
      navigate({
        pathname: '/shop',
        search: queryString.stringify({ keyword: searchValue }, { arrayFormat: 'comma' }),
      })
      if (setMobileModalOpen !== '') {
        setMobileModalOpen(false)
      }
      return
    }
    navigate({
      search: queryString.stringify({ ...queryString.parse(location.search), keyword: searchValue }, { arrayFormat: 'comma' }),
    })
    textInput.current.value = ''
  }
  useEffect(() => {
    const getData = setTimeout(() => {
      predictiveSearch(searchTerm)
    }, 1000)
    return () => clearTimeout(getData)
    // eslint-disable-next-line
  }, [searchTerm])

  const predictiveSearch = value => {
    setHide(true)
    if (setModalHide !== '') {
      setModalHide(true)
    }
    let source = axios.CancelToken.source()
    let payload = { keyword: value }
    if (value === '') {
      setHide(false)
      if (setModalHide !== '') {
        setModalHide(false)
      }
      setSearch()
      if (setModalSearched !== '') {
        setModalSearched()
      }
      return null
    }
    SlatwalApiService.products.searchTypeahead(payload, headers, source).then(res => {
      if (res.isSuccess()) {
        setSearch(res.success().data)
        if (setModalSearched !== '') {
          setModalSearched(res.success().data)
        }
      }
    })
  }

  return (
    <form ref={wrapperRef} className={`mb-0 bg-transparent search-bar`}>
      <div className="input-group rounded-pill">
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
          onChange={e => {
            e.preventDefault()
            setSearchTerm(e.target.value)
          }}
          placeholder={t('frontend.search.placeholder')}
          required
        />
        <button
          onClick={e => {
            e.preventDefault()
            makeSearch(textInput.current.value)
            setHide(false)
          }}
          className="btn btn-link px-2"
          type="button"
        >
          <i className="bi bi-search"></i>
        </button>
      </div>
      {hide && searched && (
        <div className="search-results-container predictive-search-container p-0 shadow-sm px-2 py-3 d-lg-flex d-none flex-column ">
          <div className="category-results-container px-2">
            <div className="category-header py-2">
              <span className="brand-blue fw-bold small">{t('frontend.blog.categories').toUpperCase()}</span>
            </div>
            <div>
              {!!searched?.potentialFilters?.category?.options && (
                <>
                  {searched.potentialFilters?.category?.options?.map((option, idx) => {
                    ++searchCount
                    if (searchCount < 5) {
                      return (
                        <Link
                          className="d-flex align-items-center search-prediction-container"
                          to={`/category/${option.slug}`}
                          key={idx}
                          onClick={() => {
                            setHide(false)
                          }}
                        >
                          <div className="search-text-span py-2">
                            <span className="fw-bold text-dark spelling_suggestion">{option.name}</span>
                          </div>
                          <div className="ms-1">
                            <span className="text-dark spelling_suggestion text-muted">{option.count}</span>
                          </div>
                        </Link>
                      )
                    }
                    return <></>
                  })}
                </>
              )}
            </div>
          </div>
          {!searched?.products?.elasticSearchError && searched?.products?.length !== 0 && (
            <>
              <hr className="category-product-divider" />
              <div className="products-results-container px-2">
                <div className="products-header pb-4">
                  <span className="brand-blue fw-bold small">{t('frontend.product.products').toUpperCase()}</span>
                </div>
              </div>
              <div className="d-flex flex-column px-2">
                {searched?.products?.map((product, idx, { length }) => {
                  productSearchCount++
                  if (productSearchCount < 4) {
                    return (
                      <React.Fragment key={idx}>
                        <Link to={`/${productRouting}/${product.product_urlTitle}?skuid=${product.skuID}`}>
                          <div className="col-12 d-flex align-items-center justify-content-between w-100 p-2">
                            <ProductImage customClass="img-fluid search-card-image col-2" imageFile={product.imageFile} skuID={product.skuID} />
                            <span className="px-1 col-8 brand-navy search-product-name">{product.skuName || product?.product_productName}</span>
                            <div className="d-flex col-2 flex-column align-items-end">
                              <span className="m-0 brand-navy fw-bold">{formatCurrency(product.skuPrice)}</span>
                            </div>
                          </div>
                        </Link>
                        {length - 1 !== idx && productSearchCount <= 2 && <hr className="m-0 category-product-divider" />}
                      </React.Fragment>
                    )
                  }
                  return <></>
                })}
              </div>
            </>
          )}
          {!!searched?.spellingSuggestion?.[0] && (
            <Link
              to={`/shop?keyword=${searched?.spellingSuggestion?.[0]?.text}`}
              onClick={() => {
                setHide(false)
              }}
            >
              <button className="btn btn-secondary mt-4 brand-navy w-100">{t('frontend.header.seeAllResults.text')}</button>
            </Link>
          )}
        </div>
      )}
      <button
        onClick={e => {
          e.preventDefault()
          setOpened(true)
          textInput.current.focus()
        }}
        className={`btn mb-0 px-2 search-btn ${!opened && toggle ? '' : 'd-none'}`}
        type="button"
      ></button>
    </form>
  )
}

export { SearchBar }
