import { useHistory, useParams } from 'react-router-dom'
import { Layout, ProductTypeList, Listing, PageHeader } from '../../components'
import { Helmet } from 'react-helmet'
import { useProductType } from '../../hooks'

const ProductType = () => {
  const { id } = useParams()
  const history = useHistory()
  const { productTypeRequest, productTypeData, productTypeListRequest, crumbCalculator, productTypeRoute, isError, errorMessage } = useProductType()
  return (
    <Layout>
      {productTypeRequest.isLoaded && <Helmet title={productTypeRequest.data?.settings?.productHTMLTitleString} />}
      <PageHeader title={productTypeData?.productTypeName} crumbs={crumbCalculator()} />
      {isError && (
        <div className="container bg-light box-shadow-lg rounded-lg p-5">
          <div className="row">
            <div className="alert alert-info" role="alert">
              {errorMessage}
            </div>
          </div>
        </div>
      )}

      <ProductTypeList
        isFetching={productTypeListRequest.isFetching || !productTypeRequest.isLoaded}
        onSelect={urlTitle => {
          history.push(`/${productTypeRoute}/${urlTitle}`)
        }}
        data={productTypeData}
      />
      {productTypeData?.childProductTypes?.length === 0 && (
        <Listing preFilter={{ productType_slug: id }} hide={'productType'}>
          <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
            <h5 className="h4 text-dark mb-0 font-accent">{productTypeRequest.data.title}</h5>
          </div>
        </Listing>
      )}
    </Layout>
  )
}

export default ProductType
