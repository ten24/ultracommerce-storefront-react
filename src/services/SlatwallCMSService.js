import { axios } from './AxiosService'
import { getContentByType, getContentPages, groupBy } from '../utils'
import { SlatwalApiService, sdkURL } from './SlatwalApiService'
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
const generateSocialMenu = content => {
  let menu = Object.keys(content)
    .map(key => (key.includes('utilitybar') ? content[key] : null))
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
      .filter(item => item.urlTitle === 'utilitybar')
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }
  return { social_menu: menu }
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
      .filter(item => item.urlTitle === key || item.urlTitlePath === key)
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
const processForBlock = (block, includeTitle = true) => {
  let response = {}
  if (includeTitle) {
    response.title = block.title
    response.title_link = block.linkUrl
  }
  response.linkLabel = block.linkLabel
  response.profilePhoneNumber = block?.profilePhoneNumber
  response.profileEmailAddress = block?.profileEmailAddress
  response.positionName = block?.positionName
  response.linkUrl = block.linkUrl
  response.body = block.contentBody
  response.contentSummary = block.contentSummary
  response.contentBody = block.contentBody
  response.imagePath = block.imagePath
  response.elementType = block.contentElementType_systemCode

  return response
}
const processForMenuItem = menuItem => {
  let response = {}
  response.linkTitle = menuItem.title
  response.linkUrl = menuItem.linkUrl
  // response.bootstrapIconClass = menuItem.bootstrapiconclass.value
  response.columns = menuItem.children.map(block => {
    return processForBlock(block, false)
  })
  return response
}

/*
This will retrive content by a specifc slug
*/
const getHeaderBySlug = async (content = {}) => {
  return SlatwalApiService.content
    .get(content)
    .then(response => {
      let hydrated = {}
      if (response.isSuccess()) {
        hydrated = response.success().data.pageRecords.reduce((accumulator, content) => {
          accumulator[content.urlTitlePath] = content
          return accumulator
        }, {})
        const social = generateSocialMenu(hydrated)
        const uril = generateUtilityMenu(hydrated)
        const mega = generateMegaMenu(hydrated)
        hydrated = { ...social, ...uril, ...mega }
        return hydrated
      }
      return hydrated
    })
    .then(response => {
      let hydrated = {}
      if (response?.mega_menu?.length) {
        const menu_items = response.mega_menu.map(menuItem => {
          return processForMenuItem(menuItem)
        })
        hydrated.mega_menu = { menu_items }
      }
      if (response?.utility_menu?.length) {
        hydrated.utility_menu = { menu_items: response.utility_menu[0].contentBody }
      }
      if (response?.social_menu?.length) {
        const social_items = response.social_menu[0].children.map(menuItem => {
          return processForMenuItem(menuItem)
        })
        hydrated.social_menu = { social_items }
      }

      hydrated.raw = response

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
            body: hydrated['footer/contact-us'].contentBody,
            summary: hydrated['footer/contact-us'].contentSummary,
            image: hydrated['footer/contact-us'].imagePath,
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
      if (nestedFooter[0]?.children?.length) {
        nestedFooter[0].children = nestedFooter[0]?.children?.filter(child => child?.contentElementType_systemCode?.trim()?.length === 0 || child?.contentElementType_systemCode === 'cetBlock')
        nestedFooter[0].raw = response
        hydrated = { footer: nestedFooter[0] }
      }
      return hydrated
    })
}

/*
This will retrive content by a specifc slug
*/

