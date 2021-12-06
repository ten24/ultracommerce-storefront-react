import { DeliveryClient } from '@kentico/kontent-delivery'

const projectId = process.env.REACT_APP_KONTENT_PROJECT_ID
const getContentID = () => {
  return Math.floor(Math.random() * 100000)
}
// Initializes DeliveryClient for a specific project
const deliveryClient = new DeliveryClient({ projectId })
const processForProductPicker = productList => {
  let response = {}
  response.title = productList.title.value
  response.body = productList.body.value
  response.contentBody = productList.body.value
  response.settings = {}
  if (productList.products.value.length) {
    response.products = productList.products.value.split(',')
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

  if (item.slider.value.length) {
    hydrated.slider = processForSlider(item.slider.value[0])
  }
  if (item.content_columns.value.length) {
    hydrated.contentColumns = processForContentColumn(item.content_columns.value[0])
  }
  if (item.call_to_action.value.length) {
    hydrated.callToAction = processForCTA(item.call_to_action.value[0])
  }
  if (item.product_listing.value.length) {
    hydrated.product = processForProductPicker(item.product_listing.value[0])
    hydrated.productListingPageFlag = true
  }
  // Dont process the enhanced Menu again because it will be an infinate loop
  if (item.enhanced_menu.value.length) {
    hydrated.menu = processForEnhancedMenu(item.enhanced_menu.value[0], depth + 1)
  }
  hydrated.contentID = getContentID()
  hydrated.slug = item.slug.value
  hydrated.title = item.title.value
  hydrated.body = item.body.value
  hydrated.contentBody = item.body.value
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
      if (response.items.length) {
        const item = response.items[0]
        hydrated = processForPage(item, 1)
      }
      // console.log('hydrated ', hydrated)
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

      // console.log('final ', augmentedResponse)
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
      if (response.items.length) {
        const item = response.items[0]
        if (item.utility_menu.value.length) {
          hydrated.utility_menu = processForMenu(item.utility_menu.value[0])
        }
        if (item.mega_menu.value.length) {
          hydrated.mega_menu = processForMenu(item.mega_menu.value[0])
        }
        hydrated.title = item.contenttitle.value
        hydrated.settings = {}
      }
      // console.log('hydrated ', hydrated)
      return { header: hydrated }
    })
}
/*
This will retrive content by a specifc slug
*/
const getFooterBySlug = async (content = {}, slug = '') => {
  // console.log('slug', slug)
  return deliveryClient
    .items()
    .type('footer')
    .depthParameter(5)
    .equalsFilter('elements.heading', slug)
    .toPromise()
    .then(response => {
      let hydrated = {}
      if (response.items.length) {
        const item = response.items[0]
        //   console.log('getFooterBySlug', response)
        if (item.blocks.value.length) {
          hydrated.children = item.blocks.value.map(block => {
            return processForBlock(block)
          })
        }
        hydrated.title = item.heading.value
        hydrated.key = getContentID()
        hydrated.contentBody = item.custombody.value
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
      if (response.items.length) {
        hydrated = processForPost(response.items[0])
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
    if (response.items.length) {
      hydrated.items = response.items.map(post => {
        return processForPost(post)
      })
    }

    hydrated.total = response.pagination.totalCount
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
  response.title = slide.contenttitle.value
  response.contentBody = slide.contentbody.value
  response.contentImage = processForAsset(slide.contentimage.value[0])
  response.imagePath = response.contentImage.url
  response.linkUrl = slide.contentlink.value
  response.linkLabel = slide.contentlinktitle.value
  response.contentID = getContentID()
  return response
}
const processForSlider = slider => {
  let response = {}
  response.contentTitle = slider.contenttitle.value
  response.contentBody = slider.contentbody.value
  response.contentID = getContentID()
  response.slides = slider.slider.value.map(slide => {
    return processForSlide(slide)
  })
  return response
}
const processForBlock = block => {
  let response = {}
  response.title = block.title.value
  response.contentBody = block.body.value
  response.urlTitle = block.system.codename.replaceAll('_', '-')
  response.key = `${getContentID()}/${block.system.codename.replaceAll('_', '-')}`
  if (block.image.value.length) {
    response.image = processForAsset(block.image.value[0])
    response.imagePath = response.image.url
  }
  return response
}
const processForCTA = cta => {
  let response = {}
  response.title = cta.title.value
  response.linkLabel = cta.link_title.value
  response.linkUrl = cta.link_url.value
  response.body = cta.body.value
  response.summary = cta.summary.value
  response.contentBody = cta.body.value
  if (cta.image.value.length) {
    response.image = processForAsset(cta.image.value[0])
  }
  response.settings = {}
  return response
}
const processForContentColumn = item => {
  let response = {}
  response.title = item.title.value
  response.body = item.body.value
  response.columns = item.content_blocks.value.map(block => {
    return processForBlock(block)
  })
  return response
}
const processForMenuItem = menuItem => {
  let response = {}
  response.linkTitle = menuItem.link_title.value
  response.linkUrl = menuItem.link_url.value
  response.bootstrapIconClass = menuItem.bootstrapiconclass.value
  response.columns = menuItem.blocks.value.map(block => {
    return processForBlock(block)
  })
  return response
}

const processForMenu = menu => {
  let response = {}
  response.title = menu.title.value
  response.body = menu.body.value
  response.summary = menu.summary.value
  if (menu.image.value.length) {
    response.image = processForAsset(menu.image.value[0])
  }
  response.menu_items = menu.menu_items.value.map(block => {
    return processForMenuItem(block)
  })
  return response
}

const processForAuthor = author => {
  return author.name.value.length ? author.name.value : ''
}
const processForPost = post => {
  const response = {}
  response.seo = { title: post.page_title.value }
  response.postTitle = post.posttitle.value
  if (post.postimage.value.length) {
    response.postImage = processForAsset(post.postimage.value[0])
  }
  if (post.author.value.length) {
    response.authorName = processForAuthor(post.author.value[0])
  }
  response.publicationDate = post.system.lastModified
  response.postSummary = post.summary.value
  response.postContent = post.postcontent.value
  response.slug = post.slug.value
  if (post.blog_categories.value.length) {
    response.blogcategory = post.blog_categories.value.map(post => {
      return processForCatagory(post)
    })
  }
  return response
}

export { getEntryBySlug, getBlogCatagories, getBlogPostData, getBlogPosts, getEntryBySlugAndType }
