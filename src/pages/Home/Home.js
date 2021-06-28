import React from 'react'
import { useSelector } from 'react-redux'
import { ContentSlider, ProductSlider, BrandSlider, ContentColumns, Layout, LatestNews, ContentBlock } from '../../components'
import { useTranslation } from 'react-i18next'

function Home() {
  const content = useSelector(state => state.content)
  const popularProducts = content['home/popularProducts'] ? content['home/popularProducts'].customBody : ''
  const productCategories = content['home/category'] ? content['home/category'].customBody : ''
  const productTypes = content['home/productType'] ? content['home/productType'].customBody : ''
  const latestBlogPost = content['home/recentBlogPost'] ? content['home/recentBlogPost'].customBody : ''
  const { t } = useTranslation()
  return (
    <Layout>
      <ContentSlider />
      <section className="content-spacer">
        <ProductSlider
          title={popularProducts?.title || t('frontend.home.featured.heading')}
          params={{
            'f:publishedFlag': 1,
            'f:productCode:in': popularProducts?.products.map(data => data).join(','),
          }}
        />
      </section>
      <section className="mb-5">
        {(productCategories || productTypes) && (
          <ContentColumns title={t('frontend.home.shopby_category')}>
            <div className="row justify-content-center">
              {productCategories && (
                <div className="col-md-4">
                  <ContentBlock list={productCategories} title={t('frontend.home.browse_category')} />
                </div>
              )}
              {productTypes && (
                <div className="col-md-4">
                  <ContentBlock list={productTypes} title={t('frontend.home.browse_productTypes')} />
                </div>
              )}
            </div>
          </ContentColumns>
        )}
      </section>
      <section className="content-spacer bg-light-blue">
        <BrandSlider params={{ 'f:brandFeatured': 1 }} />
      </section>
      {latestBlogPost && (
        <section className="content-spacer">
          <LatestNews list={latestBlogPost} />
        </section>
      )}
    </Layout>
  )
}

export default Home
