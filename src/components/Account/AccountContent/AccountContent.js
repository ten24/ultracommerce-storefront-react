import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const AccountContent = ({ displayTitle = true }) => {
  let loc = useLocation()
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const { title, contentBody = '' } = content || {}
  return (
    <>
      {displayTitle && (
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-between w-100">
            <h2 className="h3">{title}</h2>
          </div>
        </div>
      )}

      {!!contentBody && contentBody.length > 0 && <div className="content-body mb-4" dangerouslySetInnerHTML={{ __html: contentBody }} />}
    </>
  )
}
export { AccountContent }
