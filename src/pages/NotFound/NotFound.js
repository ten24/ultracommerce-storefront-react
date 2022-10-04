import { useUtilities } from '../../hooks'

export default function NotFound() {
  const { eventHandlerForWSIWYG } = useUtilities()

  return (
    <div className="container py-5 mb-lg-3" onClick={eventHandlerForWSIWYG}>
      <div className="row justify-content-center pt-lg-4 text-center">
        <div className="col-lg-5 col-md-7 col-sm-9">
          <h1 className="display-404">Page Missing</h1>
        </div>
      </div>
      <div className="row text-center justify-content-center">
        <div className="col-xl-8 col-lg-10">
          {/* <div
                dangerouslySetInnerHTML={{
                  __html: contentStore?.contentBody,
                }}
              /> */}
        </div>
      </div>
    </div>
  )
}
