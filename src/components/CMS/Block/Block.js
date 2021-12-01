import { useUtilities } from '../../../hooks'

const Block = ({ contentBody, title }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <div className="col col-lg-3">
      <div className="card m-3">
        <div className="card-body d-flex flex-column text-center">
          <h2 className="card-title h6">{title}</h2>
          {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
          <div
            className="card-text"
            onClick={eventHandlerForWSIWYG}
            dangerouslySetInnerHTML={{
              __html: contentBody || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}

const Blocks = ({ blocks = [] }) => {
  return (
    <div className="container block-list">
      <div className="row">
        {blocks.map(item => {
          return <Block {...item} key={item.contentID} />
        })}
      </div>
    </div>
  )
}
export { Blocks, Block }
