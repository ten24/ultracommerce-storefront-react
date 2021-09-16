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
  cmsProvider: 'slatwallCMS',
  enforceVerifiedAccountFlag: false,
  products: {
    fallbackImageCall: false,
    loginRequiredForPrice: false,
  },
  productSearch: {
    propertyIdentifierList: '',
    includeSKUCount: true,
    applySiteFilter: false,
    applyStockFilter: false,
    includePagination: true,
    includePotentialFilters: true,
  },
  myAccount: {
    mostRecentCount: 3,
  },
  shopByManufacturer: {
    slug: '/brands',
    showInMenu: true,
    gridSize: 3,
    maxCount: 12,
  },
  seo: {
    title: 'Slatwall',
    titleMeta: '',
  },
  filtering: {
    productTypeBase: 'merchandise',
    requireKeyword: true,
    filterDataShowCounts: 5,
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
