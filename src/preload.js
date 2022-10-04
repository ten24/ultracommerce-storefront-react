import { default as preload } from '@ultracommerce/ultracommerce-storefront-react/src/preload'

const data = {
  ...preload,
  site: { ...preload.site, hibachiInstanceApplicationScopeKey: '', siteName: process.env.REACT_APP_NAME, siteID: '', defaultCountry: 'US', siteCode: process.env.REACT_APP_SITE_CODE },
  cmsProvider: 'slatwallCMS',
  products: {
    fallbackImageCall: false,
    loginRequiredForPrice: false,
  },
  sku: {
    ...preload.sku,
    allowOrderTemplate: true,
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
  integrations: [
    // {
    //   key: 'googlelogin',
    //   name: 'Google Login',
    //   types: 'authentication',
    //   settings: {},
    // },
    // {
    //   key: 'facebooklogin',
    //   name: 'Facebook Login',
    //   types: 'authentication',
    //   settings: {},
    // },
  ],
  enableMultiSite: true,
}
export default data
