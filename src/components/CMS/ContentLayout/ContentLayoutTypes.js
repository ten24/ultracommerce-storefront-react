import Masonry from 'react-masonry-css'

const ContentLayoutCSSGrid = ({ children }) => {
  return <div className="grid">{children}</div>
}

const ContentLayoutCardGrid = ({ children, stylingCustomClasses = '' }) => {
  return (
    <div className="container">
      <div className={['row uc-card-grid mx-1 my-3', stylingCustomClasses.trim()].join(' ')}>
        {children
          ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
          ?.map(card => {
            return (
              <div key={card.key} className="d-flex p-0">
                {card}
              </div>
            )
          })}
      </div>
    </div>
  )
}

const ContentLayoutCardGroup = ({ children }) => {
  return <div className="card-group">{children}</div>
}

const ContentLayoutCardMasontry = ({
  children,
  breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  },
}) => {
  return (
    <div className="container-fluid px-3">
      <Masonry breakpointCols={breakpointColumnsObj} className="sw-masonry-grid mt-3" columnClassName="sw-masonry-grid_column">
        {children
          ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
          ?.map(card => {
            return (
              <div key={card.key} className="brick">
                {card}
              </div>
            )
          })}
      </Masonry>
    </div>
  )
}

export { ContentLayoutCSSGrid, ContentLayoutCardGrid, ContentLayoutCardGroup, ContentLayoutCardMasontry }
