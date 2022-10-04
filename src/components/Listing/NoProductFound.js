import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { SearchBar } from '../Header/SearchBar'

function NoProductFound() {
  const { t } = useTranslation()
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const query = queryString.parse(search)

  const isFilterApplied = Object.keys(query).find(filter => {
    return filter !== 'keyword' && query[filter] && query[filter].length > 0
  })

  return (
    <div className="col text-center p-5 bg-light">
      <h3>{t('frontend.product.noProductsFound')}</h3>
      {query.keyword && (
        <div className="my-3">
          <h5>{t('frontend.product.noKeywordSearch')}</h5>

          <div className="row d-flex justify-content-center">
            <div className="col-6 col-md-8 col-sm-12">
              <SearchBar />
            </div>
          </div>
        </div>
      )}

      {isFilterApplied && (
        <button
          className="btn btn-primary btn-sm "
          onClick={() => {
            navigate(pathname)
          }}
        >
          {t('frontend.product.removeFilter')}
        </button>
      )}
      <p className="mt-4">
        {t('frontend.product.needAssistance')}
        <Link className="mx-2" to="/contact">
          <u>{t('frontend.nav.contact')}</u>
        </Link>
      </p>
    </div>
  )
}

export { NoProductFound }
