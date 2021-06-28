import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { checkOutSteps, getCurrentStep } from '../'

// https://www.digitalocean.com/community/tutorials/how-to-create-multistep-forms-with-react-and-semantic-ui
// https://github.com/srdjan/react-multistep/blob/master/react-multistep.js
// https://www.geeksforgeeks.org/how-to-create-multi-step-progress-bar-using-bootstrap/

//

const StepsHeader = () => {
  const { t } = useTranslation()
  const loc = useLocation()
  let history = useHistory()

  const path = loc.pathname.split('/').reverse()[0].toLowerCase()
  const current = getCurrentStep(path)
  return (
    <ul className="nav nav-pills border nav-fill mb-5 p-2 rounded">
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
              className={`nav-link ${progressSate}`}
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

export { StepsHeader }
