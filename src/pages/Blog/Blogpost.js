import React, { useEffect } from 'react'
import { useHistory, useRouteMatch, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BreadCrumb, Layout, BlogSidebar, BlogPostBody } from '../../components'
import { useGetBlogPost, useGetBlogPosts, useFormatDateTime } from '../../hooks'
const Header = () => {
  const { t } = useTranslation() // Translate
  const loc = useLocation()
  const titleizeWord = str => `${str[0].toUpperCase()}${str.slice(1)}`
  const kebabToTitle = str => str.split('-').map(titleizeWord).join(' ')
  const toBreadcrumbs = (link, { rootName = 'Home', nameTransform = s => s } = {}) =>
    link
      .split('/')
      .filter(Boolean)
      .reduce(
        (acc, curr, idx, arr) => {
          acc.path += `/${curr}`
          acc.crumbs.push({
            urlTitle: acc.path,
            title: nameTransform(curr),
          })

          if (idx === arr.length - 1) return acc.crumbs
          else return acc
        },
        { path: '', crumbs: [{ urlTitle: '/', title: rootName }] }
      )
  let crumbs = toBreadcrumbs(loc.pathname, { nameTransform: kebabToTitle })

  return (
    <section className="breadcrumbs">
      <div className="bg-light">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <h2 className="h5 m-0">{t('frontend.blog.blogSingle')}</h2>
          <BreadCrumb crumbs={crumbs.filter(crmb => crmb.urlTitle !== '/')} />
        </div>
      </div>
    </section>
  )
}

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
        request.data.items.map(feed => {
          return (
            <div key={feed.postTitle} className="post-item d-flex align-items-start mb-3">
              {feed.postImage ? <img className="recent-image" src={feed.postImage} alt={feed.postTitle} /> : <div className="recent-image" />}
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

const BlogPost = () => {
  let [request, setRequest] = useGetBlogPost()
  let loc = useRouteMatch()
  let history = useHistory()

  useEffect(() => {
    let didCancel = false
    if (!request.isFetching && !request.isLoaded && !didCancel) {
      setRequest({ ...request, isFetching: true, isLoaded: false, params: { slug: loc.params.id }, makeRequest: true })
    }
    history.listen(location => {
      let slug = location.pathname.split('/')
      slug = slug[2]
      setRequest({ ...request, isFetching: true, isLoaded: false, params: { slug }, makeRequest: true })
    })
    return () => {
      didCancel = true
    }
  }, [request, history, loc, setRequest])

  return (
    <Layout>
      <Header />
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8 entries">{request.isLoaded && Object.keys(request.data).length > 0 && <BlogPostBody blogPostData={request.data} />}</div>
          <div className="col-lg-4">
            <BlogSidebar blogPost={true} />
            <RecentBlogs />
          </div>
        </div>
      </div>
    </Layout>
  )
}
export { BlogPost }
