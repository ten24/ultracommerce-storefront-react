import { Layout, BreadCrumb } from '../../components'
import { useSelector } from 'react-redux'
import { getProductTypeRoute } from '../../selectors/configurationSelectors'
import { Link } from 'react-router-dom'
import { SWImage } from '../SWImage/SWImage'
const ProductTypeList = ({ data }) => {
  const productsRoute = useSelector(getProductTypeRoute)

  return (
    <Layout>
      {/* TODO: can be replaced with page-header? */}
      <div className="page-title-overlap bg-lightgray pt-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
            <BreadCrumb />
          </div>
          <div className="order-lg-1 pr-lg-4 text-center text-lg-left">
            <h1 className="h3 text-dark mb-0 font-accent">{data.title || ''}</h1>
          </div>
        </div>
      </div>

      <div className="container pb-4 pb-sm-5">
        {/* <!--- Product Type grid ---> */}
        <div className="row pt-5">
          {/* <!--- Product Type ---> */}
          {data.childProductTypes &&
            data.childProductTypes
              .sort((a, b) => (a.productTypeName > b.productTypeName ? 1 : -1))
              .map(({ productTypeID, productTypeName, imageFile, urlTitle, childProductTypes }) => {
                let customImagePath = ''
                let imageFileName = ''
                if (imageFile !== '') {
                  imageFileName = imageFile.split('/').reverse()[0]
                  customImagePath = imageFile.split('/').slice(0, -1).join('/') + '/'
                }

                return (
                  <div className="col-md-4 col-sm-6 mb-3" key={productTypeID}>
                    <div className="card border-0">
                      <Link className="d-block overflow-hidden rounded-lg" to={urlTitle}>
                        <SWImage className="d-block w-100" customPath={customImagePath} src={imageFileName} alt={productTypeName} type="productType" />
                      </Link>
                      <div className="card-body">
                        <h2 className="h5">
                          <Link to={urlTitle}>{productTypeName}</Link>
                        </h2>
                        <ul className="list-unstyled font-size-sm mb-0">
                          {childProductTypes.map(({ productTypeID, title, urlTitle, showProducts }, index) => {
                            urlTitle = showProducts ? `/${productsRoute}/${urlTitle}` : urlTitle

                            return (
                              <li className="d-flex align-items-center justify-content-between" key={productTypeID}>
                                <Link className="nav-link-style" to={urlTitle}>
                                  <i className="far fa-chevron-circle-right pr-2"></i>
                                  {title}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
        </div>
      </div>
    </Layout>
  )
}
export { ProductTypeList }
