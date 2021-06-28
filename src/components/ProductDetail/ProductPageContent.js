import { useState } from 'react'
import { addToCart } from '../../actions/'
import { useDispatch, useSelector } from 'react-redux'
import { ProductDetailGallery, ProductPagePanels, SkuOptions, HeartButton, ProductPrice } from '..'
import { useTranslation } from 'react-i18next'
import { isAuthenticated } from '../../utils'
import { Link } from 'react-router-dom'
import { getBrandRoute, getProductTypeRoute } from '../../selectors'

const ProductPageContent = ({ product, attributeSets, skuID, sku, productOptions = [], availableSkuOptions = '', isFetching = false }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const cart = useSelector(state => state.cart)
  const [quantity, setQuantity] = useState(1)
  const brand = useSelector(getBrandRoute)
  const productTypeRoute = useSelector(getProductTypeRoute)
  return (
    <div className="container">
      <div className="container px-4 py-3 my-4">
        <div className="row">
          <ProductDetailGallery productID={product.productID} skuID={skuID} />
          {/* <!-- Product details--> */}
          <div className="col-sm-6 col-md-8">
            <h1 className="h3">{product.productName}</h1>
            {skuID && <HeartButton skuID={skuID} className={'btn-wishlist mr-0'} />}
            <span className="mb-2 text-muted text-uppercase small">{`SKU: `}</span>
            {sku && <span className="mb-2 text-muted text-uppercase small">{sku.skuCode}</span>}
            <div
              className="pt-1"
              dangerouslySetInnerHTML={{
                __html: product.productDescription,
              }}
            />
            {product.brand_urlTitle && (
              <div className="d-flex flex-row pt-2">
                <strong className="pl-0 w-25">{t('frontend.product.brand')}</strong>
                <Link className="link" to={`/${brand}/${product.brand_urlTitle}`}>
                  {product.brand_brandName}
                </Link>
              </div>
            )}
            {sku && sku.product_productType_productTypeName && (
              <div className="d-flex flex-row pt-2">
                <strong className="pl-0 w-25">{t('frontend.product.productType')}</strong>
                <Link className="link" to={`/${productTypeRoute}/${sku.product_productType_productTypeName}`}>
                  {sku.product_productType_productTypeName}
                </Link>
              </div>
            )}
            {product.categories.length && (
              <div className="d-flex flex-row pt-2">
                <strong className="pl-0 w-25">{t('frontend.product.category')}</strong>
                {product.categories.map(({ urlTitle, categoryID, categoryName }) => {
                  return (
                    <div key={categoryID}>
                      <Link className="link" to={`/search?category=${urlTitle}`}>
                        {categoryName},
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
            <hr />
            {productOptions.length > 0 && !isFetching && <SkuOptions productID={product.productID} skuOptionDetails={productOptions} availableSkuOptions={availableSkuOptions} sku={sku} skuID={skuID} />}
            <div className="pt-3">
              <strong>{sku && <ProductPrice salePrice={sku.skuPrices_price} listPrice={sku.skuPrices_listPrice} className="d-flex" />}</strong>
            </div>
            {/* We hide the quantity and add to cart button if the calculatedQATS is 0 */}
            {sku && sku.calculatedQATS > 0 && (
              <form
                className="mb-grid-gutter"
                onSubmit={event => {
                  event.preventDefault()
                  dispatch(addToCart(sku.skuID, quantity))
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }}
              >
                <div className="pl-0 pb-0 w-25 pb-1">{t('frontend.core.quantity')}</div>
                <div className="form-group d-flex  mb-3">
                  <div className="number-input d-flex align-items-center p-2">
                    <select
                      value={quantity}
                      onChange={event => {
                        setQuantity(event.target.value)
                      }}
                      className="custom-select"
                      style={{ height: '2rem', width: '5rem' }}
                    >
                      {[...Array(sku.calculatedQATS > 20 ? 20 : sku.calculatedQATS).keys()].map((value, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                    <button disabled={cart.isFetching || !skuID} type="submit" className="btn btn-primary btn-block mx-3 waves-effect waves-light">
                      {t('frontend.product.add_to_cart')}
                    </button>
                    {cart.isFetching && !cart.hasErrors && <div className="alert alert-success p-2 my-2">{t('frontend.product.itemAddedCart')}</div>}
                  </div>
                </div>
                {!isAuthenticated() && (
                  <div className="alert alert-warning d-flex flex-column" role="alert">
                    {t('frontend.pdp.loginToView')} <Link to={`/my-account`}>{t('frontend.account.login')}</Link>
                  </div>
                )}
              </form>
            )}
            <ProductPagePanels product={product} attributeSets={attributeSets} />
          </div>
        </div>
      </div>
      <hr />
      <div className="product-info my-5">
        <h2 className="h4">{t('frontend.product.additionalInformation')}</h2>
        <div
          className="pt-1"
          dangerouslySetInnerHTML={{
            __html: product.productDescription,
          }}
        />
      </div>
    </div>
  )
}

export { ProductPageContent }
