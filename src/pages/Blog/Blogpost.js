import React, { useEffect } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { Layout, BlogSidebar, BlogPostBody, BlogPostHeader, RecentBlogs } from '../../components'
import { useGetBlogPost } from '../../hooks'

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
      <BlogPostHeader />
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
