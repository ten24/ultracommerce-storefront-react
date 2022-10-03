import { useSelector } from 'react-redux'
import { ProductPrice, ProductReviewRating } from '..'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getBrandRoute, getProductTypeRoute, getCategoryRoute } from '../../selectors'
import { useReview, useUtilities } from '../../hooks'

const ProductDetailHeading = ({ sku, product, total, averageRating }) => {
  const brand = useSelector(getBrandRoute)
  const productType = useSelector(getProductTypeRoute)
  const categoryRoute = useSelector(getCategoryRoute)
  const { t } = useTranslation()
  return (
    <>
      {!!product.brand_brandName?.trim()?.length && (
        <div className="row">
          <div className="col">
            <strong className="mb-2 text-muted text-uppercase small">{t('frontend.product.brand')}: </strong>

            <Link className="link text-decoration-none" to={`/${brand}/${product.brand_urlTitle}`}>
              {product.brand_brandName}
            </Link>
          </div>
        </div>
      )}

      {!!product.productType_productTypeID?.trim()?.length && (
        <div className="row">
          <div className="col">
            <strong className="mb-2 text-muted text-uppercase small">{t('frontend.product.productType')}: </strong>

            <Link className="link text-decoration-none" to={`/${productType}/${product.productType_urlTitle}`}>
              {product.productType_productTypeName}
            </Link>
          </div>
        </div>
      )}

      {!!product.categories?.length && (
        <div className="row">
          <div className="col category-links">
            <strong className="mb-2 text-muted text-uppercase small">{t('frontend.product.category')}: </strong>
            {product.categories.map(category => (
              <Link key={category.categoryID} className="link text-decoration-none" to={`/${categoryRoute}/${category.urlTitle}`}>
                {category.categoryName}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

const ProductDetails = ({ sku, product }) => {
  const { eventHandlerForWSIWYG } = useUtilities()
  const { t } = useTranslation()
  const { total, averageRating } = useReview(product.urlTitle)
  return (
    <>
      <h1 className="fw-bold mb-3">{product.productName}</h1>

      <ProductDetailHeading product={product} />

      {total > 0 && (
        <>
          <ProductReviewRating total={averageRating} />
          <a href="#productReviews" className="text-decoration-underline">
            {total + ' ' + t('frontend.product.review.totalReviewTitle')}
          </a>
        </>
      )}

      <div className="my-4">
        <strong className="display-6">{sku && <ProductPrice salePrice={sku.salePrice} listPrice={sku.listPrice} className="d-flex" ShowPriceForUserType={sku?.settings?.skuShowPriceForUserType} />}</strong>
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
export { ProductDetails, ProductDetailHeading }
