import { Layout } from '../../components'
import { Listing, BrandBanner } from '../../components/'

const Brand = props => {
  const path = props.location.pathname.split('/').reverse()
  const brandFilter = {
    brand: path[0],
  }

  return (
    <Layout>
      <Listing preFilter={brandFilter} hide={'brands'}>
        <BrandBanner brandCode={path[0]} />
      </Listing>
    </Layout>
  )
}

export default Brand
