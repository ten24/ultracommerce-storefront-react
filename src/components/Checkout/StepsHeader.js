import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { checkOutSteps, getCurrentStep } from '../'

// https://www.digitalocean.com/community/tutorials/how-to-create-multistep-forms-with-react-and-semantic-ui
// https://github.com/srdjan/react-multistep/blob/master/react-multistep.js
// https://www.geeksforgeeks.org/how-to-create-multi-step-progress-bar-using-bootstrap/

//

const StepsHeader = () => {
  const { t } = useTranslation()
  const loc = useLocation()
  const navigate = useNavigate()

  const path = loc.pathname.split('/').reverse()?.at(0).toLowerCase()
  const current = getCurrentStep(path)
  return (
    <ul className="nav nav-pills border nav-fill mb-4 p-2 rounded">
      {checkOutSteps.map(step => {
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
                navigate(step.link)
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

export { StepsHeader }
