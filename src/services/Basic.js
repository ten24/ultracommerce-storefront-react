/*
This will retrive content by a specifc slug
*/
const getEntryBySlug = async (content = {}, slug = '') => {
  return {}
}

/*
This will retrive cheader content
*/
const getHeaderBySlug = async (content = {}, slug = '') => {
  return {}
}
/*
This will retrive footer content
*/
const getFooterBySlug = async (content = {}, slug = '') => {
  return {}
}
/*
This will retrive content by a specifc slug
*/
const getEntryBySlugAndType = async (content = {}, slug = '', type = 'page') => {
  if (type === 'page') return getEntryBySlug(content, slug)
  if (type === 'header') return getHeaderBySlug(content, slug)
  if (type === 'footer') return getFooterBySlug(content, slug)
}

/*
This will retrive Blog Category List
*/
const getBlogCatagories = () => {
  return {}
}
/*
This will retrive a single blog post
*/
const getBlogPostData = ({ slug }) => {
  return {}
}
/*
This will retrive a list if blog posts
*/
const getBlogPosts = ({ limit = 12, skip = 0, category = [] }) => {
  return {}
}

/*
Below are the process methods for converting CMS data type to Storefront data type
Assuming you use the same content types and structure
 */
const processForCatagory = ({ codename, name }) => {
  return {
    name,
    value: codename,
  }
}
const processForAsset = asset => {
  return {
    name: asset.name,
    url: asset.url,
  }
}
const processForSlide = slide => {
  let response = {}
  response.contentTitle = slide.contenttitle.value
  response.contentBody = slide.contentbody.value
  response.contentImage = processForAsset(slide.contentimage.value?.at(0))
  response.contentLink = slide.contentlink.value
  response.contentLinkTitle = slide.contentlinktitle.value
  return response
}
const processForSlider = slider => {
  let response = {}
  response.contentTitle = slider.contenttitle.value
  response.contentTitle = slider.contentbody.value
  response.slides = slider.slider.value.map(slide => {
    return processForSlide(slide)
  })
  return response
}
const processForBlock = block => {
  let response = {}
  response.title = block.title.value
  response.title_link = block.title_link.value
  response.body = block.body.value
  response.contentBody = block.body.value
  response.key = block.system.codename.replaceAll('_', '-')
  response.settings = {}
  if (block.image.value.length) {
    response.image = processForAsset(block.image.value?.at(0))
  }
  return response
}
const processForCTA = cta => {
  let response = {}
  response.title = cta.title.value
  response.linkTitle = cta.link_title.value
  response.linkUrl = cta.link_url.value
  response.body = cta.body.value
  response.summary = cta.summary.value
  response.contentBody = cta.body.value
  if (cta.image.value.length) {
    response.image = processForAsset(cta.image.value?.at(0))
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
    response.image = processForAsset(menu.image.value?.at(0))
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
    response.postImage = processForAsset(post.postimage.value?.at(0))
  }
  if (post.author.value.length) {
    response.authorName = processForAuthor(post.author.value?.at(0))
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
