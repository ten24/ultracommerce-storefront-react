import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import { axiosInstance } from './AxiosService'
import { homeSliderQuery, homePopularProduct, blogQuery, getBlogCategory, headerQuery, myAccountQuery, getPagesQuery, CategoryQuery, ProductTypeQuery, getFooterQuery } from './contentfulGraphqlQuery'
const accessToken = process.env.REACT_APP_CONTENTFUL_ACCESSTOKEN
const spaceId = process.env.REACT_APP_CONTENTFUL_SPACE_KEY

/*
becaue the params need to be generic for all cms providers you may beed to massage the 
params to meet the format pf contentful 

return the promise for the generic hook to set state
*/

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
  return axiosInstance
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
            slide.customBody = (slide.summary && documentToReactComponents(slide.summary.json)) || ''
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
                      return { ...data, postImage: data.postImage && data.postImage.url }
                    })
                  : [],
            },
          },
        }
      }
    })

    const productCategories = graphqlPostMethod(CategoryQuery).then(response => {
      if (response?.status === 200 && response.data.data) {
        return {
          'home/category': {
            customBody: {
              items:
                response.data.data.contentCollection.items.length > 0
                  ? response.data.data.contentCollection.items.map(data => {
                      return { ...data, title: data.title && data.title, customBody: data.customBody && documentToReactComponents(data.customBody.json) }
                    })
                  : [],
            },
          },
        }
      }
    })
    const productTypes = graphqlPostMethod(ProductTypeQuery).then(response => {
      if (response?.status === 200 && response.data.data) {
        return {
          'home/productType': {
            customBody: {
              items:
                response.data.data.contentCollection.items.length > 0
                  ? response.data.data.contentCollection.items.map(data => {
                      return { ...data, title: data.title && data.title, customBody: data.customBody && documentToReactComponents(data.customBody.json) }
                    })
                  : [],
            },
          },
        }
      }
    })

    const popularProducts = graphqlPostMethod(homePopularProduct).then(response => {
      if (response?.status === 200 && response.data.data) {
        const products = response.data.data.productsPickerCollection.items[0]
        return {
          'home/popularProducts': {
            customBody: { ...products, isMarkup: false },
          },
        }
      }
    })

    const result = await Promise.all([slider, popularProducts, recentBlogs, productCategories, productTypes]).then(response => {
      return response
    })
    return result
  }
  if (slug === 'header') {
    return graphqlPostMethod(headerQuery).then(response => {
      const mainNav = response.data.data.contentCollection.items[0].sectionsCollection.items
      return {
        'header/main-navigation': {
          customBody: { mainNav, isMarkup: false },
        },
      }
    })
  }
  if (slug === 'footer') {
    return graphqlPostMethod(getFooterQuery).then(response => {
      return {
        'footer/site-links': { ...response.data.data.contentCollection.items[0].sectionsCollection.items.filter(data => data.slug === 'footer/site-links')[0], settings: {}, customBody: renderDocument(response.data.data.contentCollection.items[0].sectionsCollection.items.filter(data => data.slug === 'footer/site-links')[0].customBody.json) },
        'footer/get-in-touch': { ...response.data.data.contentCollection.items[0].sectionsCollection.items.filter(data => data.slug === 'footer/get-in-touch')[0], settings: {}, customBody: renderDocument(response.data.data.contentCollection.items[0].sectionsCollection.items.filter(data => data.slug === 'footer/get-in-touch')[0].customBody.json) },
        'footer/stay-informed': { ...response.data.data.contentCollection.items[0].sectionsCollection.items.filter(data => data.slug === 'footer/stay-informed')[0], settings: {}, customBody: renderDocument(response.data.data.contentCollection.items[0].sectionsCollection.items.filter(data => data.slug === 'footer/stay-informed')[0].customBody.json) },
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
        setting: { contentTemplateFile: 'BasicPage.cfm', contentHTMLTitleString: '<p>myaccount title</p>' },
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
                setting: { contentTemplateFile: 'BasicPage.cfm', contentHTMLTitleString: '<p>myaccount title</p>' },
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
    payload[slug] = response.data.data.contentCollection.items.length
      ? response.data.data.contentCollection.items.map(data => {
          return {
            title: data?.title,
            seoDesc: data?.title,
            setting: { contentTemplateFile: 'BasicPage.cfm' }, // this needs to be a content type field on the content. this will dynamically render using the generic BasicPage Page Component.
            isMarkup: false,
            sections: data.sectionsCollection.items.map(textData => {
              return { text: documentToReactComponents(textData.summary.json), title: textData.title, imageUrl: textData.hasOwnProperty('image') ? textData.image.url : '' } //For imageUrl key we need ternary operator until its assign undefined.
            }),
          }
        })[0]
      : {}
    return payload
  })
  return pages
}

const getBlogPostData = params => {
  return graphqlPostMethod(blogQuery(`limit:1,where: {slug:"${params.slug}"}`)).then(response => {
    if (response?.status === 200 && response.data.data.blogCollection.items) {
      let responsData = response.data.data.blogCollection.items[0]
      let blogPostData = { ...responsData, postImage: responsData.postImage && responsData.postImage.url, postContent: responsData.postContent && documentToReactComponents(responsData.postContent.json) }
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
          return { ...rest, postImage: data.postImage && data.postImage.url }
        }),
      }
      return responseData
    }
  })
}

export { getEntryBySlug, getBlogCatagories, getBlogPostData, getBlogPosts }
