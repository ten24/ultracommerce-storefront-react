import { useTranslation } from 'react-i18next'
import { useElementContext } from '../../contexts/ElementContextProvider'
import { useBlogPage } from '../../hooks/pages/useBlogPage'
import DynamicPage from '../DynamicPage/DynamicPage'

const Blog = ({ config = { showSidebar: false, showCount: 6 } }) => {
  const { request, currentPage, countOnPage, setPage } = useBlogPage(config)
  const { t } = useTranslation()
  const { BlogListBody, BlogSidebar, ListingPagination } = useElementContext()

  return (
    <DynamicPage ignoreLayout={true}>
      <div className="bg-light p-5 mb-4 text-center">
        <h1 className="display-3">{t('frontend.blog.title')}</h1>
      </div>
      <div className="container my-5">
        <div className="row">
          {request.isLoaded && request.data?.items?.length > 0 && (
            <div className={`col-lg-${config.showSidebar ? '8' : '12'} entries`}>
              {request?.data?.items?.map(field => {
                return <BlogListBody key={field.slug} blog={field} />
              })}
              <div className="container pb-4 pb-sm-5">{<ListingPagination recordsCount={request.data.total} currentPage={currentPage} totalPages={Math.ceil(request.data.total / countOnPage)} setPage={setPage} />}</div>
            </div>
          )}
          {request.isLoaded && !request.data?.items && (
            <div className="col-lg-8 entries">
              <div className="alert alert-info" role="alert">
                {t('frontend.blog.none')}
              </div>
            </div>
          )}
          <BlogSidebar show={config.showSidebar} />
        </div>
      </div>
    </DynamicPage>
  )
}

export default Blog
