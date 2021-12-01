import { SimpleImage } from '../..'
import { useUtilities } from '../../../hooks'

const ListItemWithImage = props => {
  return <ListItem {...props} showImage={true} />
}

const ListItem = ({ contentBody, linkLabel, linkUrl, title, imagePath, showImage = false }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="listItem">
            <h2>{title}</h2>
            <div
              className="listItem-body"
              onClick={eventHandlerForWSIWYG}
              dangerouslySetInnerHTML={{
                __html: contentBody || '',
              }}
            />
            {linkLabel?.trim()?.length > 0 && (
              <a onClick={eventHandlerForWSIWYG} href={linkUrl ? `/${linkUrl}` : '/#'} className="btn btn-primary btn-lg text-white px-4 rounded-pill mt-4">
                {linkLabel}
              </a>
            )}
          </div>
        </div>
        {showImage && (
          <div className="col col-lg-4">
            <SimpleImage src={imagePath} className="img-fluid " alt={title} />
          </div>
        )}
      </div>
    </div>
  )
}
export { ListItem, ListItemWithImage }
