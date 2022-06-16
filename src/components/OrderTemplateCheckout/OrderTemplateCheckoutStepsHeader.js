import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { orderTemplateCheckOutSteps, getOrderTemplateCurrentStep } from '../'

const OrderTemplateCheckoutStepsHeader = () => {
  const { t } = useTranslation()
  const loc = useLocation()
  let history = useHistory()
  const path = loc.pathname.split('/').reverse()[0].toLowerCase()
  const current = getOrderTemplateCurrentStep(path)
  return (
    <ul className="nav nav-pills border nav-fill mb-4 p-2 rounded">
      {orderTemplateCheckOutSteps.map(step => {
        let progressSate = ''
        if (step.progress < current.progress) {
          progressSate = ''
        } else if (step.progress === current.progress) {
          progressSate = 'active current'
        } else {
          progressSate = 'disabled'
        }
        return (
          <li className="nav-item" key={step.progress}>
            <span
              className={`nav-link link text-decoration-none ${progressSate}`}
              key={step.progress}
              onClick={e => {
                history.push(step.link)
              }}
            >
              {t(step.name)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export { OrderTemplateCheckoutStepsHeader }
