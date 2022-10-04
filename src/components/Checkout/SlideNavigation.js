import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SlideNavigation = ({ currentStep, nextActive = true }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  return (
    <>
      {currentStep.next.length > 0 && <hr />}
      <div className="d-lg-flex pt-4 mt-3 ">
        {currentStep.next.length > 0 && (
          <>
            <div className="w-50 pl-2">
              <button
                className="btn btn-primary btn-lg btn-block "
                disabled={!nextActive}
                onClick={e => {
                  e.preventDefault()
                  navigate({ pathname: `/checkout/${currentStep.next}`})
                }}
              >
                <span className=" d-sm-inline">{t('frontend.pagination.continue')}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export { SlideNavigation }
