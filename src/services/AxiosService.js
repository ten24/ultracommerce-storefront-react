import axios from 'axios'
import { getCurrentSiteCode } from '../utils'
// This sadly needs to be a in localStorage or default because of how rollup is setup.
axios.interceptors.request.use(config => {
  let localSiteCode = getCurrentSiteCode()
  config.headers['SWX-requestSiteCode'] = localSiteCode
  if (localStorage.getItem('token')) {
    config.headers['Auth-Token'] = `Bearer ${localStorage.getItem('token')}`
  }
  return config
})

axios.interceptors.response.use(
  successRes => {
    if (successRes.data.token) localStorage.setItem('token', successRes.data.token)
    return successRes
  },
  error => {}
)

export { axios }
