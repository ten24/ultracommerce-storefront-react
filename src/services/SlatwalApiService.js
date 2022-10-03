import * as SlatwalSDK from '@ultracommerce/ultracommerce-sdk/dist/client/index'
import { toBoolean } from '../utils'

const sdkURL = process.env.REACT_APP_API_URL
const siteCode = process.env.REACT_APP_SITE_CODE

let SlatwalApiService = SlatwalSDK.init({
  host: sdkURL,
})
// This sadly needs to be a in localStorage or default because of how rollup is setup.

SlatwalApiService.sdkScope.httpService.axios.interceptors.request.use(config => {
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
SlatwalApiService.sdkScope.httpService.axios.interceptors.response.use(
  successRes => {
    if (successRes.data.token) {
      localStorage.setItem('token', successRes.data.token)
      if (toBoolean(process?.env?.REACT_APP_CREATE_TOKEN_COOKIE)) {
        const appConfig = localStorage.getItem('appConfiguration')
        document.cookie = 'token=' + successRes.data.token + ';path=/'
        if (appConfig?.settings?.siteCookieDomain?.length > 0) {
          document.cookie = 'domain = ' + appConfig.settings?.siteCookieDomain
        }
      }
    }
    return successRes
  },
  error => {}
)
export { sdkURL, SlatwalApiService }
