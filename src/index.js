import React from 'react'
import ReactDOM from 'react-dom'
// import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'
import TagManager from 'react-gtm-module'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { AnalyticsManager } from '@ultracommerce/ultracommerce-storefront-react/components'
import './i18n'
import store from './createStore'
import './assets/theme'
import devData from './preload'
import { AppSwitcher } from './AppSwitcher'

const release = process.env.REACT_APP_NAME + '@' + process.env.REACT_APP_VERSION
const dsn = process.env.REACT_APP_SENTRY_DSN
const tracesSampleRate = process.env.REACT_APP_SENTRY_SAMPLE_RATE || 0.5

const history = createBrowserHistory()

if (devData.analytics.tagManager.gtmId) TagManager.initialize({ gtmId: devData.analytics.tagManager.gtmId })
if (dsn)
  Sentry.init({
    dsn,
    release,
    beforeSend: event => {
      if (!window['Statistics-Allowed']) return null
      return event
    },
    integrations: [
      new Integrations.BrowserTracing({
        // Can also use reactRouterV3Instrumentation or reactRouterV4Instrumentation
        routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
      }),
    ],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate,
  })

ReactDOM.render(
  // <React.StrictMode>

  <Provider store={store}>
    <Router>
      <AppSwitcher />
      <AnalyticsManager />
    </Router>
  </Provider>,
  // </React.StrictMode>
  document.getElementById('app')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
