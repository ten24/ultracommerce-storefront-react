import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGetBlogPosts, useFormatDateTime } from '../../hooks'

const RecentBlogs = () => {
  let [request, setRequest] = useGetBlogPosts()
  let history = useHistory()
  const { t } = useTranslation()
  const [formateDate] = useFormatDateTime()
  const countOnPage = 3

  useEffect(() => {
    if (!request.isFetching && !request.isLoaded) {
      setRequest({ ...request, isFetching: true, isLoaded: false, params: { limit: countOnPage }, makeRequest: true })
    }
  }, [request, setRequest, countOnPage])

  return (
    <div className="filter-block recent-posts mt-3">
      <h3> {t('frontend.blog.recentPosts')}</h3>
      {request.isLoaded &&
        request.data?.items?.map(feed => {
          return (
            <div key={feed.postTitle} className="post-item d-flex align-items-start mb-3">
              {feed.postImage ? <img className="recent-image" src={feed.postImage.url} alt={feed.postTitle} /> : <div className="recent-image" />}
              <div className="ms-2 ">
                <h6 className="text-underline">
                  <div
                    className="link"
                    onClick={() =>
                      history.push({
                        pathname: `/blog/${feed.slug}`,
                      })
                    }
                  >
                    {feed.postTitle}
                  </div>
                </h6>
                <i className="data-time">
                  <time>{formateDate(feed.publicationDate)}</time>
                </i>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export { RecentBlogs }
