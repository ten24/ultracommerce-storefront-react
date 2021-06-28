import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import queryString from 'query-string'
import { useHistory, useLocation } from 'react-router-dom'

import { useGetBlogCatagories } from '../../hooks'

const CategoryList = ({ categories, setCategory, selectedCategory }) => {
  const { t } = useTranslation() // Translate
  const loc = useLocation()
  let history = useHistory()
  const params = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  return (
    <div className="filter-block ps-3 pt-3 blog-catogory bg-light pb-1">
      <h3>{t('frontend.blog.categories')}</h3>
      <ul className="list-unstyled text-underline">
        {categories &&
          categories.map(({ name, value }) => {
            return (
              <li key={value} className="blog-list">
                <div className="d-flex align-center">
                  <div
                    onClick={e => {
                      e.preventDefault()
                      setCategory(value)
                    }}
                    className={selectedCategory === value ? 'selected-categories' : ''} // to fix the Received false for a non-boolean attribute className. warning we have used ternary operator
                  >
                    {name}
                  </div>
                  {params.category === value && (
                    <i
                      onClick={() => {
                        delete params['category']
                        delete params['currentPage']
                        history.push({
                          pathname: '/blog',
                          search: queryString.stringify(params, { arrayFormat: 'comma' }),
                        })
                      }}
                      className="ms-2 mt-1 bi bi-x-circle-fill"
                    ></i>
                  )}
                </div>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

const BlogSidebar = ({ blogPost = false }) => {
  let [request, setRequest] = useGetBlogCatagories()
  const loc = useLocation()
  let params = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  let history = useHistory()

  useEffect(() => {
    let didCancel = false
    if (!request.isFetching && !request.isLoaded && !didCancel) {
      setRequest({ ...request, isFetching: true, isLoaded: false, params: { content_type: 'blog' }, makeRequest: true })
    }
    return () => {
      didCancel = true
    }
  }, [request, setRequest])

  return (
    <div className={blogPost ? 'col-lg-12' : 'col-lg-4'}>
      <div className="sidebar">
        {request.isLoaded && (
          <CategoryList
            selectedCategory={params?.category}
            categories={request.data}
            setCategory={category => {
              history.push({
                pathname: '/blog',
                search: queryString.stringify({ category }, { arrayFormat: 'comma' }),
              })
            }}
          />
        )}
      </div>
    </div>
  )
}

export { BlogSidebar }
