import { useUtilities } from '../../hooks'

const Ribbon = props => {
  const { contentBody, systemCode, children, stylingBackgroundColor = '#F6F8FA', stylingFontColor = '#333333' } = props
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <div className={`ribbon ${systemCode}`} style={{ backgroundColor: stylingBackgroundColor, color: stylingFontColor }}>
      <div className="container">
        <div
          className="ribbon-markup text-center"
          onClick={eventHandlerForWSIWYG}
          style={{ color: stylingFontColor }}
          dangerouslySetInnerHTML={{
            __html: contentBody,
          }}
        />
        {children}
      </div>
    </div>
  )
}
export { Ribbon }
