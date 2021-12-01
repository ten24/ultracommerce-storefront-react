import { ListingGrid, ListingPagination, SimpleTabs } from '../../components'
import { useBasicPage, useUtilities } from '../../hooks'

const BasicPage = () => {
  const { content, request, setPage } = useBasicPage()
  let { eventHandlerForWSIWYG, getContentByType } = useUtilities()
  const tabsData = getContentByType(content.children, 'cetTab')
  return (
    <div className="p-0">
      <div className="page-title-overlap bg-lightgray pt-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center">
            <h1 className="h3 text-dark mb-0 font-accent">{content.title || ''}</h1>
          </div>
        </div>
      </div>
      <div className="container bg-white shadow-sm rounded-3 p-5 mb-5">
        {content.isMarkup && (
          <div
            className="content-body"
            onClick={eventHandlerForWSIWYG}
            dangerouslySetInnerHTML={{
              __html: content.contentBody || '',
            }}
          />
        )}
        {!content.isMarkup &&
          content.sections &&
          content.sections.map(({ title, text, imageUrl }) => {
            return (
              <div key={title}>
                <h2>{title}</h2>
                <div className="row">
                  <div className="col-md-8">{text}</div>
                  <div className="col-md-4">{imageUrl !== '' && <img className="float-end ml-md-2 mb-md-2 about-Img" src={imageUrl} alt={title} />}</div>
                </div>
              </div>
            )
          })}
        <SimpleTabs data={tabsData} />

        {content?.productListingPageFlag && (
          <>
            <hr />
            <div className="col">
              <ListingGrid isFetching={request.isFetching} pageRecords={request.data.pageRecords} />
              <ListingPagination recordsCount={request.data.recordsCount} currentPage={request.data.currentPage} totalPages={request.data.totalPages} setPage={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BasicPage
