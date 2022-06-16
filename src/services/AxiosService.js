import axios from 'axios'
const siteCode = process.env.REACT_APP_SITE_CODE
// This sadly needs to be a in localStorage or default because of how rollup is setup.
axios.interceptors.request.use(config => {
  let localSiteCode = localStorage.getItem('siteCode')
  if (!localSiteCode) {
    localStorage.setItem('siteCode', siteCode)
    localSiteCode = siteCode
  }
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
