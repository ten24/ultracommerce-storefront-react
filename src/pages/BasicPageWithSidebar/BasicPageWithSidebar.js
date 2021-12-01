import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { getNestedContent } from '../../selectors'
import { getContentByType } from '../../utils'
import Sidebar from './Sidebar'

const BasicPageWithSidebar = ({ children }) => {
  let history = useHistory()
  let { pathname } = useLocation()
  const structuredContent = useSelector(getNestedContent)
  const pageData = structuredContent.filter(con => con.key === pathname.substring(1)).reduce((accumulator, con) => con, {})
  const sidebarData = getContentByType(pageData.children, 'cetSidebar')
  return (
    <>
      <div className="page-title-overlap bg-lightgray pt-4 pb-5">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center text-lg-start">
            <h1 className="h3 mb-0">{pageData.title || ''}</h1>
          </div>
        </div>
      </div>
      <div className="container pb-5 mb-2 mb-md-3">
        <div className="row">
          <section className="col-lg-8">
            <div className="mt-5 pt-5">
              <div
                onClick={event => {
                  event.preventDefault()
                  if (event.target.getAttribute('href')) {
                    history.push(event.target.getAttribute('href'))
                  }
                }}
                dangerouslySetInnerHTML={{
                  __html: pageData.contentSummary || '',
                }}
              />
              {children}
            </div>
          </section>
          <Sidebar data={sidebarData} />
        </div>
      </div>
    </>
  )
}

export default BasicPageWithSidebar
