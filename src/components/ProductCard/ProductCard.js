import { useSelector } from 'react-redux'
import { HeartButton, SimpleImage, ProductPrice, Button, ProductImage } from '..'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getBrandRoute, getProductRoute } from '../../selectors'
import { useAddToCart } from '../../hooks/useAPI'

const ProductCard = props => {
  const { productName, productCode, salePrice, urlTitle, brandName, imagePath, imageFile, brandUrlTitle, listPrice, images, productClearance, skuID = '', skuCode } = props
  const { t } = useTranslation()
  const brand = useSelector(getBrandRoute)
  const product = useSelector(getProductRoute)
  const productLink = `/${product}/${urlTitle}` + (skuID.length ? `?skuid=${skuID}` : '')
  const [request, setRequest] = useAddToCart(skuID)
  const useResizedImage = images && images?.length > 0

  return (
    <div className="card p-3 pt-2 h-100">
      {productClearance === true && <span className="badge">{t('frontend.core.special')}</span>}
      <HeartButton skuID={skuID} />
      <Link to={`/${product}/${urlTitle}?skuid=${skuID}`}>
        {useResizedImage && <SimpleImage className="img-fluid card-image-height productImage" src={images[0]} alt={productName} type="product" />}
        {!useResizedImage && imagePath && <ProductImage customClass="img-fluid card-image-height" imageFile={imagePath} skuID={skuID} customPath="/" />}
        {!useResizedImage && imageFile && <ProductImage customClass="img-fluid card-image-height" imageFile={imageFile} skuID={skuID} />}
      </Link>
      <div className="card-body">
        <Link to={`/${brand}/${brandUrlTitle}`} className="text-capitalize mb-3" style={{ fontSize: 12 }}>
          {brandName}
        </Link>
        <h2>
          <Link to={productLink} className="product-name d-inline-block w-100">
            {productName}
          </Link>
        </h2>
        {!skuCode && productCode && <div className="product-brand">{productCode}</div>}
        {skuCode && <div className="product-brand">{skuCode}</div>}

        <ProductPrice salePrice={salePrice} listPrice={listPrice} className="d-flex" />
      </div>
      <div className="text-center card-footer border-0 bg-transparent pb-3 pt-0">
        <Button disabled={request.isFetching} isLoading={request.isFetching} className="btn btn-primary btn-block my-3" label={t('frontend.product.add_to_cart')} onClick={() => setRequest({ makeRequest: true, isFetching: true })} />
      </div>
    </div>
  )
}

export { ProductCard }
