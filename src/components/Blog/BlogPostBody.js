import React from 'react'
import { Link } from 'react-router-dom'
import { useFormatDateTime, useUtilities } from '../../hooks'

const BlogPostBody = ({ blogPostData }) => {
  const [formateDate] = useFormatDateTime()
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <article className="shadow mb-5">
      <div className="entry-img d-flex justify-content-center">{blogPostData.postImage && <img src={blogPostData.postImage.url} alt={blogPostData.postTitle} className="img-fluid" />}</div>
      <h2 className="entry-title px-4 py-3 m-0">
        <span>{blogPostData.postTitle}</span>
      </h2>
      <div className="entry-meta px-4">
        <ul className="list-unstyled d-flex m-0">
          <li className="d-flex align-items-center me-3">
            <i className="bi bi-person me-2 small line-height-0"></i>
            {blogPostData.authorName}
          </li>
          <li className="d-flex align-items-center mr-3">
            <i className="bi bi-clock me-2 small line-height-0"></i>
            {formateDate(blogPostData.publicationDate)}
          </li>
        </ul>
      </div>
      <div className="entry-content px-4 mt-3" onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: blogPostData.postContent }} />
      <div className="entry-footer border-top mx-4 pb-3 pt-2">
        {blogPostData?.blogcategory?.length > 0 && (
          <ul className="list-unstyled d-flex m-0">
            {blogPostData?.blogcategory.map(category => {
              return (
                <li key={category.value} className="d-flex align-items-center mr-3">
                  <i className="bi bi-folder me-2 small line-height-0"></i>
                  <Link className="link-button text-underline" to={`/blog?category=${category.value}`}>
                    {category.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </article>
  )
}

export { BlogPostBody }
