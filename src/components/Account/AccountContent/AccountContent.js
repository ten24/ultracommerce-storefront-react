import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

const AccountContent = () => {
  let history = useHistory()
  let loc = useLocation()
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const { customBody = '', contentTitle = '', isMarkup = true } = content || {}
  return (
    <>
      <div className="d-flex justify-content-between align-items-center   mb-lg-3">
        <div className="d-flex justify-content-between w-100">
          <h2 className="h3">{contentTitle}</h2>
        </div>
      </div>
      {isMarkup && (
        <div
          onClick={event => {
            event.preventDefault()
            if (event.target.getAttribute('href')) {
              history.push(event.target.getAttribute('href'))
            }
          }}
          dangerouslySetInnerHTML={{
            __html: customBody,
          }}
        />
      )}
      {!isMarkup && customBody}
    </>
  )
}
export { AccountContent }
