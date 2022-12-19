import { useContentContext } from '../../contexts'
import { useElementContext } from '../../contexts/ElementContextProvider'
// import { useGetBlogPost } from '../../hooks/useBlog'
import DynamicPage from '../DynamicPage/DynamicPage'

const BlogPost = ({ config = { showSidebar: false } }) => {
  const pageData = useContentContext()
  const { BlogSidebar, BlogPostBody, BlogPostHeader, RecentBlogs } = useElementContext()
  let postBody = {
    authorName: pageData?.contentAuthor?.trim(),
    publicationDate: pageData?.contentPublicationDate?.trim(),
    postTitle: pageData?.contentHeading?.trim() || pageData?.title?.trim(),
    postContent: pageData?.contentBody?.trim(),
  }
  if (pageData?.contentImage?.length > 0) {
    postBody.postImage = {
      url: `/custom/assets/images/content/${pageData.contentImage}`,
    }
  }
  return (
    <DynamicPage ignoreLayout={true}>
      <BlogPostHeader />
      <div className="container my-5">
        <div className="row">
          <div className={`col-lg-${config.showSidebar ? '8' : '12'} entries`}>
            <BlogPostBody blogPostData={postBody} />
          </div>
          {config.showSidebar && (
            <div className="col-lg-4">
              <BlogSidebar show={config.showSidebar} blogPost={true} />
              <RecentBlogs show={config.showSidebar} />
            </div>
          )}
        </div>
      </div>
    </DynamicPage>
  )
}
export { BlogPost }
