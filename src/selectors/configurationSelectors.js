import { createSelector } from 'reselect'

export const getRoutes = state => state.configuration.router
export const getSiteConfig = state => state.configuration.site
export const getSiteSetting = state => state.configuration.site.settings
export const getGlobalSettings = state => state.configuration.global
export const getCurrencies = state => state.configuration.currencies
export const getDefaultCountry = state => state.configuration.site.settings.siteDefaultCountry.toUpperCase()
export const getAvailableLocales = state => state.configuration.site.settings.siteAvailableLocales
export const getImageFallbackFlag = state => state.configuration.products.fallbackImageCall
export const checkInvetory = state => state.configuration.productPrice.checkInvetory
export const getBlogRoute = state => state.configuration.blog.url
export const getSites = state => state.configuration.sites
export const getEnableMultiSite = state => state.configuration.enableMultiSite
export const getSocialLogins = state => state.configuration?.integrations?.filter(({ types }) => types.includes('authentication'))
export const getPaymentIntegrations = state => state.configuration?.integrations?.filter(({ types }) => types.includes('payment'))
export const getDataIntegrations = state => state.configuration?.integrations?.filter(({ types }) => types.includes('data'))
export const getThemeConfig = state => state.configuration.theme
export const isVatCountry = createSelector([getSiteSetting, getGlobalSettings], ({ siteDefaultCountry }, { globalVATCountries }) => {
  return globalVATCountries?.split(',')?.includes(siteDefaultCountry) || false
})
export const getBrandRoute = createSelector(getRoutes, routes => {
  return routes
    .map(route => {
      return route.URLKeyType === 'Brand' ? route.URLKey : null
    })
    .filter(item => {
      return item
    })?.[0]
})
export const getProductRoute = createSelector(getRoutes, routes => {
  return routes
    .map(route => {
      return route.URLKeyType === 'Product' ? route.URLKey : null
    })
    .filter(item => {
      return item
    })?.[0]
})

export const getProductTypeRoute = createSelector(getRoutes, routes => {
  return routes
    .map(route => {
      return route.URLKeyType === 'ProductType' ? route.URLKey : null
    })
    .filter(item => {
      return item
    })?.[0]
})

export const getCategoryRoute = createSelector(getRoutes, routes => {
  return routes
    .map(route => {
      return route.URLKeyType === 'Category' ? route.URLKey : null
    })
    .filter(item => {
      return item
    })?.[0]
})
