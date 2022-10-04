import { SlatwalApiService } from './SlatwalApiService'

const getPage = params => {
  return SlatwalApiService.content.get({ ...params, lang: localStorage.getItem('i18nextLng') }).then(response => {
    let hydrated = {}
    if (response.isSuccess() && response.success().data.content) {
      hydrated = response.success().data.content
      if (hydrated.contentElements) {
        hydrated.contentElements = hydrated.contentElements?.sort((a, b) => a?.sortOrder - b?.sortOrder)?.map(el => formatElement(el))
      }
    }
    return { isSuccess: response.isSuccess(), hydrated }
  })
}

const formatElement = el => {
  if (!el?.contentElementTypeCode) return el
  el = globalProcess(el)
  if (el.contentElementTypeCode === 'cetContentSlide') {
    el = processForSlide(el)
  } else if (el.contentElementTypeCode === 'cetHeader') {
  } else if (el.contentElementTypeCode === 'cetFooter') {
  } else if (el.contentElementTypeCode === 'cetSidebar') {
  } else if (el.contentElementTypeCode === 'cetCallToCaction') {
    el = processForCallToCaction(el)
  } else if (el.contentElementTypeCode === 'cetMenu') {
  } else if (el.contentElementTypeCode === 'cetMenuItem') {
    el = processForMenuItem(el)
  } else if (el.contentElementTypeCode === 'cetColumns') {
    el = processForColumns(el)
  } else if (el.contentElementTypeCode === 'cetColumn') {
    el = processForColumns(el)
  } else if (el.contentElementTypeCode === 'cetBlock') {
  } else if (el.contentElementTypeCode === 'cetTab') {
  } else if (el.contentElementTypeCode === 'cetListItem') {
  } else if (el.contentElementTypeCode === 'cetListItemWithImage') {
  } else if (el.contentElementTypeCode === 'cetSiteSelector') {
  } else if (el.contentElementTypeCode === 'cetLanguageSelector') {
  } else if (el.contentElementTypeCode === 'cetMegaMenu') {
  } else if (el.contentElementTypeCode === 'cetBody') {
    el = processForPages(el)
  } else if (el.contentElementTypeCode === 'cetProductListing') {
  } else if (el.contentElementTypeCode === 'cetSearchBox') {
  } else if (el.contentElementTypeCode === 'cetLink') {
  } else if (el.contentElementTypeCode === 'cetCartLink') {
  } else if (el.contentElementTypeCode === 'cetAccountLink') {
  } else if (el.contentElementTypeCode === 'cetTabs') {
  } else if (el.contentElementTypeCode === 'cetHtml') {
  } else if (el.contentElementTypeCode === 'cetRow') {
  } else if (el.contentElementTypeCode === 'cetMailChimpForm') {
  } else if (el.contentElementTypeCode === 'cetBlogListing') {
    el = processForBlogListing(el)
  } else if (el.contentElementTypeCode === 'cetContentSlider') {
  } else if (el.contentElementTypeCode === 'cetCategoryListing') {
  } else if (el.contentElementTypeCode === 'cetBrandListing') {
  } else if (el.contentElementTypeCode === 'cetProductTypeListing') {
  } else if (el.contentElementTypeCode === 'cetRibbon') {
  }
  el.innerElements = el?.innerElements?.map(el => formatElement(el))
  return el
}

const globalProcess = el => {
  el.linkTitle = el?.linkLabel
  el.contentID = el?.contentElementID
  el.systemCode = el?.contentElementTypeCode
  el.publicationDate = el?.contentPublicationDate?.trim()?.length > 0 ? el.contentPublicationDate : null
  el.slug = el?.linkUrl

  return el
}

const processForSlide = el => {
  if (!!el?.contentElementName) el.title = el.contentElementName
  return el
}
const processForPages = el => {
  el.title = el?.contentElementName
  el.contentBody = el?.contentElementBody
  return el
}
const processForMenuItem = el => {
  el.title = el?.linkLabel
  el.title = !!el?.title ? el?.title : el?.contentElementName
  el.slug = el?.linkUrl

  el.contentBody = el?.contentElementBody
  return el
}

const processForColumns = el => {
  el.title = el?.contentElementName
  el.count = el?.innerElements?.length
  return el
}
const processForCallToCaction = el => {
  if (!!el?.contentElementName) el.title = el.contentElementName
  return el
}
const processForBlogListing = el => {
  el.relatedBlogs = el?.relatedBlogs?.map(el => {
    el = globalProcess(el)
    if (!!el?.contentElementName) el.title = el.contentElementName
    // TODO: get this data
    if (el?.imagePath && el?.imagePath?.trim()?.length) {
      el.postImage = {
        name: el?.name,
        url: el?.imagePath,
      }
    }
    el.blogcategory = el?.categories?.map(({ categoryName, urlTitle }) => {
      return {
        name: categoryName,
        value: urlTitle,
      }
    })
    el.slug = el?.urlTitle
    el.postTitle = el?.title
    el.postSummary = el?.contentSummary
    el.postContent = el?.contentBody
    return el
  })

  return el
}
export { getPage, formatElement }

//     {` ${systemCode}`}
