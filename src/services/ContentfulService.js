import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import axios from 'axios'
import ReactDOMServer from 'react-dom/server'
import { getModernHeader, blogByCategory, getModernPageData, getModernFooter, blogQuery, getBlogCategory } from './contentfulGraphqlQuery'
const accessToken = process.env.REACT_APP_CONTENTFUL_ACCESSTOKEN
const spaceId = process.env.REACT_APP_CONTENTFUL_SPACE_KEY
const getContentID = () => {
  return Math.floor(Math.random() * 100000)
}
/*
becaue the params need to be generic for all cms providers you may beed to massage the 
params to meet the format pf contentful 

return the promise for the generic hook to set state
*/

const instance = axios.create({
  timeout: 1000,
  headers: { Authorization: `Bearer ${accessToken}` },
})

const renderOptions = links => {
  if (!links) return {}
  // From here: https://www.contentful.com/blog/2021/04/14/rendering-linked-assets-entries-in-contentful/
  // create an asset map
  const assetMap = new Map()
  // loop through the assets and add them to the map
  for (const asset of links.assets.block) {
    assetMap.set(asset.sys.id, asset)
  }

  return {
    // other options...

    renderNode: {
      // other options...
      [BLOCKS.EMBEDDED_ASSET]: (node, next) => {
        // find the asset in the assetMap by ID
        const asset = assetMap.get(node.data.target.sys.id)

        // render the asset accordingly
        return <img src={asset.url} alt={asset.title} />
      },
    },
  }
}

const renderDocument = doc => {
  return <>{documentToReactComponents(doc?.json, renderOptions(doc?.links))}</>
}

