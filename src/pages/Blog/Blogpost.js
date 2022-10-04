import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Layout, BlogSidebar, BlogPostBody, BlogPostHeader, RecentBlogs } from '../../components'
import { useGetBlogPost } from '../../hooks'

const BlogPost = () => {
  let [request, setRequest] = useGetBlogPost()
  let { pathname } = useLocation()
  let { id } = useParams()

  useEffect(() => {
    let didCancel = false
    if (!request.isFetching && !request.isLoaded && !didCancel) {
      setRequest({ ...request, isFetching: true, isLoaded: false, params: { slug: id }, makeRequest: true })
    }
  }, [request, id, setRequest])

  useEffect(() => {
    let slug = pathname.split('/')
    slug = slug[2]
    setRequest({ ...request, isFetching: true, isLoaded: false, params: { slug }, makeRequest: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

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
