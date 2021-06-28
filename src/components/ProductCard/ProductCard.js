import { useDispatch, useSelector } from 'react-redux'
import { HeartButton, ProductImage, ProductPrice } from '..'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getBrandRoute, getProductRoute } from '../../selectors'
import { addToCart } from '../../actions'

const ProductCard = props => {
  const dispatch = useDispatch()
  const { productName, calculatedSalePrice, urlTitle, brand_brandName, brand_urlTitle, listPrice, imageFile, defaultSku_imageFile, productClearance, imagePath, skuID = '' } = props
  const { t } = useTranslation()
  const brand = useSelector(getBrandRoute)
  const product = useSelector(getProductRoute)
  let productLink = `/${product}/${urlTitle}` + (skuID.length ? `?skuid=${skuID}` : '')
  return (
    <div className="card">
      {productClearance === true && <span className="badge">{t('frontend.core.special')}</span>}
      <HeartButton skuID={skuID} />
      <Link className="d-block overflow-hidden" to={`/${product}/${urlTitle}?skuid=${skuID}`}>
        {/* to fix multiple image issue added ternary here */}
        {imageFile ? <ProductImage customClass="card-image-height" imageFile={imageFile} skuID={skuID} /> : imagePath ? <ProductImage customClass="card-image-height" imageFile={imagePath} skuID={skuID} customPath="/" /> : <ProductImage customClass="card-image-height" imageFile={imageFile || defaultSku_imageFile} skuID={skuID} />}
      </Link>
      <div className="card-body">
        <Link to={`/${brand}/${brand_urlTitle}`}>
          <div className="product-brand">{brand_brandName}</div>
        </Link>
        <h2>
          <Link to={productLink} className="product-name">
            {productName}
          </Link>
        </h2>
        <ProductPrice salePrice={calculatedSalePrice} listPrice={listPrice} className="d-flex" />
      </div>
      <div className="text-center add-card-footer">
        <button
          onClick={e => {
            e.preventDefault()
            dispatch(addToCart(skuID, 1))
          }}
          type="submit"
          className="btn btn-primary btn-block"
        >
          {t('frontend.product.add_to_cart')}
        </button>
      </div>
    </div>
  )
}

export { ProductCard }
