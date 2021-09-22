import { default as preload } from '@slatwall/slatwall-storefront-react/src/preload'
const data = {
  ...preload,
  site: { hibachiInstanceApplicationScopeKey: '', siteName: process.env.REACT_APP_NAME, siteID: '', siteCode: process.env.REACT_APP_SITE_CODE },
  shopByManufacturer: {
    slug: '/brands',
    showInMenu: true,
    gridSize: 3,
    maxCount: 12,
  },
  seo: {
    title: 'Storefront',
    titleMeta: '',
  },
  footer: {
    formLink: '',
  },
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
