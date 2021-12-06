import { Blocks, SimpleImage } from '../..'
import { useUtilities } from '../../../hooks'

const ListItemWithImage = props => {
  return <ListItem {...props} showImage={true} />
}

const ListItem = item => {
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="listItem">
            <h2>{item.title}</h2>
            <div
              className="listItem-body"
              onClick={eventHandlerForWSIWYG}
              dangerouslySetInnerHTML={{
                __html: item.contentBody || '',
              }}
            />
            {item.linkLabel?.trim()?.length > 0 && (
              <a onClick={eventHandlerForWSIWYG} href={item.linkUrl ? `/${item.linkUrl}` : '/#'} className="btn btn-primary btn-lg text-white px-4 rounded-pill mt-4">
                {item.linkLabel}
              </a>
            )}
          </div>
        </div>
        {item.showImage && (
          <div className="col col-lg-4">
            <SimpleImage src={item.imagePath} className="img-fluid " alt={item.title} />
          </div>
        )}
        {item?.children?.length > 0 && <Blocks blocks={item.children} />}
      </div>
    </div>
  )
}
export { ListItem, ListItemWithImage }
