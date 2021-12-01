import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import { SimpleImage } from '..'

import { useFormatDateTime, useUtilities } from '../../hooks'

function BlogListBody({ blog }) {
  const route = useHistory()
  const [formateDate] = useFormatDateTime()
  const { t } = useTranslation() // Translate
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <article className="shadow mb-5">
      <div className="max-height-img">{blog.postImage && <SimpleImage src={blog.postImage.url} alt={blog.postTitle} />}</div>
      <h2 className="entry-title px-4 py-3 m-0 text-underline">
        <Link className="link" to={`/blog/${blog.slug}`}>
          {blog.postTitle}
        </Link>
      </h2>

      <div className="entry-meta px-4">
        <ul className="list-unstyled d-flex m-0">
          {!!blog.authorName && (
            <li className="d-flex align-items-center me-3">
              <i className="bi bi-person me-2 small line-height-0"></i>
              {blog.authorName}
            </li>
          )}
          {!!blog.publicationDate && (
            <li className="d-flex align-items-center me-3">
              <i className="bi bi-clock me-2 small line-height-0"></i>
              {formateDate(blog.publicationDate)}
            </li>
          )}
        </ul>
      </div>
      <div className="entry-content pt-2 px-4 pb-4">
        {!!blog.postSummary && <p onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: blog.postSummary }} />}
        <button
          className="btn btn-primary btn-block"
          onClick={() => {
            route.push({ pathname: `/blog/${blog.slug}` })
          }}
        >
          {t('frontend.blog.readMore')}
        </button>
      </div>
    </article>
  )
}

export { BlogListBody }
