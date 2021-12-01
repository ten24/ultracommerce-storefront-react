import { useSelector } from 'react-redux'
import { ProductPrice } from '..'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getBrandRoute, getProductTypeRoute, getCategoryRoute } from '../../selectors'
import { useUtilities } from '../../hooks'

const ProductDetails = ({ sku, product }) => {
  const brand = useSelector(getBrandRoute)
  const productType = useSelector(getProductTypeRoute)
  const categoryRoute = useSelector(getCategoryRoute)
  const { eventHandlerForWSIWYG } = useUtilities()
  const { t } = useTranslation()
  
  return (
    <>
      <h1 className="fw-bold mb-3">{product.productName}</h1>

      {sku && (
        <div className="row">
          <div className="col">
            <strong className="mb-2 text-muted text-uppercase small">{`SKU: `}</strong>
            <span className="mb-2 text-muted small">{sku.skuCode}</span>
          </div>
        </div>
      )}
      
      {product.brand_brandID && (
        <div className="row">
          <div className="col">
            <strong className="mb-2 text-muted text-uppercase small">{t('frontend.product.brand')}: </strong>

            <Link className="link text-decoration-none" to={`/${brand}/${product.brand_urlTitle}`}>
              {product.brand_brandName}
            </Link>
          </div>
        </div>
      )}
      
      {product.productType_productTypeID && (
        <div className="row">
          <div className="col">
            <strong className="mb-2 text-muted text-uppercase small">{t('frontend.product.productType')}: </strong>

            <Link className="link text-decoration-none" to={`/${productType}/${product.productType_urlTitle}`}>
              {product.productType_productTypeName}
            </Link>
          </div>
        </div>
      )}
      
      {product.categories.length > 0 && (
        <div className="row">
          <div className="col category-links">
            <strong className="mb-2 text-muted text-uppercase small">{t('frontend.product.category')}: </strong>
              {product.categories.map( (category) =>
                <Link key={category.categoryID} className="link text-decoration-none" to={`/${categoryRoute}/${category.urlTitle}`}>
                {category.categoryName}
              </Link>
              )}
              
          </div>
        </div>
      )}
      

      <div className="my-4">
        <strong className="display-6">{sku && <ProductPrice salePrice={sku.salePrice} listPrice={sku.listPrice} className="d-flex" showloginRequired={true} />}</strong>
      </div>

      <div
        className="pt-1"
        onClick={eventHandlerForWSIWYG}
        dangerouslySetInnerHTML={{
          __html: product.productDescription,
        }}
      />
    </>
  )
}
export { ProductDetails }
