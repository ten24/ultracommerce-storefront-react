import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useGetBlogPosts, useUtilities } from '../../hooks'
import { useFormatDate } from '../../hooks/useFormatDate'

function LatestNews() {
  const { t } = useTranslation()
  const [formateDate] = useFormatDate()
  let [request, setRequest] = useGetBlogPosts()
  let { eventHandlerForWSIWYG } = useUtilities()

  useEffect(() => {
    if (!request.isFetching && !request.isLoaded) {
      setRequest({ ...request, isFetching: true, isLoaded: false, params: { limit: 3 }, makeRequest: true })
    }
  }, [request, setRequest])
  if (!request.data?.items?.length) {
    return null
  }

  return (
    <section className="content-spacer">
      <div className="container">
        <header className="section-title">
          <h2>{t('frontend.home.latest_news')}</h2>
        </header>
        <div className="row">
          {request.data?.items?.map(data => {
            return (
              <div key={data.postTitle} className="col-md-4">
                <article className="blog-card card border-0 shadow m-3">
                  <figure className="overflow-hidden m-0">{data.postImage ? <img src={data.postImage.url} className="img-fluid blog-image d-block w-100 zoom-in" alt={data.postTitle} /> : <div className="img-fluid blog-image" />}</figure>
                  <div className="card-body p-4">
                    <p>
                      <small className="text-muted fst-italic">{formateDate(data.publicationDate)}</small>
                    </p>
                    <h4>
                      <Link to={`/blog/${data.slug}`}>{data.postTitle}</Link>
                    </h4>
                    <p className="text-secondary line-height" onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: data.postSummary }} />
                  </div>
                </article>
              </div>
            )
          })}
        </div>
        <div className="text-center mt-5">
          <Link className="btn btn-primary" to="/blog">
            View All News
          </Link>
        </div>
      </div>
    </section>
  )
}

export { LatestNews }
