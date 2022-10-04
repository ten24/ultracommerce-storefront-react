import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components'
import DynamicPage from '../DynamicPage/DynamicPage'

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const contentStore = useSelector(state => state.content['error']) || {}

  return (
    <DynamicPage ignoreLayout={true}>
      <div
        className="container py-5 mb-lg-3"
        onClick={event => {
          if (event.target.getAttribute('href')) {
            event.preventDefault()
            if (event.target.getAttribute('href').includes('http')) {
              window.location.href = event.target.getAttribute('href')
            } else {
              navigate(event.target.getAttribute('href'))
            }
          }
        }}
      >
        <div className="row justify-content-center pt-lg-4 text-center">
          <div className="col-lg-5 col-md-7 col-sm-9">
            <h1 className="display-404">{contentStore.title}</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: contentStore?.contentSummary || t('frontend.core.error.summary'),
              }}
            ></div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            <div role="alert">
              <p
                dangerouslySetInnerHTML={{
                  __html: contentStore?.contentBody || t('frontend.core.error.body'),
                }}
              />
            </div>
          </div>
        </div>
        {error?.message && (
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div role="alert">
                <p>
                  <pre>{error?.message}</pre>
                </p>
                <Button onClick={resetErrorBoundary}>{t('frontend.core.error.reload')}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DynamicPage>
  )
}

export default ErrorFallback
