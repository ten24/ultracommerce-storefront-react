import { Layout, Listing } from '../../components'
import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router-dom'

const ProductListing = () => {
  const loc = useLocation()

  return (
    <Layout>
      <Helmet title={'Search - ' + new URLSearchParams(loc.search).get('keyword')} />
      <Listing />
    </Layout>
  )
}

export default ProductListing
