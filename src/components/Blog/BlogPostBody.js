import React from 'react'
// import { useSelector } from 'react-redux'
// import { Link } from 'react-router-dom'
import { SimpleImage } from '..'
import { useFormatDate, useUtilities } from '../../hooks'
// import { getBlogRoute } from '../../selectors/configurationSelectors'

const BlogPostBody = ({ blogPostData }) => {
  const [formateDate] = useFormatDate()
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <article className="shadow mb-5">
      {blogPostData.postImage && (
        <div className="max-height-img d-flex justify-content-center">
          <SimpleImage src={blogPostData.postImage.url} alt={blogPostData.postTitle} type="none" />
        </div>
      )}
      <h2 className="entry-title px-4 pt-3 m-0">
        <span>{blogPostData.postTitle}</span>
      </h2>
      {(blogPostData?.authorName || blogPostData?.publicationDate) && (
        <div className="entry-meta p-4">
          <ul className="list-unstyled d-flex m-0">
            {blogPostData.authorName && (
              <li className="d-flex align-items-center me-3">
                <i className="bi bi-person me-2 small line-height-0"></i>
                {blogPostData.authorName}
              </li>
            )}
            {blogPostData.publicationDate && (
              <li className="d-flex align-items-center mr-3">
                <i className="bi bi-clock me-2 small line-height-0"></i>
                {formateDate(blogPostData.publicationDate)}
              </li>
            )}
          </ul>
        </div>
      )}
      <div className="entry-content p-4 mt-3" onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: blogPostData.postContent }} />
      {/* <div className="entry-footer border-top mx-4 pb-3 pt-2">
        {blogPostData?.blogcategory?.length > 0 && (
          <ul className="list-unstyled d-flex m-0">
            {blogPostData?.blogcategory.map(category => {
              return (
                <li key={category.value} className="d-flex align-items-center me-3">
                  <i className="bi bi-folder me-1 small line-height-0"></i>
                  <Link className="link-button text-underline" to={`/${blogPath}?category=${category.value}`}>
                    {category.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div> */}
    </article>
  )
}

export { BlogPostBody }