const getBlogCatagories = () => {
  return graphqlPostMethod(getBlogCategory).then(response => {
    const categories = response.data.data.categoryCollection
    let hydrated = []
    if (categories.total) {
      hydrated = categories.items
        .map(cat => {
          // console.log('cat', cat)
          if (cat.linkedFrom.blogCollection.total) {
            return { name: `${cat.name} (${cat.linkedFrom.blogCollection.total})`, value: cat.name }
          }
          return null
        })
        .filter(item => item)
    }
    // console.log('hydrated', hydrated)

    return hydrated
  })
}
const graphqlPostMethod = query => {
  return instance
    .post(
      `https://graphql.contentful.com/content/v1/spaces/${spaceId}`,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then(response => response)
}

/*
This will retrive content by a specifc slug
*/
const getEntryBySlugAndType = async (content = {}, slug = '', type) => {
  if (type === 'page') return getEntryBySlug(content, slug)
  if (type === 'header') return getHeaderBySlug(content, slug)
  if (type === 'footer') return getFooterBySlug(content, slug)
}
const processForAsset = asset => {
  return {
    name: asset.title,
    url: asset.url,
  }
}
const processForSlide = slide => {
  let response = {}
  response.title = slide.title
  response.contentBody = !!slide.body ? ReactDOMServer.renderToStaticMarkup(renderDocument(slide.body)) : ''
  response.contentImage = processForAsset(slide.image)
  response.imagePath = slide.image.url
  response.linkUrl = slide.link
  response.linkLabel = slide.linkTitle
  response.contentID = getContentID()
  return response
}
const processForSlider = slider => {
  let response = {}
  response.contentTitle = slider.title
  response.contentBody = !!slider.body ? ReactDOMServer.renderToStaticMarkup(renderDocument(slider.body)) : ''
  response.contentID = getContentID()
  response.slides = slider?.slidesCollection?.items?.map(slide => {
    return processForSlide(slide)
  })
  return response
}
const processForContentColumn = item => {
  let response = {}
  response.title = item.title
  response.body = !!item.body ? ReactDOMServer.renderToStaticMarkup(renderDocument(item.body)) : ''
  response.columns = item?.columnsCollection?.items?.map(block => {
    return processForBlock(block)
  })
  return response
}
const processForCTA = cta => {
  let response = {}
  response.title = cta.title
  response.linkLabel = cta.linkTitle
  response.linkUrl = cta.linkUrl
  response.summary = !!cta.summary ? ReactDOMServer.renderToStaticMarkup(renderDocument(cta.summary)) : ''
  response.contentBody = !!cta.body ? ReactDOMServer.renderToStaticMarkup(renderDocument(cta.body)) : ''
  response.body = response.contentBody
  if (cta.image) {
    response.image = processForAsset(cta.image)
  }
  response.settings = {}
  return response
}
const processForProductPicker = productList => {
  let response = {}
  response.title = productList.title
  response.body = !!productList.body ? ReactDOMServer.renderToStaticMarkup(renderDocument(productList.body)) : ''
  response.contentBody = response.body
  response.settings = {}
  response.products = productList.products
  return response
}
const getEntryBySlug = async (content = {}, slug) => {
  return graphqlPostMethod(getModernPageData(slug)).then(response => {
    const pageData = response.data.data.ucpageCollection
    // console.log('getNewpage', pageData)
    let pageCollection = []
    if (pageData.total) {
      pageCollection = pageData.items.map(page => {
        let hydrated = {}
        if (page.slider) {
          hydrated.slider = processForSlider(page.slider)
        }
        if (page.columns) {
          hydrated.contentColumns = processForContentColumn(page.columns)
        }
        if (page.callToAction) {
          hydrated.callToAction = processForCTA(page.callToAction)
        }
        if (page.products) {
          hydrated.product = processForProductPicker(page.products)
          hydrated.productListingPageFlag = true
        }
        // Dont process the enhanced Menu again because it will be an infinate loop
        if (page.enhancedMenu) {
          hydrated.menu = processForEnhancedMenu(page.enhancedMenu)
        }
        hydrated.contentPageType = 'BasicPage'
        hydrated.permissions = { accessFlag: true, nonRestrictedFlag: true }
        hydrated.title = page.title
        hydrated.slug = page.slug
        hydrated.key = getContentID()
        hydrated.body = ReactDOMServer.renderToStaticMarkup(renderDocument(page.body))
        hydrated.contentBody = hydrated?.body
        return { [page.slug]: hydrated }
      })
    }
    // console.log(`slug ${slug}`, pageCollection)
    return pageCollection
  })
}
const processForEnhancedMenu = enhancedMenu => {
  let response = {}
  //  console.log(`enhancedMenu`, enhancedMenu)

  response.title = enhancedMenu.title
  response.body = ReactDOMServer.renderToStaticMarkup(renderDocument(enhancedMenu.body))
  //  response.contentBody = enhancedMenu?.body
  response.menuItems = enhancedMenu?.pagesCollection?.items?.map(page => {
    return {
      contentID: getContentID(),
      slug: page.slug,
      title: page.title,
    }
  })

  return response
}
const getFooterBySlug = async (content = {}, slug = '') => {
  return graphqlPostMethod(getModernFooter).then(response => {
    const footerItems = response.data.data.footerCollection

    let hydrated = {}
    if (footerItems.total) {
      const item = footerItems.items[0]
      if (item.blocksCollection.total) {
        hydrated.children = item.blocksCollection.items.map(block => {
          return processForBlock(block)
        })
      }
      hydrated.title = item.title
      hydrated.key = getContentID()
      hydrated.urlTitle = getContentID()
      hydrated.contentBody = ''
    }

    return { footer: hydrated }
  })
}
const processForBlock = block => {
  let response = {}
  response.title = block.title
  // console.log('block ', block)
  response.urlTitle = getContentID()

  response.contentBody = ReactDOMServer.renderToStaticMarkup(renderDocument(block.body))
  // response.urlTitle = block.system.codename.replaceAll('_', '-')
  // response.key = `${getContentID()}/${block.system.codename.replaceAll('_', '-')}`
  if (block.image) {
    response.image = processForAsset(block.image)
    response.imagePath = response.image.url
  }
  return response
}
const getHeaderBySlug = async (content = {}, slug = '') => {
  return graphqlPostMethod(getModernHeader).then(response => {
    const headerItems = response.data.data.headerCollection
    // console.log('getNewHeader', headerItems)

    let hydrated = {}
    if (headerItems.total) {
      const item = headerItems.items[0]
      if (item.megaMenu) {
        hydrated.mega_menu = processForMenu(item.megaMenu)
      }
      if (item.utilityMenu) {
        hydrated.utility_menu = processForMenu(item.utilityMenu)
      }
      hydrated.title = item.title
      hydrated.key = getContentID()
      hydrated.contentBody = ''
    }
    //console.log('header', hydrated)

    return { header: hydrated }
  })
}

const processForMenu = menu => {
  let response = {}
  response.title = menu.title
  response.body = !!menu.body ? ReactDOMServer.renderToStaticMarkup(renderDocument(menu.body.json)) : ''
  response.summary = !!menu.summary ? ReactDOMServer.renderToStaticMarkup(renderDocument(menu.summary.json)) : ''
  if (menu.image) {
    response.image = processForAsset(menu.image)
  }
  response.contentID = getContentID()

  response.menu_items = menu?.menuItemsCollection?.items?.map(menuItem => {
    //console.log('menuItem', menuItem)
    return processForMenuItem(menuItem)
  })
  return response
}
const processForMenuItem = menuItem => {
  let response = {}
  response.linkTitle = menuItem.title
  response.linkUrl = menuItem.linkUrl
  response.contentID = getContentID()

  response.bootstrapIconClass = menuItem.bootstrapIconClass
  response.columns = menuItem?.blocksCollection?.items?.map(block => {
    return processForBlock(block)
  })
  return response
}
const processForCatagory = cat => {
  return {
    name: cat.category,
    value: cat.slug,
  }
}
const processForPost = post => {
  const response = {}
  response.seo = { title: post.postTitle }
  response.postTitle = post.postTitle
  response.authorName = post?.authorName
  if (post.postImage) {
    response.postImage = processForAsset(post.postImage)
  }
  response.publicationDate = post.publicationDate
  response.postContent = ReactDOMServer.renderToStaticMarkup(renderDocument(post.postContent))
  response.postSummary = post.postSummary
  response.slug = post.slug
  if (post.catagoriesCollection.total) {
    response.blogcategory = post.catagoriesCollection.items.map(cat => {
      return processForCatagory(cat)
    })
  }
  return response
}
const getBlogPostData = params => {
  return graphqlPostMethod(blogQuery(`limit:1,where: {slug:"${params.slug}"}`)).then(response => {
    const blogItems = response.data.data.blogCollection
    let hydrated = {}
    if (blogItems.total) {
      const item = blogItems.items[0]
      hydrated = processForPost(item)
    }
    return hydrated
  })
}

const getBlogPosts = params => {
  if (params.category) {
    const query = blogByCategory(params.category, params.limit, params.skip)
    //  console.log('query', query)
    return graphqlPostMethod(query).then(response => {
      const categoryItems = response.data.data.categoryCollection
      let hydrated = { total: 0, items: [] }
      // console.log('categoryItems', categoryItems)
      if (categoryItems.total) {
        const cat = categoryItems.items[0]
        // console.log('cat', cat)
        if (cat.linkedFrom.blogCollection.total) {
          hydrated.total = cat.linkedFrom.blogCollection.total
          hydrated.items = cat.linkedFrom.blogCollection.items.map(blog => {
            return processForPost(blog)
          })
        }
      }
      return hydrated
    })
  } else {
    const query = blogQuery(`limit: ${params.limit ? params.limit : 0}, skip: ${params.skip ? params.skip : 0}`)
    //  console.log('query', query)
    return graphqlPostMethod(query).then(response => {
      // console.log('getBlogPosts', response)
      const blogItems = response.data.data.blogCollection
      let hydrated = { total: blogItems.total, items: [] }
      if (blogItems.total) {
        hydrated.items = blogItems.items.map(blog => {
          return processForPost(blog)
        })
      }
      return hydrated
    })
  }
}

export { getBlogCatagories, getBlogPostData, getBlogPosts, getEntryBySlugAndType }
