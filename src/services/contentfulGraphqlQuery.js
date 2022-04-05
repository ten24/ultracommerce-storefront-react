const richTextQuery = `{
        json
        links{
          assets{
            block{
              sys {
                id
              }
              __typename
              title
              url
            }
          }
        }
      }`

const blogQuery = params => {
  let query = `{
  blogCollection(${params}) {
    items {
      authorName,
      postTitle,
      postImage {
        title
        url
      },
      publicationDate,
      postUrl,
      slug,
      postSummary,
      postContent ${richTextQuery},
      catagoriesCollection(limit: 10){
        total
        items{
          category
          slug
        }
      }
    }
    total
  }
}`
  return query
}

const blogByCategory = (slug, limit = 10, skip = 0) => `
{
  # add your query
  categoryCollection(limit: 1, where: { category: "${slug}" }) {
    total
    items {
      category
      linkedFrom {
        blogCollection(limit: ${limit}, skip: ${skip}) {
          items {
            authorName
            postTitle
            postImage {
              title
              url
            }
            publicationDate
            postUrl
            slug
            postSummary
            postContent {
              json
              links {
                assets {
                  block {
                  
                    __typename
                    title
                    url
                  }
                }
              }
            }
            catagoriesCollection(limit: 4) {
              total
              items {
                category
                slug
              }
            }
          }
          total
        }
      }
    }
  }
}`

const getBlogCategory = `
{
  categoryCollection {
    total
    items {
      linkedFrom {
        blogCollection {
          total
        }
      }
      name: category
    }
  }
}`

const getModernPageData = slug => `{ 
  ucpageCollection(where: { slug_contains: "${slug}" }) {
    total
    items {
      sys {
        id
      }
      title
      slug
       body {
         json
       }
       enhancedMenu{
        title
        body{
          json
        }
        pagesCollection(limit:10){
          total
          items{
            title
            slug
             body{
               json
             }
          }
        }
      }
      callToAction{
        title
         body{
           json
         }
         summary{
           json
         }
        linkTitle
        linkUrl
        image{
          title
          url
        }
      }
      slider {
        title
        body {
          json
        }
        slidesCollection(limit: 10) {
          total
          items {
            title
            body{
              json
            }
            link
            linkTitle
            image {
              title
              url
            }
          }
        }
      }
      products{
        title
        products
      }
      columns{
        title
         body{
           json
         }
        link
        linkUrl
        columnsCollection(limit:10){
          items{
            title
             body{
               json
             }
            link
          
             summary{
               json
             }
            image{
              title
              url
            }
          }
        }
      }
    }
    # add the fields you want to query
  }
}`

const getModernHeader = `{
  headerCollection(limit: 1){
    total
    items{
      title
      utilityMenu{
         title
        summary{
          json
        }
        body{
          json
        }
        image{
          title
          url
        }
        menuItemsCollection(limit: 10){
          total
          items{
            title
            linkUrl
            bootstrapIconClass
            blocksCollection(limit: 10){
              total
              items{
                title
                body{
                  json
                }
                linkUrl
                image{
                  title
                  url
                }
              }
            }
          }
        }
      }
      megaMenu{
        title
        summary{
          json
        }
        body{
          json
        }
        image{
          title
          url
        }
        menuItemsCollection(limit: 10){
          total
          items{
            title
            linkUrl
            bootstrapIconClass
            blocksCollection(limit: 10){
              total
              items{
                title
                body{
                  json
                }
                linkUrl
                image{
                  title
                  url
                }
              }
            }
          }
        }
      }
    }
  }
}`
const getModernFooter = `{
  footerCollection(limit:1){
    total
    items{
      title
      body{
        json
      }
      blocksCollection(limit:10){
        total
        items{
          title
          body{
            json
            links{
              assets{
                block{
                  sys {
                    id
                  }
                  __typename
                  title
                  url
                }
              }
            }
          }
          linkUrl
          image{
            title
            url
          }
        }
      }
    }
  }
}`
export { blogByCategory, getModernFooter, getModernHeader, getModernPageData, blogQuery, getBlogCategory }