const getEntryBySlug = (payload = {}) => {
  return axios({
    method: 'POST',
    withCredentials: true,
    url: `${sdkURL}api/scope/getContentByPage`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
    .then(response => {
      let hydrated = []
      if (response?.status === 200) {
        hydrated = response?.data?.data?.pageRecords || []
      }
      return hydrated
    })
    .then(response => {
      let hydrated = {}
      // now all the others
      const globalProduct = response?.filter(item => item.urlTitlePath === 'product' || item.urlTitlePath.startsWith('product/'))
      const globalProductType = response?.filter(item => item.urlTitlePath === 'products' || item.urlTitlePath.startsWith('products/'))
      const globalBrand = response?.filter(item => item.urlTitlePath === 'brand' || item.urlTitlePath.startsWith('brand/'))
      const globalCategory = response?.filter(item => item.urlTitlePath === 'category' || item.urlTitlePath.startsWith('category/'))
      const globalconfig = response?.filter(item => item.urlTitlePath === 'globalconfig' || item.urlTitlePath.startsWith('globalconfig/'))
      if (globalProduct.length) hydrated['globalProduct'] = globalProduct
      if (globalProductType.length) hydrated['globalProductType'] = globalProductType
      if (globalBrand.length) hydrated['globalBrand'] = globalBrand
      if (globalCategory.length) hydrated['globalCategory'] = globalCategory
      if (globalconfig.length) hydrated['globalconfig'] = globalconfig
      return { response, hydrated }
    })
    .then(({ response, hydrated }) => {
      const newResponse = response?.reduce((accumulator, content) => {
        accumulator[content.urlTitlePath] = content
        return accumulator
      }, {})
      return { response: newResponse, hydrated }
    })
    .then(({ response, hydrated }) => {
      if (payload?.productUrlTitle) {
        const productSlug = `${payload?.productRoute}/${payload?.productUrlTitle}`
        const nestedProducContent = nestContentByKey(response, productSlug)
        if (nestedProducContent?.length) {
          hydrated[productSlug] = nestedProducContent[0]
        } else {
          hydrated[productSlug] = {}
        }
      }
      return { response, hydrated }
    })
    .then(({ response, hydrated }) => {
      // first lets looks for header
      const headerContent = Object.keys(response)
        ?.filter(itemKey => itemKey === 'header' || itemKey.startsWith('header/'))
        .reduce((obj, key) => {
          obj[key] = response[key]
          return obj
        }, {})
      if (Object.keys(headerContent)?.length) {
        let hydtratedHeader = {}
        const uril = generateUtilityMenu(headerContent)
        const mega = generateMegaMenu(headerContent)
        hydtratedHeader = { ...uril, ...mega }
        if (hydtratedHeader?.mega_menu?.length) {
          const menu_items = hydtratedHeader.mega_menu.map(menuItem => {
            return processForMenuItem(menuItem)
          })
          hydtratedHeader.mega_menu = { menu_items }
        }
        if (hydtratedHeader?.utility_menu?.length) {
          hydtratedHeader.utility_menu = { menu_items: hydtratedHeader.utility_menu[0].contentBody }
        }
        hydrated = { ...hydrated, header: hydtratedHeader }
      }
      return { response, hydrated }
    })
    .then(({ response, hydrated }) => {
      // Now the footer
      const footerContent = Object.keys(response)
        ?.filter(itemKey => itemKey === 'footer' || itemKey.startsWith('footer/'))
        .reduce((obj, key) => {
          obj[key] = response[key]
          return obj
        }, {})
      if (Object.keys(footerContent)?.length) {
        let hydtratedFooter = {}

        let CTA = {}
        if (footerContent['footer/contact-us']) {
          CTA['home/callToAction'] = {
            title: footerContent['footer/contact-us'].title,
            body: footerContent['footer/contact-us'].contentBody,
            summary: footerContent['footer/contact-us'].contentSummary,
            image: footerContent['footer/contact-us'].imagePath,
            linkTitle: footerContent['footer/contact-us'].linkLabel,
            linkUrl: footerContent['footer/contact-us'].linkUrl,
          }
          delete hydrated['footer/contact-us']
        }
        const nestedFooter = nestContentByKey(footerContent, 'footer')
        if (nestedFooter[0]?.children?.length) {
          nestedFooter[0].children = nestedFooter[0]?.children?.filter(child => child?.contentElementType_systemCode?.trim()?.length === 0 || child?.contentElementType_systemCode === 'cetBlock')
          hydtratedFooter = nestedFooter[0]
        }

        hydrated = { ...hydrated, footer: hydtratedFooter }
      }

      return { response, hydrated }
    })
    .then(({ response, hydrated }) => {
      const pages = getContentPages(Object.values(response))
      pages.forEach(page => {
        const pageStruc = processForPage(page, Object.values(response))
        hydrated[page.urlTitlePath] = { ...pageStruc, ...response[page.urlTitlePath] }
      })

      return { response, hydrated }
    })
}
const processForPage = (page, content) => {
  let hydrated = {}
  hydrated.permissions = { accessFlag: true }
  const descendants = getDescendants(content, page.contentID)
  hydrated.tabs = getContentByType(descendants, 'cetTab')
  hydrated.slider = processForSlider(descendants)
  hydrated.contentColumns = processForContentColumn(descendants)
  hydrated.callToAction = processForCTA(descendants)
  hydrated.sidebar = processForSidebar(descendants)
  hydrated.tabs = processForTabs(descendants)
  const listItems = getContentByType(descendants, 'cetListItem,cetListItemWithImage')
  hydrated.listItems = listItems.map(item => {
    return processListItem(item, descendants)
  })
  const blocks = getContentByType(descendants, 'cetBlock,cetProfile')
  hydrated.blocks = blocks.map(item => {
    return processForBlock(item, descendants)
  })
  hydrated.menu = {}

  hydrated.contentPageType = 'BasicPage'
  return hydrated
}
const getParent = (content = [], parentContentID) => content.filter(item => item.contentID === parentContentID)
const getChildren = (content = [], contentID) => content.filter(item => item.parentContent_contentID === contentID).sort((a, b) => a.sortOrder - b.sortOrder)
const getDescendants = (content = [], contentID) => content.filter(item => item.contentIDPath.includes(contentID) && item.contentID !== contentID).sort((a, b) => a.sortOrder - b.sortOrder)
const processForCTA = content => {
  let cta = getContentByType(content, 'cetCallToCaction')
  let response = {}
  if (cta?.length) {
    cta = cta[0]
    response.title = cta.title
    response.linkLabel = cta.linkLabel
    response.linkUrl = cta.linkUrl
    response.summary = cta.contentSummary
    response.contentBody = cta.contentBody
    response.body = cta.contentBody
    // if (cta.contentImage) {
    //   response.image = processForAsset(cta.image)
    // }
    response.settings = {}
  }

  return response
}

const processForSlide = slide => {
  let response = {}
  response.title = slide.title
  response.contentBody = slide.contentBody
  response.imagePath = slide.imagePath
  response.linkUrl = slide.linkUrl
  response.linkLabel = slide.linkLabel
  response.contentID = slide.contentID
  return response
}
const processForSlider = content => {
  const slides = getContentByType(content, 'cetContentSlide')
  let response = {}
  if (slides?.length) {
    const parentId = slides[0].parentContent_contentID
    const parent = getParent(content, parentId)
    response.contentTitle = parent[0].title
    response.contentBody = parent[0].contentBody
    response.contentID = parent[0].contentID
    response.slides = slides.map(slide => {
      return processForSlide(slide)
    })
  }

  return response
}
const processForContentColumn = content => {
  const column = getContentByType(content, 'cetColumns')
  const columns = getContentByType(content, 'cetColumn')
  let response = {}
  if (column?.length) {
    response.title = column[0].title
    response.contentTitle = column[0].title
    response.contentBody = column[0].contentBody
    response.contentID = column[0].contentID
    response.elementType = column[0].contentElementType_systemCode
    response.columns = columns.map(c => {
      return processForBlock(c)
    })
  }

  return response
}
const processForTabs = content => {
  const tabs = getContentByType(content, 'cetTab')
  return tabs.map(tab => {
    let hydrated = {}
    hydrated.title = tab.title
    hydrated.contentBody = tab.contentBody
    hydrated.contentID = tab.contentID

    hydrated.key = tab.contentID
    hydrated.children = getChildren(content, tab.contentID)
    if (hydrated.children) {
      hydrated.children = hydrated.children.map(child => {
        return processGeneral(child, content)
      })
    }

    return hydrated
  })
}
const processListItem = (item, content) => {
  let response = {}
  response.title = item.title
  response.contentBody = item.contentBody
  response.contentID = item.contentID
  response.elementType = item.contentElementType_systemCode
  response.key = item.contentID
  response.imagePath = item.imagePath
  response.linkUrl = item.linkUrl
  response.linkLabel = item.linkLabel
  response.children = getChildren(content, item.contentID)
  if (response.children) {
    response.children = response.children.map(child => {
      return processGeneral(child, content)
    })
  }
  return response
}
const processGeneral = (item, content) => {
  let response = {}
  if (['cetListItem', 'cetListItemWithImage'].includes(item.contentElementType_systemCode)) {
    response = processListItem(item, content)
  }
  if (['cetColumns'].includes(item.contentElementType_systemCode)) {
    response = processForContentColumn(content)
  }
  if (['cetBlock', 'cetProfile'].includes(item.contentElementType_systemCode)) {
    response = processForBlock(item)
  }
  return response
}
const processForSidebar = content => getContentByType(content, 'cetSidebar')

const processForPost = post => {
  const response = { ...post }
  response.postTitle = post?.title
  response.publicationDate = post?.contentPublicationDate?.trim()?.length > 0 ? post.contentPublicationDate : null
  if (post?.imagePath && post?.imagePath?.trim()?.length) {
    response.postImage = {
      name: post?.name,
      url: post?.imagePath,
    }
  }
  response.blogcategory = post?.categories?.map(({ categoryName, urlTitle }) => {
    return {
      name: categoryName,
      value: urlTitle,
    }
  })

  response.postSummary = post?.contentSummary
  response.postContent = post?.contentBody
  response.slug = post?.urlTitle

  return response
}
const getBlogPosts = ({ limit = 12, currentPage = 1, category = [], blogKey = 'blog' }) => {
  let payload = { 'f:urlTitlePath:like': `${blogKey}/%`, 'p:show': limit, 'p:current': currentPage, includeImages: true, includeCategories: true }
  if (category.length) {
    payload['f:categories.urlTitle:in'] = category.join()
  }
  return SlatwalApiService.content.get(payload).then(response => {
    let hydrated = {}
    if (response.isSuccess()) {
      hydrated.items = response.success().data.pageRecords.map(post => {
        return processForPost(post)
      })
      hydrated.total = response.success().data.recordsCount
      return hydrated
    }

    return hydrated
  })
}
const getBlogPostData = ({ slug }) => {
  return SlatwalApiService.content.get({ 'f:urlTitle': slug, includeImages: true, includeSettings: true, includeCategories: true }).then(response => {
    let hydrated = {}
    if (response.isSuccess()) {
      response.success().data.pageRecords.forEach(post => {
        hydrated = processForPost(post)
      })
    }

    return hydrated
  })
}
const processForCatagory = ({ urlTitle, categoryName, contentTotal }) => {
  return {
    name: contentTotal ? `${categoryName} (${contentTotal})` : categoryName,
    value: urlTitle,
  }
}
const getBlogCatagories = () => {
  const payload = { entityName: 'Category', includeContentCount: true, 'f:contents.contentID:is not': 'NULL' }
  return SlatwalApiService.general.getEntity(payload).then(response => {
    let hydrated = []
    if (response.isSuccess()) {
      hydrated = response.success().data.pageRecords.map(post => {
        return processForCatagory(post)
      })
    }
    return hydrated
  })
}
export { getEntryBySlugAndType, getEntryBySlug, getBlogPosts, getBlogPostData, getBlogCatagories }
