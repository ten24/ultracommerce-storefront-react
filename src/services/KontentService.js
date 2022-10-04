import { DeliveryClient } from '@kontent-ai/delivery-sdk'

const projectId = process.env.REACT_APP_KONTENT_PROJECT_ID
const getContentID = () => {
  return Math.floor(Math.random() * 100000)
}
// Initializes DeliveryClient for a specific project
const deliveryClient = new DeliveryClient({ projectId })
const processForProductPicker = productList => {
  let response = {}
  response.title = productList.elements.title.value
  response.body = productList.elements.body.value
  response.contentBody = productList.elements.body.value
  response.settings = {}
  if (productList.elements.products.value.length) {
    response.products = productList.elements.products.value.split(',')
  }
  return response
}

const processForEnhancedMenu = (enhancedMenu, depth) => {
  let response = {}
  response.title = enhancedMenu.title.value
  response.body = enhancedMenu.body.value
  response.contentBody = enhancedMenu.body.value
  if (enhancedMenu.pages.value.length) {
    response.pages = enhancedMenu.pages.value
      .map(page => {
        return processForPage(page, depth)
      })
      .map(page => {
        page.urlTitlePath = page.slug
        return page
      })
  }
  return response
}
const processForPage = (item, depth) => {
  let hydrated = {}
  if (item.elements.slider.linkedItems.length) {
    hydrated.slider = processForSlider(item.elements.slider.linkedItems?.at(0))
  }
  if (item.elements.content_columns.linkedItems.length) {
    hydrated.contentColumns = processForContentColumn(item.elements.content_columns.linkedItems?.at(0))
  }
  if (item.elements.call_to_action.linkedItems.length) {
    hydrated.callToAction = processForCTA(item.elements.call_to_action.linkedItems?.at(0))
  }
  if (item.elements.product_listing.linkedItems.length) {
    hydrated.product = processForProductPicker(item.elements.product_listing.linkedItems?.at(0))
    hydrated.productListingPageFlag = true
  }
  // Dont process the enhanced Menu again because it will be an infinate loop
  if (item.elements.enhanced_menu.value.length) {
    hydrated.menu = processForEnhancedMenu(item.elements.enhanced_menu.value?.at(0), depth + 1)
  }
  hydrated.contentID = getContentID()
  hydrated.slug = item.elements.slug.value
  hydrated.permissions = { accessFlag: true, nonRestrictedFlag: true }
  hydrated.title = item.elements.title.value
  hydrated.body = item.elements.body.value
  hydrated.contentBody = item.elements.body.value
  hydrated.contentPageType = 'BasicPage'
  return hydrated
}

/*
This will retrive content by a specifc slug
*/
const getEntryBySlug = async (content = {}, slug = '') => {
  return deliveryClient
    .items()
    .type('page')
    .depthParameter(2)
    .equalsFilter('elements.Slug', slug)
    .toPromise()
    .then(response => {
      let hydrated = {}
      if (response.data.items.length) {
        const item = response.data.items?.at(0)
        hydrated = processForPage(item, 1)
      } else {
        return
      }
      return hydrated
    })
    .then(response => {
      let augmentedResponse = {}
      if (slug === 'home') {
        augmentedResponse[slug] = response
      } else {
        if (response?.menu) {
          response.menu.pages.forEach(page => {
            augmentedResponse[page.slug] = { ...page, displayInNavigation: true }
          })
        }
        augmentedResponse[slug] = response
      }
      return augmentedResponse
    })
}

/*
This will retrive content by a specifc slug
*/
const getHeaderBySlug = async (content = {}, slug = '') => {
  return deliveryClient
    .items()
    .type('header')
    .depthParameter(5)
    .equalsFilter('elements.contenttitle', slug)
    .toPromise()
    .then(response => {
      let hydrated = {}
      if (response.data.items.length) {
        const item = response.data.items?.at(0)
        if (item.elements.utility_menu.linkedItems.length) {
          hydrated.utility_menu = processForMenu(item.elements.utility_menu.linkedItems?.at(0))
        }
        if (item.elements.mega_menu.linkedItems.length) {
          hydrated.mega_menu = processForMenu(item.elements.mega_menu.linkedItems?.at(0))
        }
        hydrated.title = item.elements.contenttitle.value
        hydrated.settings = {}
      }
      return { header: hydrated }
    })
}
/*
This will retrive content by a specifc slug
*/
const getFooterBySlug = async (content = {}, slug = '') => {
  return deliveryClient
    .items()
    .type('footer')
    .depthParameter(5)
    .equalsFilter('elements.heading', slug)
    .toPromise()
    .then(response => {
      let hydrated = {}
      if (response.data.items.length) {
        const item = response.data.items?.at(0)
        if (item.elements.blocks.linkedItems.length) {
          hydrated.children = item.elements.blocks.linkedItems.map(block => {
            return processForBlock(block)
          })
        }
        hydrated.title = item.elements.heading.value
        hydrated.key = getContentID()
        hydrated.contentBody = item.elements.custombody.value
      }
      return { footer: hydrated }
    })
}
/*
This will retrive content by a specifc slug
*/
const getEntryBySlugAndType = async (content = {}, slug = '', type = 'page') => {
  if (type === 'page') return getEntryBySlug(content, slug)
  if (type === 'header') return getHeaderBySlug(content, slug)
  if (type === 'footer') return getFooterBySlug(content, slug)
}
// Blog Functions
const getBlogPostData = ({ slug }) => {
  return deliveryClient
    .items()
    .type('blog_post')
    .depthParameter(5)
    .equalsFilter('elements.Slug', slug)
    .toPromise()
    .then(response => {
      let hydrated = {}
      if (response.data.items.length) {
        hydrated = processForPost(response.data.items?.at(0))
      }
      return hydrated
    })
}

