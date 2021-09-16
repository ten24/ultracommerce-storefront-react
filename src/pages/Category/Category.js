import { Layout, Listing } from '../../components'

const Category = props => {
  const path = props.location.pathname.split('/').reverse()

  return (
    <Layout>
      <Listing
        preFilter={{
          category: path[0],
        }}
        hide={'category'}
      />
    </Layout>
  )
}

export default Category
