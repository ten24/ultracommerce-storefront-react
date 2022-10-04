import { createSelector } from 'reselect'
import { groupBy } from '../utils'

export const getAllContent = state => state.content
export const getStructuredContent = createSelector(getAllContent, (content = {}) =>
  Object.keys(content).map(key => {
    return { ...content[key], key }
  })
)
export const getNestedContent = createSelector(getStructuredContent, (content = {}) => {
  let contentResponse = content.sort((a, b) => a.sortOrder - b.sortOrder)
  if (contentResponse.length) {
    const groupedItems = groupBy(contentResponse, 'parentContent_contentID')
    contentResponse = contentResponse
      .map(item => {
        item.children = groupedItems.hasOwnProperty(item.contentID) ? groupedItems[item.contentID] : []
        return item
      })
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }
  return contentResponse
})
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
  return shopBy?.at(0)
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
