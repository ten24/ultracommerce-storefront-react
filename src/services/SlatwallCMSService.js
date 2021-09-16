import { groupBy } from '../utils'
import { SlatwalApiService } from './SlatwalApiService'
const generateMegaMenu = content => {
  let menu = Object.keys(content)
    .map(key => (key.includes('productcategories') ? content[key] : null))
    .filter(item => item)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  if (menu.length) {
    const groupedItems = groupBy(menu, 'parentContent_contentID')
    menu = menu
      .map(item => {
        item.children = groupedItems.hasOwnProperty(item.contentID) ? groupedItems[item.contentID] : []
        return item
      })
      .filter(item => item.contentIDPath.split(',').length < 5) // filter menu panels
      .filter(item => item.urlTitle !== 'productcategories')
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }
  return { mega_menu: menu }
}
const nestContentByKey = (content, key) => {
  let data = Object.keys(content)
    .map(key => (key.includes(key) ? content[key] : null))
    .filter(item => item)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  if (data.length) {
    const groupedItems = groupBy(data, 'parentContent_contentID')
    data = data
      .map(item => {
        item.children = groupedItems.hasOwnProperty(item.contentID) ? groupedItems[item.contentID] : []
        return item
      })
      .filter(item => item.children.length)
      .filter(item => item.urlTitle === key)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }
  return data
}
const generateUtilityMenu = content => {
  let menu = Object.keys(content)
    .map(key => {
      return key.includes('main-navigation') ? content[key] : null
    })
    .filter(item => item)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  if (menu.length) {
    menu = { utility_menu: menu }
  }
  return menu
}
const getEntryBySlugAndType = async (content = {}, slug = '', type = 'page') => {
  if (type === 'header') return getHeaderBySlug(content, slug)
  if (type === 'footer') return getFooterBySlug(content, slug)
  return getEntryBySlug(content, slug)
}

const processForBlock = block => {
  let response = {}
  response.title = ''
  response.title_link = ''
  response.body = block.customBody
  response.customBody = block.customBody
  response.settings = {}

  return response
}
const processForMenuItem = menuItem => {
  let response = {}
  response.linkTitle = menuItem.title
  response.linkUrl = menuItem.linkUrl
  // response.bootstrapIconClass = menuItem.bootstrapiconclass.value
  response.columns = menuItem.children.map(block => {
    return processForBlock(block)
  })
  return response
}

/*
This will retrive content by a specifc slug
*/
const getHeaderBySlug = async (content = {}, slug = '') => {
  return SlatwalApiService.content
    .get(content)
    .then(response => {
      let hydrated = {}
      if (response.isSuccess()) {
        hydrated = response.success().data.pageRecords.reduce((accumulator, content) => {
          accumulator[content.urlTitlePath] = content
          return accumulator
        }, {})
        const uril = generateUtilityMenu(hydrated)
        const mega = generateMegaMenu(hydrated)
        hydrated = { ...uril, ...mega }
        return hydrated
      }
      return hydrated
    })
    .then(response => {
      let hydrated = {}
      if (response.mega_menu.length) {
        const menu_items = response.mega_menu.map(menuItem => {
          return processForMenuItem(menuItem)
        })
        hydrated.mega_menu = { menu_items }
      }
      if (response?.utility_menu?.length) {
        hydrated.utility_menu = { menu_items: response.utility_menu[0].customBody }
      }
      return hydrated
    })
    .then(response => {
      return { header: response }
    })
}

const getFooterBySlug = async (content = {}, slug = '') => {
  return SlatwalApiService.content
    .get(content)
    .then(response => {
      let hydrated = {}
      if (response.isSuccess()) {
        hydrated = response.success().data.pageRecords.reduce((accumulator, content) => {
          accumulator[content.urlTitlePath] = content
          return accumulator
        }, {})
        let CTA = {}
        if (hydrated['footer/contact-us']) {
          CTA['home/callToAction'] = {
            title: hydrated['footer/contact-us'].title,
            body: hydrated['footer/contact-us'].customBody,
            summary: hydrated['footer/contact-us'].customSummary,
            image: hydrated['footer/contact-us'].associatedImage,
            linkTitle: hydrated['footer/contact-us'].linkLabel,
            linkUrl: hydrated['footer/contact-us'].linkUrl,
          }
          delete hydrated['footer/contact-us']
        }

        return hydrated
      }
      return hydrated
    })
    .then(response => {
      let hydrated = {}
      const nestedFooter = nestContentByKey(response, 'footer')
      if (nestedFooter[0].children.length) {
        hydrated = { footer: nestedFooter[0] }
      }
      return hydrated
    })
}

/*
This will retrive content by a specifc slug
*/
const getEntryBySlug = async (content = {}, slug = '') => {
  return SlatwalApiService.content
    .get(content)
    .then(response => {
      let hydrated = {}
      if (response.isSuccess()) {
        hydrated = response.success().data.pageRecords.reduce((accumulator, content) => {
          accumulator[content.urlTitlePath] = content
          return accumulator
        }, {})
        return hydrated
      }
      return hydrated
    })
    .then(response => {
      let hydrated = { ...response }
      if (slug === 'home') {
        let columns = nestContentByKey(response, 'content-columns')
        if (columns.length) {
          columns = {
            title: columns[0].title,
            body: '',
            columns: columns[0].children.map(column => {
              return { customBody: column.customBody, title: column.title, fileName: column.associatedImage }
            }),
          }
        }
        hydrated = { ...hydrated, 'home/content-columns': columns }
      }

      return hydrated
    })
}

export { getEntryBySlugAndType, getEntryBySlug }
