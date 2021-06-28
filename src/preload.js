const data = {
  site: { hibachiInstanceApplicationScopeKey: '', siteName: '', siteID: '', siteCode: process.env.REACT_APP_SITE_CODE },
  router: [
    { URLKeyType: 'Product', URLKey: 'product' },
    { URLKeyType: 'ProductType', URLKey: 'products' },
    { URLKeyType: 'Category', URLKey: 'cat' },
    { URLKeyType: 'Brand', URLKey: 'brand' },
    { URLKeyType: 'Account', URLKey: 'ac' },
    { URLKeyType: 'Address', URLKey: 'ad' },
    { URLKeyType: 'Attribute', URLKey: 'att' },
  ],
  enforceVerifiedAccountFlag: false,
  cmsProvider: 'slatwallCMS',
  products: {
    fallbackImageCall: false,
  },
  shopByManufacturer: {
    slug: '/brands',
    showInMenu: true,
    gridSize: 1000,
    maxCount: 1000,
  },
  myAccount: {
    mostRecentCount: 3,
  },
  filtering: {
    productTypeBase: 'merchandise',
    requireKeyword: true,
    filterDataShowCounts: 5,
  },
  seo: {
    title: 'Slatwall',
    titleMeta: '',
  },
  footer: {
    formLink: '',
  },
  theme: {
    host: process.env.REACT_APP_HOST_URL,
    basePath: 'custom/client/assets/images/',
    primaryColor: '#2478CC',
  },
  formatting: {
    dateFormat: 'MMM DD, YYYY',
    timeFormat: 'HH:MM a',
  },
  analytics: {
    tagManager: {
      gtmId: '',
    },
    googleAnalytics: {
      id: '',
    },
    reportWebVitals: false,
  },
  forms: {
    contact: '',
  },
}
export default data
