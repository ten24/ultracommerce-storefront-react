import { default as preload } from '@ultracommerce/ultracommerce-storefront-react/src/preload'
const data = {
  ...preload,
  site: { ...preload.site, hibachiInstanceApplicationScopeKey: '', siteName: process.env.REACT_APP_NAME, siteID: '', defaultCountry: 'US', siteCode: process.env.REACT_APP_SITE_CODE },
  footer: {
    formLink: '',
  },
  cmsProvider: 'slatwallCMS',
  theme: {
    ...preload.theme,
    host: process.env.REACT_APP_HOST_URL,
    primaryColor: '#2478CC',
  },
  forms: {
    contact: '',
  },
}
export default data
