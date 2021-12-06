import { useState } from 'react'
import { SimpleImage, Modal } from '../..'
import { useUtilities } from '../../../hooks'

const Block = ({ contentBody, title }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <div className="col col-lg-3">
      <div className="card m-3">
        <div className="card-body d-flex flex-column text-center">
          <h2 className="card-title h6">{title}</h2>
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

const BlockProfile = ({ contentBody, imagePath, contentSummary, title }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  const [showModal, setModal] = useState(false)
  return (
    <div className="col col-lg-3">
      <div
        className="card m-3"
        onClick={e => {
          e.preventDefault()
          setModal(!showModal)
        }}
      >
        <div className="card-body d-flex flex-column text-center">
          <h2 className="card-title h6">{title}</h2>
          <SimpleImage src={imagePath} className="img-fluid " alt={title} />
          <h6
            className="card-subtitle mb-2 text-muted"
            onClick={eventHandlerForWSIWYG}
            dangerouslySetInnerHTML={{
              __html: contentSummary || '',
            }}
          />
        </div>
      </div>
      <Modal show={showModal} setShow={setModal} title="" size="xLarge">
        <h2 className="card-title h6">{title}</h2>
        <SimpleImage src={imagePath} className="img-fluid " alt={title} />
        <h6
          className="card-subtitle mb-2 text-muted"
          onClick={eventHandlerForWSIWYG}
          dangerouslySetInnerHTML={{
            __html: contentBody || '',
          }}
        />
      </Modal>
    </div>
  )
}

const Blocks = ({ blocks = [] }) => {
  return (
    <div className="container block-list">
      <div className="row">
        {blocks.map((item, index) => {
          if (item.elementType === 'cetProfile') {
            return <BlockProfile {...item} key={index} />
          }
          return <Block {...item} key={index} />
        })}
      </div>
    </div>
  )
}
export { Blocks, Block }
