const richTextQuery = `{
        json
      }`

const homeSliderQuery = `{
  contentCollection(limit: 1, where: {slug: "home-contentslider"}) {
    items {
      title
      slug
      customBody ${richTextQuery}
      sectionsCollection(limit: 9) {
        items {
          ... on ComponentHero {
            title
            slug
            summary ${richTextQuery}
            image{
              url
            }
            ctaLink {
              ... on ComponentLink {
                title
                linkUrl
              }
            }
          }
        }
      }
    }
  }
}
`

const homePopularProduct = `
{
  slatwallProductsCollection(limit: 1, where: {slug: "featured-products"}) {
    items {
      title
      products
    }
  }
}`

const blogQuery = params => {
  let query = `{
  blogCollection(${params}) {
    items {
      postTitle,
      postImage {
        url
      },
      publicationDate,
      postUrl,
      slug,
      postSummary,
      postContent ${richTextQuery},
      blogcategory {
        ... on Category {
          category
        }
      },
      authorName
    }
    total
  }
}`
  return query
}

const getBlogCategory = `
{
  categoryCollection {
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

const myAccountQuery = `{
  contentCollection(limit:1,	where: {slug: "my-account"}) {
    items {
      title
      customBody ${richTextQuery}
      sectionsCollection{
        items {
          ... on Content {
            title
            slug
            customBody ${richTextQuery}
            sectionsCollection{
              items {
                ... on ComponentLink {
                  title
                  displayInNavigation
                  linkUrl
                  bootstrapIconClass
                }
              }
            }
          }
        }
      }
    }
  }
}`

const headerQuery = `{
  contentCollection(limit: 1, where: {slug: "header-main"}) {
    items {
      sectionsCollection {
        items {
          ... on ComponentLink {
            title
            linkUrl
            displayInNavigation
            bootstrapIconClass
          }
        }
      }
    }
  }
}
`

const getPagesQuery = params => {
  let slug = `"${params}"`
  const pageQuery = `{
  contentCollection(limit: 1, where: {slug: ${slug}}) {
    items {
      title
      seoDesc
      customBody {
        json
      }
      sectionsCollection {
        items {
          ... on SlatwallProducts {
            products
            title
          }
          ... on ComponentLink {
            title
            linkUrl
            displayInNavigation
            bootstrapIconClass
          }
          ... on ComponentText {
            title
          }
          ... on ComponentHero {
            title
            slug 
            summary ${richTextQuery}
            image {
              url
            }
            ctaLink {
              ... on ComponentLink {
                title
                linkUrl
              }
            }
          }
        }
      }
    }
  }
}`
  return pageQuery
}

const CategoryQuery = `{
   contentCollection(limit: 1, where: {slug: "categories"}) {
    items {
      title
      associatedImage{
        url
      }
      customBody ${richTextQuery}
    }
  }
  }`
const ProductTypeQuery = `{
   contentCollection(limit: 1, where: {slug: "product-types"}) {
    items {
      title
      associatedImage{
        url
      }
      customBody ${richTextQuery}
    }
  }
  }`

const getFooterQuery = `{
  contentCollection(limit: 1, where: {slug: "footer"}) {
    items {
      title
      sectionsCollection {
        items {
          ... on Content {
            title
            slug
            customBody  ${richTextQuery}
          }
        }
      }
    }
  }
}`

export { homeSliderQuery, homePopularProduct, blogQuery, getBlogCategory, headerQuery, myAccountQuery, getPagesQuery, CategoryQuery, ProductTypeQuery, getFooterQuery }
