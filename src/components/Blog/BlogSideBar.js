import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import queryString from 'query-string'
import { Link, useLocation } from 'react-router-dom'

import { useGetBlogCatagories } from '../../hooks'
import { getBlogRoute } from '../../selectors/configurationSelectors'
import { useSelector } from 'react-redux'

const CategoryList = ({ categories, selectedCategory }) => {
  const { t } = useTranslation() // Translate
  const blogPath = useSelector(getBlogRoute)

  return (
    <div className="filter-block ps-3 pt-3 blog-catogory bg-light pb-1">
      <h3>{t('frontend.blog.categories')}</h3>
      <ul className="list-unstyled text-underline">
        {categories &&
          categories.map(({ name, value }) => {
            return (
              <li key={value} className="blog-list">
                <div className="d-flex align-center">
                  <Link className={selectedCategory === value ? 'selected-categories' : ''} to={`/${blogPath}?category=${value}`}>
                    {name}
                  </Link>
                </div>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

const BlogSidebar = ({ show = true, blogPost = false }) => {
  let [request, setRequest] = useGetBlogCatagories()
  const blogKey = useSelector(getBlogRoute)
  const loc = useLocation()
  let params = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })

  useEffect(() => {
    let didCancel = false
    if (!request.isFetching && !request.isLoaded && !didCancel) {
      setRequest({ ...request, isFetching: true, isLoaded: false, params: { content_type: blogKey }, makeRequest: true })
    }
    return () => {
      didCancel = true
    }
  }, [request, blogKey, setRequest])
  if (!show) return null

  return (
    <div className={blogPost ? 'col-lg-12' : 'col-lg-4'}>
      <div className="sidebar">{request.isLoaded && <CategoryList selectedCategory={params?.category} categories={request.data} />}</div>
    </div>
  )
}

export { BlogSidebar }
