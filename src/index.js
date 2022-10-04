import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from 'react-router-dom'
import { Provider } from 'react-redux'
import TagManager from 'react-gtm-module'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { AnalyticsManager } from '@ultracommerce/ultracommerce-storefront-react/global'
import './i18n'
import store from './createStore'
import { AppSwitcher } from './AppSwitcher'
import './assets/theme'
import devData from './preload'

const release = process.env.REACT_APP_NAME + '@' + process.env.REACT_APP_VERSION
const dsn = process.env.REACT_APP_SENTRY_DSN
const tracesSampleRate = process.env.REACT_APP_SENTRY_SAMPLE_RATE || 0.5

if (devData.analytics.tagManager.gtmId) TagManager.initialize({ gtmId: devData.analytics.tagManager.gtmId })
if (dsn)
  Sentry.init({
    release,
    beforeSend: event => {
      if (!window['Statistics-Allowed']) return null
      return event
    },
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(React.useEffect, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes),
      }),
    ],
    tracesSampleRate,
  })
createRoot(document.getElementById('app')).render(
  <Provider store={store}>
    <Router>
      <AppSwitcher />
      <AnalyticsManager />
    </Router>
  </Provider>
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
