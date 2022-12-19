const data = {
  global: {
    globalVATCountries: 'GB,IE,AD',
    globalTimeFormat: 'hh:mm tt',
    globalDateFormat: 'mmm dd, yyyy',
    globalURLKeyBrand: 'sb',
    globalURLKeyProductType: 'spt',
    globalURLKeyAccount: 'ac',
    globalURLKeyAttribute: 'att',
    globalURLKeyAddress: 'ad',
    globalURLKeyCategory: 'caty',
    globalURLKeyProduct: 'sp',
  },
  currencies: {
    USD: {
      currencySymbol: '$',
      formatMask: ' ',
    },
  },
  sites: [],
  site: {
    currencyCode: 'USD',
    settings: {
      siteDefaultCountry: 'us',
    },
  },
  router: [
    { URLKeyType: 'Product', URLKey: 'product' },
    { URLKeyType: 'ProductType', URLKey: 'product-type' },
    { URLKeyType: 'Category', URLKey: 'category' },
    { URLKeyType: 'Brand', URLKey: 'brand' },
    { URLKeyType: 'Account', URLKey: 'my-account' },
    { URLKeyType: 'Address', URLKey: 'ad' },
    { URLKeyType: 'Attribute', URLKey: 'att' },
  ],
  blog: {
    url: 'blog',
  },
  cmsProvider: 'slatwallCMS',
  enforceVerifiedAccountFlag: false,
  allowGuestCheckout: true,
  products: {
    fallbackImageCall: false,
    loginRequiredForPrice: false,
    dropdownLimit: 20,
    quantityInput: 'text', // [ text|dropdown]
  },
  productPrice: {
    checkInvetory: false,
    showPriceForUnverifiedAccounts: true,
  },
  defaultCardConfiguration: {
    input: {
      showCriteria: 'none',
      label: '',
    },
    showPrice: false,
    showBrand: true,
    buttons: [
      {
        listingButtonLabel: 'Add To Cart',
        listingButtonDisplayCriteria: 'all',
        disableListingButton: false,
        showAuthenticationRequiredMessageFlag: false,
        hideListingButton: true,
        type: 'ADD_TO_CART',
      },
    ],
  },
  defaultListingConfig: {
    showInput: true,
    viewMode: 'GRID',
    viewModeOptions: ['GRID'],
    forcedFilterOptions: ['productType_slug', 'brand_slug', 'category_slug'],
    requiredPreFilters: [],
    headings: [
      {
        heading: 'Product Name',
        value: 'product_productName',
      },
      {
        heading: 'Sku Code',
        value: 'sku_skuCode',
      },
    ],
    buttonLabel: 'frontend.product.add_to_cart',
    params: {
      propertyIdentifierList: '',
      includeSKUCount: true,
      includeResizedImages: false,
      applyStockFilter: false,
      productsListingFlag: false,
      includeSettings: true,
      includePagination: true,
      includePotentialFilters: true,
    },
    filters: {
      brand_slug: '',
      orderBy: '',
      pageSize: '12',
      currentPage: '1',
      keyword: '',
      productType_slug: '',
      category_slug: '',
    },
    returnFacetListWithFilter: 'brand,option,category,attribute,sorting,priceRange,productType',
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
    themeKey: 'default',
    host: process.env.REACT_APP_HOST_URL,
    basePath: 'custom/client/assets/images/',
    primaryColor: '#2478CC',
  },
  formatting: {
    dateFormat: 'MMM DD, YYYY',
    timeFormat: 'hh:mm a',
  },
  analytics: {
    showCookieBanner: true,
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
    // {
    //   key: 'paypalCommerce',
    //   name: 'Paypal Commerce',
    //   types: 'payment',
    //   settings: {
    //     clientID: '',
    //   },
    // },
  ],
  enableMultiSite: true,
}
export default data
