import { useSelector } from 'react-redux'
import { HeartButton, ProductImage, ProductPrice, Button } from '..'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getBrandRoute, getProductRoute } from '../../selectors'
import { useAddToCart } from '../../hooks/useAPI'

const ProductCard = props => {
  const { productName, productCode, salePrice, urlTitle, brandName, brandUrlTitle, imageFallbackFileName = '', listPrice, imageFile, productClearance, imagePath, skuID = '', skuCode } = props
  const { t } = useTranslation()
  const brand = useSelector(getBrandRoute)
  const product = useSelector(getProductRoute)
  const productLink = `/${product}/${urlTitle}` + (skuID.length ? `?skuid=${skuID}` : '')
  const [request, setRequest] = useAddToCart(skuID)
  return (
    <div className="card border-0 p-3">
      {productClearance === true && <span className="badge">{t('frontend.core.special')}</span>}
      <HeartButton skuID={skuID} />
      <Link to={`/${product}/${urlTitle}?skuid=${skuID}`}>
        {imageFile && <ProductImage customClass="img-fluid card-image-height" imageFile={imageFile} skuID={skuID} fallbackFileName={imageFallbackFileName} />}
        {imagePath && <ProductImage customClass="card-image-height" imageFile={imagePath} skuID={skuID} customPath="/" fallbackFileName={imageFallbackFileName} />}
      </Link>
      <div className="card-body">
        <Link to={`/${brand}/${brandUrlTitle}`} className="text-capitalize mb-3" style={{ fontSize: 12 }}>
          {brandName}
        </Link>
        <h2>
          <Link to={productLink} className="product-name">
            {productName}
          </Link>
        </h2>
        {!skuCode && productCode && <div className="product-brand">{productCode}</div>}
        {skuCode && <div className="product-brand">{skuCode}</div>}


        <ProductPrice salePrice={salePrice} listPrice={listPrice} className="d-flex" />
      </div>
      <div className="text-center card-footer border-0 bg-transparent">
        <Button disabled={request.isFetching} isLoading={request.isFetching} className="btn btn-primary btn-block my-3" label={t('frontend.product.add_to_cart')} onClick={() => setRequest({ makeRequest: true, isFetching: true })} />
      </div>
    </div>
  )
}

export { ProductCard }
