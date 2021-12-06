import { createSelector } from 'reselect'

export const getRoutes = state => state.configuration.router
export const getSiteConfig = state => state.configuration.site
export const getImageFallbackFlag = state => state.configuration.products.fallbackImageCall
export const checkInvetory = state => state.configuration.productPrice.checkInvetory

export const isVatCountry = createSelector(getSiteConfig, ({ defaultCountry, hibachiConfig }) => {
  return hibachiConfig?.vatCountries?.split(',')?.includes(defaultCountry) || false
})
export const getBrandRoute = createSelector(getRoutes, routes => {
  return routes
    .map(route => {
      return route.URLKeyType === 'Brand' ? route.URLKey : null
    })
    .filter(item => {
      return item
    })[0]
})
export const getProductRoute = createSelector(getRoutes, routes => {
  return routes
    .map(route => {
      return route.URLKeyType === 'Product' ? route.URLKey : null
    })
    .filter(item => {
      return item
    })[0]
})

export const getProductTypeRoute = createSelector(getRoutes, routes => {
  return routes
    .map(route => {
      return route.URLKeyType === 'ProductType' ? route.URLKey : null
    })
    .filter(item => {
      return item
    })[0]
})

export const getCategoryRoute = createSelector(getRoutes, routes => {
  return routes
    .map(route => {
      return route.URLKeyType === 'Category' ? route.URLKey : null
    })
    .filter(item => {
      return item
    })[0]
})
