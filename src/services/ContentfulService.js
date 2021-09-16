import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import axios from 'axios'
import ReactDOMServer from 'react-dom/server'
import { homeSliderQuery, homePopularProduct, blogQuery, getBlogCategory, headerQuery, myAccountQuery, getPagesQuery, CategoryQuery, ProductTypeQuery, getFooterQuery } from './contentfulGraphqlQuery'
const accessToken = process.env.REACT_APP_CONTENTFUL_ACCESSTOKEN
const spaceId = process.env.REACT_APP_CONTENTFUL_SPACE_KEY

/*
becaue the params need to be generic for all cms providers you may beed to massage the 
params to meet the format pf contentful 

return the promise for the generic hook to set state
*/

const instance = axios.create({
  timeout: 1000,
  headers: { Authorization: `Bearer ${accessToken}` },
})

const renderDocument = document => {
  const Text = ({ children }) => <p>{children}</p>
  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
    },
    renderText: text => text.split('\n').flatMap((text, i) => [i > 0 && <br />, text]),
  }

  return documentToReactComponents(document, options)
}

const getBlogCatagories = () => {
  return graphqlPostMethod(getBlogCategory).then(response => {
    if (response?.status === 200 && response.data.data) {
      let categories =
        response.data.data.categoryCollection.items.length > 0 &&
        response.data.data.categoryCollection.items.map(values => {
          return { name: `${values.name} (${values.linkedFrom.blogCollection.total})`, value: values.name }
        })
      return categories
    }
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
const getEntryBySlug = async (content = {}, slug = '') => {
  // most pages should not need an override but the home page is often special
  if (slug === 'home') {
    const slider = graphqlPostMethod(homeSliderQuery).then(response => {
      if (response?.status === 200 && response.data.data) {
        let banners = response.data.data.contentCollection.items[0].sectionsCollection.items
        banners = banners
          .map(slide => {
            slide.key = slide.slug
            slide.customBody = (slide.summary && ReactDOMServer.renderToStaticMarkup(documentToReactComponents(slide.summary.json))) || ''
            slide.associatedImage = slide.image.url
            slide.linkUrl = slide.ctaLink.linkUrl
            slide.linkLabel = slide.title
            return slide
          })
          .reduce((acc, current) => {
            acc[`home/main-banner-slider/${current.key}`] = current
            return acc
          }, {})
        return banners
      }
    })

    const recentBlogs = graphqlPostMethod(blogQuery(`limit: 3, skip: 0`)).then(response => {
      if (response?.status === 200 && response.data.data) {
        return {
          'home/recentBlogPost': {
            customBody: {
              items:
                response.data.data.blogCollection.items.length > 0
                  ? response.data.data.blogCollection.items.map(data => {
                      return { ...data, postImage: data?.postImage?.url }
                    })
                  : [],
            },
          },
        }
      }
    })

    const productCategories = graphqlPostMethod(CategoryQuery).then(response => {
      if (response?.status === 200 && response?.data?.data?.contentCollection?.items?.length) {
        const item = response.data.data.contentCollection.items[0]
        return {
          'home/category': {
            title: item.title,
            associatedImage: item.associatedImage.url,
            customBody: documentToReactComponents(item.customBody.json).reduce((acc, current) => {
              acc += ReactDOMServer.renderToStaticMarkup(current)
              return acc
            }, ''),
          },
        }
      }
    })
    const productTypes = graphqlPostMethod(ProductTypeQuery).then(response => {
      if (response?.status === 200 && response?.data?.data?.contentCollection?.items?.length) {
        const item = response.data.data.contentCollection.items[0]
        return {
          'home/producttype': {
            title: item.title,
            associatedImage: item.associatedImage.url,
            customBody: documentToReactComponents(item.customBody.json).reduce((acc, current) => {
              acc += ReactDOMServer.renderToStaticMarkup(current)
              return acc
            }, ''),
          },
        }
      }
    })

    const popularProducts = graphqlPostMethod(homePopularProduct).then(response => {
      if (response?.status === 200 && response.data.data) {
        const products = response.data.data.slatwallProductsCollection.items[0]
        return {
          'home/popularProducts': {
            title: products.title,
            products: products.products,
          },
        }
      }
    })

    const result = await Promise.all([slider, popularProducts, recentBlogs, productCategories, productTypes]).then(response => {
      const col = { 'home/content-columns': { title: 'Shop by Category or Product Type', body: '', columns: [] } }
      response.forEach(item => {
        if (item['home/category']) {
          col['home/content-columns'].columns.push(item['home/category'])
        }
        if (item['home/producttype']) {
          col['home/content-columns'].columns.push(item['home/producttype'])
        }
      })
      response.push(col)
      return response
    })
    return result
  }
  if (slug === 'header') {
    return graphqlPostMethod(headerQuery).then(response => {
      const mainNav = response.data.data.contentCollection.items[0].sectionsCollection.items.map(({ bootstrapIconClass, linkUrl, title }) => {
        return {
          linkTitle: title,
          linkUrl,
          bootstrapIconClass,
        }
      })
      return {
        header: {
          utility_menu: { menu_items: mainNav },
        },
      }
    })
  }
  if (slug === 'footer') {
    return graphqlPostMethod(getFooterQuery).then(response => {
      const newFooter = response.data.data.contentCollection.items[0].sectionsCollection.items.map(footerItem => {
        return { title: '', settings: {}, urlTitle: footerItem?.slug?.replace('footer/', ''), customBody: ReactDOMServer.renderToStaticMarkup(renderDocument(footerItem.customBody.json)) }
      })
      return {
        footer: { children: newFooter },
      }
    })
  }

  if (slug === 'my-account') {
    return graphqlPostMethod(myAccountQuery).then(response => {
      const myAccountPageContent = response.data.data.contentCollection.items[0].sectionsCollection.items
      // my account parent page, it only have my account page title and custom summary and custom body of my account page so it stored with 'my-account' key.
      let myAccountContent = {
        title: response.data.data.contentCollection.items[0].title && response.data.data.contentCollection.items[0].title,
        customBody: response.data.data.contentCollection.items[0].customBody && documentToReactComponents(response.data.data.contentCollection.items[0].customBody.json),
        isMarkup: false,
        settings: { contentTemplateFile: 'BasicPage.cfm', contentHTMLTitleString: '<p>myaccount title</p>' },
      }
      // sub components/pages of myaccount page, we have shown the sidebar of myaccount page using the myAccountSideBarMenu if number of pages comes it shows dynamically in myaccount side bar.
      let myAccountSideBarMenu = {}
      myAccountPageContent.length &&
        myAccountPageContent
          .filter(({ sectionsCollection }) => sectionsCollection.items[0].displayInNavigation)
          .map(({ sectionsCollection, title, customBody }) => {
            myAccountSideBarMenu = {
              ...myAccountSideBarMenu,
              [sectionsCollection.items[0].linkUrl]: {
                settings: { contentTemplateFile: 'BasicPage.cfm', contentHTMLTitleString: '<p>myaccount title</p>' },
                displayInNavigation: sectionsCollection.items[0].displayInNavigation ? '1' : '0',
                urlTitlePath: sectionsCollection.items[0].linkUrl,
                urlTitle: sectionsCollection.items[0].title,
                title: title,
                contentID: title,
                isMarkup: false,
                customBody: customBody && documentToReactComponents(customBody.json),
              },
            }
            return myAccountSideBarMenu
          })
      return {
        'my-account': myAccountContent,
        ...myAccountSideBarMenu,
      }
    })
  }

  // this will get the data for all generic pages
  const pages = graphqlPostMethod(getPagesQuery(slug)).then(response => {
    let payload = {}
    payload[slug] = {}
    const items = response.data.data.contentCollection.items
    //  console.log('items', items)
    if (items.length) {
      const page = items[0].sectionsCollection
      if (items[0].title) {
        payload[slug].title = items[0].title
      }
      if (items[0].seoDesc) {
        payload[slug].seoDesc = items[0].seoDesc
      }
      if (items[0].customBody) {
        payload[slug].customBody = ReactDOMServer.renderToStaticMarkup(documentToReactComponents(items[0].customBody.json))
      }
      if (page.items.length) {
        page.items.forEach(item => {
          if (item.products) {
            payload[slug].productListingPageFlag = true
            payload[slug].product = { products: item.products }
          }
          // if (item.summary) {
          //   payload[slug].text = { products: item.products }
          // }
        })
      }

      payload[slug].settings = { contentTemplateFile: 'BasicPage.cfm' } // this needs to be a content type field on the content. this will dynamically render using the generic BasicPage Page Component.
    } else {
      payload[slug] = false
    }
    return payload
  })
  return pages
}

const getBlogPostData = params => {
  return graphqlPostMethod(blogQuery(`limit:1,where: {slug:"${params.slug}"}`)).then(response => {
    if (response?.status === 200 && response.data.data.blogCollection.items) {
      let responsData = response.data.data.blogCollection.items[0]
      if (responsData?.blogcategory?.category) {
        responsData.blogcategory = [{ name: responsData.blogcategory.category, value: responsData.blogcategory.category }]
      }
      let blogPostData = { ...responsData, postImage: responsData?.postImage, postContent: responsData.postContent && ReactDOMServer.renderToStaticMarkup(documentToReactComponents(responsData.postContent.json)) }
      return blogPostData
    }
  })
}

const getBlogPosts = params => {
  let category = `{}`
  if (params.category) {
    category = `{category:"${params.category}"}`
  }
  return graphqlPostMethod(blogQuery(`limit: ${params.limit ? params.limit : 0}, skip: ${params.skip ? params.skip : 0}, where:{blogcategory:${category}}`)).then(response => {
    if (response?.status === 200 && response.data.data) {
      let items = response.data.data.blogCollection.items.map(data => data).sort()
      let responseData = {
        total: response.data.data.blogCollection.total,
        items: items.map(data => {
          const { postContent, ...rest } = data
          return { ...rest, postImage: data.postImage }
        }),
      }
      return responseData
    }
  })
}

export { getEntryBySlug, getBlogCatagories, getBlogPostData, getBlogPosts }
