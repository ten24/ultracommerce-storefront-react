import { createSelector } from 'reselect'

export const getAllContent = state => state.content

export const getMainBannerSlides = createSelector(getAllContent, (content = {}) => {
  return Object.keys(content)
    .map(key => {
      if (key.includes('main-banner-slider/')) {
        return content[key]
      }
      return null
    })
    .filter(item => {
      return item
    })
})

export const getOrganizedContentSelector = createSelector(getAllContent, (content = {}) => {
  return Object.keys(content)
    .map(key => {
      if (content[key] && content[key].settings) {
        content[key].key = key
        return content[key]
      }
      return null
    })
    .filter(item => {
      return item
    })
})

export const getShopBy = createSelector(getAllContent, (content = {}) => {
  let shopBy = [{ title: '', linkUrl: '/' }]
  if (Object.keys(content).includes('home/shop-by')) {
    shopBy = Object.keys(content)
      .filter(key => {
        return key === 'home/shop-by'
      })
      .map(key => {
        return content[key]
      })
  }
  return shopBy[0]
})

export const getMyAccountMenu = createSelector(getAllContent, (content = {}) => {
  return Object.keys(content)
    .filter(key => {
      return key.includes('my-account/') && content[key].displayInNavigation
    })
    .map(key => {
      return content[key]
    })
    .sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1))
})

export const getAllSidebars = createSelector(getAllContent, (content = {}) => {
  return Object.keys(content)
    .map(key => {
      if (content[key] && content[key].settings && content[key].settings.contentTemplateFile === 'sidebar.cfm') {
        content[key].key = key
        return content[key]
      }
      return null
    })
    .filter(item => {
      return item
    })
})

export const getAllbanners = createSelector(getAllContent, (content = {}) => {
  return Object.keys(content)
    .map(key => {
      if (content[key] && content[key].settings && content[key].settings.contentTemplateFile === 'banner.cfm') {
        content[key].key = key
        return content[key]
      }
      return null
    })
    .filter(item => {
      return item
    })
})

export const getAllFooterContentSelector = createSelector(getAllContent, (content = {}) => {
  return Object.keys(content)
    .map(key => {
      if (content[key] && content[key].settings) {
        content[key].key = key
        return content[key]
      }
      return null
    })
    .filter(item => {
      return item
    })
    .map(content => {
      return content.key.includes(`footer`) ? content : null
    })
    .filter(item => {
      return item
    })
    .sort((a, b) => {
      return a?.sortOrder - b?.sortOrder
    })
})
