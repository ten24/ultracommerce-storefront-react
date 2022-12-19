import { useUtilities } from '../../hooks'
import { HorizontalContentPane, VerticalContentPane } from '../ContentPane/ContentPane'
const array_chunks = (array, chunk_size) =>
  Array(Math.ceil(array.length / chunk_size))
    .fill()
    .map((_, index) => index * chunk_size)
    .map(begin => array.slice(begin, begin + chunk_size))
const ContentGrid = props => {
  const { eventHandlerForWSIWYG } = useUtilities()
  const { systemCode, innerElements, contentHeading, contentBody } = props

  const panes = innerElements.map((el, idx) => {
    el.viewMode = !((idx + 1) % 4) ? 'horizontal' : 'vertical'
    return el
  })

  return (
    <div className={`content-grid ${systemCode}`}>
      <div className="container">
        <div className="info text-center mb-5">
          <h2>{contentHeading}</h2>
          <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: contentBody }} />
        </div>
        {array_chunks(panes, 4).map((el, idx) => {
          const verticalPanes = el.filter(child => child.viewMode === 'vertical')
          const horizontalPanes = el.filter(child => child.viewMode === 'horizontal')
          return (
            <div key={idx}>
              <div className="row px-3">
                {verticalPanes.map((pane, idx) => (
                  <VerticalContentPane key={idx} siblingCount={verticalPanes.length} {...pane} />
                ))}
              </div>
              <div className="row px-3">
                {horizontalPanes.map((pane, idx) => (
                  <HorizontalContentPane key={idx} {...pane} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { ContentGrid }
