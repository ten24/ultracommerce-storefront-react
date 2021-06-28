import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useFormatDate } from '../../hooks/useFormatDate'

function LatestNews({ list }) {
  const { t } = useTranslation()
  const [formateDate] = useFormatDate()
  if (!list || !list.items || list.items.length === 0) {
    return null
  }

  return (
    <div className="container">
      <header className="section-title">
        <h2>{t('frontend.home.latest_news')}</h2>
      </header>
      <div className="row">
        {list.items.map(data => {
          return (
            <div key={data.postTitle} className="col-md-4">
              <article className="card border-0 shadow m-3">
                {data.postImage ? <img src={data.postImage} className="img-fluid blog-image" alt={data.postTitle} /> : <div className="img-fluid blog-image" />}
                <div className="card-body">
                  <h3 className="text-truncate">
                    <Link className="link" to="/blog">
                      {data.postTitle}
                    </Link>
                  </h3>
                  <p className="text-secondary line-height">{data.postSummary}</p>
                  <p className="card-text text-uppercase text-end">
                    <small>{formateDate(data.publicationDate)}</small>
                  </p>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { LatestNews }
