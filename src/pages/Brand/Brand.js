import { Helmet } from 'react-helmet'
import { Layout } from '../../components'
import { Listing, BrandBanner } from '../../components/'
import { useBrand } from '../../hooks'

const Brand = () => {
  const { brandResponse, slug, subHeading } = useBrand()
  return (
    <Layout>
      {brandResponse.isLoaded && brandResponse.data.length > 0 && <Helmet title={brandResponse.data[0]?.settings?.brandHTMLTitleString} />}
      <BrandBanner subHeading={subHeading} brandName={brandResponse?.data[0]?.brandName} imageFile={brandResponse?.data[0]?.imageFile} brandDescription={brandResponse?.data[0]?.brandDescription} />

      {brandResponse.isLoaded && brandResponse.data.length > 0 && (
        <Listing
          preFilter={{
            brand_slug: slug,
          }}
          hide={['brands']}
        />
      )}
    </Layout>
  )
}

export default Brand