const getBlogPosts = ({ limit = 12, skip = 0, category = [] }) => {
  let prom
  if (category.length) {
    prom = deliveryClient.items().type('blog_post').depthParameter(5).includeTotalCountParameter().limitParameter(limit).skipParameter(skip).anyFilter('elements.blog_categories', category).toPromise()
  } else {
    prom = deliveryClient.items().type('blog_post').depthParameter(5).includeTotalCountParameter().limitParameter(limit).skipParameter(skip).toPromise()
  }
  return prom.then(response => {
    let hydrated = {}
    if (response.data.items.length) {
      hydrated.items = response.data.items.map(post => {
        return processForPost(post)
      })
    }
    hydrated.total = response.data.pagination.totalCount
    return hydrated
  })
}

const getBlogCatagories = () => {
  return deliveryClient
    .taxonomy('blog_categories')
    .toPromise()
    .then(response => {
      let hydrated = []
      if (response.taxonomy.terms.length) {
        hydrated = response.taxonomy.terms.map(post => {
          return processForCatagory(post)
        })
      }
      return hydrated
    })
}
// Process Methods
const processForAsset = asset => {
  return {
    name: asset.name,
    url: asset.url,
  }
}
const processForCatagory = ({ codename, name }) => {
  return {
    name,
    value: codename,
  }
}
const processForSlide = slide => {
  let response = {}
  response.title = slide.elements.contenttitle.value
  response.contentBody = slide.elements.contentbody.value
  response.contentImage = processForAsset(slide.elements.contentimage.value?.at(0))
  response.imagePath = response.contentImage.url
  response.linkUrl = slide.elements.contentlink.value
  response.linkLabel = slide.elements.contentlinktitle.value
  response.contentID = getContentID()
  return response
}
const processForSlider = slider => {
  let response = {}
  response.contentTitle = slider.elements.contenttitle.value
  response.contentBody = slider.elements.contentbody.value
  response.contentID = getContentID()
  response.slides = slider.elements.slider.linkedItems.map(slide => {
    return processForSlide(slide)
  })
  return response
}
const processForBlock = block => {
  let response = {}
  response.title = block.elements.title.value
  response.contentBody = block.elements.body.value
  response.urlTitle = block.system.codename.replaceAll('_', '-')
  response.key = `${getContentID()}/${block.system.codename.replaceAll('_', '-')}`
  if (block.elements.image.value.length) {
    response.image = processForAsset(block.elements.image.value?.at(0))
    response.imagePath = response.image.url
  }
  return response
}
const processForCTA = cta => {
  let response = {}
  response.title = cta.elements.title.value
  response.linkLabel = cta.elements.link_title.value
  response.linkUrl = cta.elements.link_url.value
  response.body = cta.elements.body.value
  response.summary = cta.elements.summary.value
  response.contentBody = cta.elements.body.value
  if (cta.elements.image.value.length) {
    response.image = processForAsset(cta.elements.image.value?.at(0))
  }
  response.settings = {}
  return response
}
const processForContentColumn = item => {
  let response = {}
  response.title = item.elements.title.value
  response.body = item.elements.body.value
  response.columns = item.elements.content_blocks.linkedItems.map(block => {
    return processForBlock(block)
  })
  return response
}
const processForMenuItem = menuItem => {
  let response = {}
  response.linkTitle = menuItem.elements.link_title.value
  response.linkUrl = menuItem.elements.link_url.value
  response.bootstrapIconClass = menuItem.elements.bootstrapiconclass.value
  response.columns = menuItem.elements.blocks.linkedItems.map(block => {
    return processForBlock(block)
  })
  return response
}

const processForMenu = menu => {
  let response = {}
  response.title = menu.elements.title.value
  response.body = menu.elements.body.value
  response.summary = menu.elements.summary.value
  if (menu.elements.image.value.length) {
    response.image = processForAsset(menu.elements.image.value?.at(0))
  }
  response.menu_items = menu.elements.menu_items.linkedItems.map(block => {
    return processForMenuItem(block)
  })
  return response
}

const processForAuthor = author => {
  return author.name.value.length ? author.name.value : ''
}
const processForPost = post => {
  const response = {}
  response.seo = { title: post.elements.page_title.value }
  response.postTitle = post.elements.posttitle.value

  if (post.elements.postimage.value.length) {
    response.postImage = processForAsset(post.elements.postimage.value?.at(0))
  }
  if (post.elements.author.name.value) {
    response.authorName = processForAuthor(post.elements.author.name.value?.at(0))
  }
  response.publicationDate = post.system.lastModified
  response.postSummary = post.elements.summary.value
  response.postContent = post.elements.postcontent.value
  response.slug = post.elements.slug.value
  if (post.elements.blog_categories.value.length) {
    response.blogcategory = post.elements.blog_categories.value.map(post => {
      return processForCatagory(post)
    })
  }
  return response
}

export { getEntryBySlug, getBlogCatagories, getBlogPostData, getBlogPosts, getEntryBySlugAndType }
