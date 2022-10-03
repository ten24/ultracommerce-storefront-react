import { useSelector } from 'react-redux'
import { Blocks, ContentBlock, ContentColumns, ListingGrid, ListingPagination, ListItem, SimpleTabs } from '../../components'
import { useBasicPage, useUtilities } from '../../hooks'

const BarrierPage = ({ accessFlag = false }) => {
  const globalconfig = useSelector(state => state.content.globalconfig)
  let { eventHandlerForWSIWYG } = useUtilities()
  if (accessFlag) return null
  return (
    <div className="barrierContent">
      {globalconfig
        ?.filter(entry => entry.urlTitle === 'barrier-page-content')
        ?.map(entry => {
          return <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: entry?.contentBody }} />
        })}
    </div>
  )
}
const PageDisplay = ({ content, setPage, request }) => {
  let { eventHandlerForWSIWYG } = useUtilities()

  return (
    <div className="barrierContent">
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
      {content?.tabs?.length > 0 && <SimpleTabs data={content.tabs} />}
      {content?.contentColumns?.columns?.length > 0 && (
        <ContentColumns title={content.contentColumns?.title}>
          <div className="row">
            <div className="col">
              <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: content?.contentColumns?.contentBody }} />
            </div>
          </div>
          <div className="row justify-content-center">
            {content.contentColumns.columns?.map((column, index) => {
              return (
                <div key={`${column.title}-${index}`} className={`col-lg-${12 / content?.contentColumns?.columns?.length} pr-4-lg`}>
                  <ContentBlock {...column} />
                </div>
              )
            })}
          </div>
        </ContentColumns>
      )}

      {content?.listItems?.map(item => {
        return <ListItem {...item} />
      })}
      {content?.blocks?.length > 0 && <Blocks blocks={content.blocks} />}

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
  )
}
const BasicPage = () => {
  const { content, request, setPage } = useBasicPage()
  return (
    <div className="p-0">
      <div className="page-title-overlap bg-lightgray pt-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center">
            <h1 className="h3 text-dark mb-0 font-accent">{content.title || ''}</h1>
          </div>
        </div>
      </div>
      <div className="container bg-white shadow-sm rounded-3 p-lg-5 mb-5">
        {content?.permissions?.accessFlag && <PageDisplay content={content} request={request} setPage={setPage} />}
        {!content?.permissions?.accessFlag && <BarrierPage {...content.permissions} />}
      </div>
    </div>
  )
}

export default BasicPage
