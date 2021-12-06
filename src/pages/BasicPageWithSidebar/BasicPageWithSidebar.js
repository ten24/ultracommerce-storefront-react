import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useUtilities } from '../../hooks'
import Sidebar from './Sidebar'

const BasicPageWithSidebar = ({ children }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  let { pathname } = useLocation()
  const pageData = useSelector(state => state.content[pathname.substring(1)] || {})
  return (
    <>
      <div className="page-title-overlap bg-lightgray pt-4 pb-5">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center text-lg-start">
            <h1 className="h3 mb-0">{pageData.title || ''}</h1>
            <div
              className="content-summary"
              onClick={eventHandlerForWSIWYG}
              dangerouslySetInnerHTML={{
                __html: pageData.contentSummary || '',
              }}
            />
          </div>
        </div>
      </div>
      <div className="container pb-5 mb-2 mb-md-3">
        <div className="row">
          <section className="col-lg-8">
            <div className="mt-5 pt-5">
              <div
                onClick={eventHandlerForWSIWYG}
                dangerouslySetInnerHTML={{
                  __html: pageData.contentBody || '',
                }}
              />
              {children}
            </div>
          </section>
          <Sidebar data={pageData.sidebar} />
        </div>
      </div>
    </>
  )
}

export default BasicPageWithSidebar
