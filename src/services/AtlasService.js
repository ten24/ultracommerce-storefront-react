// import { useGeneralSettings } from '@wpengine/headless/react';
// import { usePost } from '@wpengine/headless/next';

/*
becaue the params need to be generic for all cms providers you may beed to massage the 
params to meet the format pf contentful 

return the promise for the generic hook to set state
*/
const getBlogCatagories = params => {
  return Promise((resolve, reject) => {
    resolve({ catagories: [] })
  })
}

/*
  This will retrive content by a specifc slug
  */
const getContentBySlug = async (content = {}, slug = '') => {
  // most pages should not need an override but the home page is often special
  if (slug === 'home') {
    const slider = await Promise((resolve, reject) => {
      resolve({
        'home/main-banner-slider': { contentBody: '', isMarkup: false },
      })
    }).then(response => {
      return response
    })

    const recentBlogs = await Promise((resolve, reject) => {
      resolve({
        'home/recentBlogPost': {
          contentBody: {
            items: [],
          },
        },
      })
    }).then(response => {
      return response
    })

    const data = await Promise.all([slider, recentBlogs]).then(response => {
      return response
    })
    return data
  }
  if (slug === 'header') {
    return Promise((resolve, reject) => {
      resolve({
        'header/main-navigation': { contentBody: '', isMarkup: false },
      })
    }).then(response => {
      return response
    })
  }
  if (slug === 'footer') {
    return Promise((resolve, reject) => {
      resolve({
        'header/main-navigation': { contentBody: '', isMarkup: false },
      })
    }).then(response => {
      return response
    })
  }

  // this will get the data for all generic pages
  return Promise((resolve, reject) => {
    resolve({
      [slug]: { contentBody: '', isMarkup: false },
    })
  }).then(response => {
    return response
  })
}

const getBlogPostData = params => {
  return Promise((resolve, reject) => {
    resolve({
      example: { contentBody: '', isMarkup: false },
    })
  }).then(response => {
    return response
  })
}

const getBlogPosts = params => {
  const { category, ...restParams } = params
  return Promise((resolve, reject) => {
    resolve({
      example: { contentBody: '', isMarkup: false },
    })
  }).then(response => {
    return response
  })
}

export { getContentBySlug, getBlogCatagories, getBlogPostData, getBlogPosts }
