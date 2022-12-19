import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { SimpleImage } from '..'
import { useUtilities } from '../../hooks'
import { useFormatDate } from '../../hooks/useFormatDate'
import { getBlogRoute } from '../../selectors/configurationSelectors'

const LatestNews = ({ relatedBlogs = [], systemCode }) => {
  const { t } = useTranslation()
  const [formateDate] = useFormatDate()
  let { eventHandlerForWSIWYG } = useUtilities()
  const blogPath = useSelector(getBlogRoute)

  return (
    <section className={`content-spacer latest-news-sec ${systemCode}`}>
      <div className="container">
        <header className="section-title">
          <h2>{t('frontend.home.latest_news')}</h2>
        </header>
        <div className="row">
          {relatedBlogs?.slice(0, 3)?.map(data => {
            return (
              <div key={data.title} className={`col-md-6 col-lg-4 d-flex`}>
                <article className="blog-card card border-0 shadow m-3 w-100">
                  <figure className="blog-figure overflow-hidden m-0">{data.postImage ? <SimpleImage src={data.postImage.url} className="blog-image" alt={data.postTitle} /> : <div className="blog-image" />}</figure>
                  <div className="card-body p-4">
                    {data.publicationDate && (
                      <p>
                        <small className="text-muted fst-italic">{formateDate(data.publicationDate)}</small>
                      </p>
                    )}
                    <h4>
                      <Link to={`/${blogPath}/${data.slug}`}>{data.title}</Link>
                    </h4>
                    <p className="text-secondary" onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: data.postSummary }} />
                  </div>
                </article>
              </div>
            )
          })}
        </div>
        <div className="text-center mt-5">
          <Link className="btn btn-primary" to={`/${blogPath}`}>
            {t('frontend.home.view_all_news')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export { LatestNews }
