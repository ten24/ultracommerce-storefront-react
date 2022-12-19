import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { Layout } from '../../components'
import { DynamicComponent } from '../../components/DynamicComponent/DynamicComponent'
import { useContentContext } from '../../contexts/ContentContext'
import { useUtilities } from '../../hooks'
import NotFound from '../NotFound/NotFound'

const DynamicPage = ({ children, customComponents = {}, ignoreLayout = false }) => {
  const pageData = useContentContext()
  let { eventHandlerForWSIWYG } = useUtilities()
  const siteName = useSelector(state => state.configuration.site.siteName)
  return (
    <Layout>
      {!!pageData?.settings?.contentHTMLTitleString && <Helmet title={pageData.settings.contentHTMLTitleString} />}
      {!pageData?.settings?.contentHTMLTitleString && <Helmet title={[siteName, pageData?.title].filter(e => e).join(' | ')} />}
      {pageData?.pagePrimaryColorOverride?.trim()?.length > 0 && <Helmet style={[{ type: 'text/css', cssText: `:root {\n--uc-primarycolor: ${pageData.pagePrimaryColorOverride}\n}` }]} />}
      {pageData?.contentElements?.map((pageEl, idx) => {
        if (pageEl?.systemCode === 'cetBody' && !!pageData?.is404) {
          return (
            <div className="DynamicPage" key={idx}>
              <NotFound key={idx} />
            </div>
          )
        } else if (pageEl?.systemCode === 'cetBody' && !!pageEl?.innerElements?.length) {
          return (
            <div className="DynamicPage" key={idx}>
              <DynamicComponent el={pageEl} customComponents={customComponents} key={idx} />
              {children}
            </div>
          )
        } else if (pageEl?.systemCode === 'cetBody' && !pageEl?.innerElements?.length && !ignoreLayout) {
          return (
            <div className="DynamicPage p-0" key={idx}>
              <div className="page-title-overlap bg-lightgray pt-4">
                <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
                  <div className="order-lg-1 pr-lg-4 text-center">
                    <h1 className="h3 text-dark mb-0 font-accent">{pageData?.contentHeading?.trim()}</h1>
                  </div>
                </div>
              </div>
              <div className="basic container bg-white shadow-sm rounded-3 p-4 p-lg-5 mb-5">
                <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: pageEl?.contentBody }} />
                {children}
              </div>
            </div>
          )
        } else if (pageEl?.systemCode === 'cetBody' && !pageEl?.innerElements?.length && ignoreLayout) {
          return (
            <div className="p-0" key={idx}>
              {pageData?.contentPageType_systemCode !== 'cptPost' && <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: pageEl?.contentBody }} />} {children}
            </div>
          )
        }
        return <DynamicComponent el={pageEl} key={idx} />
      })}
    </Layout>
  )
}

export default DynamicPage
