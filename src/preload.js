import { default as preload } from '@ultracommerce/ultracommerce-storefront-react/src/preload'
const data = {
  ...preload,
  site: {
    ...preload.site,
    siteName: process.env.REACT_APP_NAME,
    siteCode: process.env.REACT_APP_SITE_CODE,
  },
  footer: {
    formLink: '',
  },
  seo: {
    title: 'Storefront',
    titleMeta: '',
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
}
export default data
