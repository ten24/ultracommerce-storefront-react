import { useDispatch, useSelector } from 'react-redux'
import { HeartButton, ProductModal, SimpleImage, ProductPrice, Button, ProductImage, ProductQuantityInput, ProductOutOfStock, validateProductOutOfStock } from '..'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getBrandRoute, getProductRoute } from '../../selectors'
import { addToCart } from '../../actions'
import { useState } from 'react'
import { isAuthenticated } from '../../utils'

const SkuCard = props => {
  const { productName, productCode, salePrice, urlTitle, brandName, imagePath, imageFile, brandUrlTitle, listPrice, images, productClearance, skuID = '', skuCode, settings, showInput = false, showInputLabel = false, product_defaultSku_calculatedImageExists, calculatedImageExists, product_defaultSku_imageFile } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isFetching, setFetching] = useState(false)
  const [itemCount, setItemCount] = useState(1)
  const brand = useSelector(getBrandRoute)
  const product = useSelector(getProductRoute)
  const productLink = `/${product}/${urlTitle}` + (skuID.length ? `?skuid=${skuID}` : '')
  const useResizedImage = images && images?.length > 0
  const authenticationRequiredForAddToCart = !!settings?.skuRequireLoginToAddToCart ? !isAuthenticated() : false
  const isProductOutOfStock = !isFetching && validateProductOutOfStock(props)
  let imageFilePath = imageFile

  if (calculatedImageExists === true) {
    imageFilePath = imageFile
  } else if (product_defaultSku_calculatedImageExists === true) {
    //fallback to default sku image
    imageFilePath = product_defaultSku_imageFile
  } else {
    imageFilePath = imageFile
  } 
  return (
    <div className="card skuCard p-3 pt-2 h-100">
      {productClearance === true && <span className="badge">{t('frontend.core.special')}</span>}
      <HeartButton skuID={skuID} />
      <Link to={`/${product}/${urlTitle}?skuid=${skuID}`}>
        {useResizedImage && <SimpleImage className="img-fluid card-image-height productImage" src={images?.at(0)} alt={productName} type="product" />}
        {!useResizedImage && imagePath && <ProductImage customClass="img-fluid card-image-height" imageFile={imagePath} skuID={skuID} customPath="/" />}
        {!useResizedImage && imageFilePath && <ProductImage customClass="img-fluid card-image-height" imageFile={imageFilePath} skuID={skuID} />}
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

        <ProductPrice salePrice={salePrice} listPrice={listPrice} ShowPriceForUserType={settings?.skuShowPriceForUserType} className="d-flex" />
      </div>
      {authenticationRequiredForAddToCart && skuID && (
        <div className="alert alert-warning fs-6" role="alert">
          {t('frontend.product.loginToAdd')}
          <br />
          <Link to="/my-account/login"> {t('frontend.account.login')} </Link>
        </div>
      )}
      <ProductOutOfStock isFetching={isFetching} sku={props} />
      {!authenticationRequiredForAddToCart && !isProductOutOfStock && (
        <div className="text-center card-footer border-0 bg-transparent pb-3 pt-0 ">
          {showInput && (
            <div
              style={{
                margin: '0 auto',
                float: 'none',
                width: '5em',
              }}
            >
              <ProductQuantityInput showLabel={showInputLabel} setQuantity={setItemCount} quantity={itemCount} sku={props} stock={props.calculatedQATS || props.stocks_calculatedQATS} />
            </div>
          )}

          <Button
            disabled={isFetching}
            isLoading={isFetching}
            className="btn btn-primary btn-block my-3"
            label={t('frontend.product.add_to_cart')}
            onClick={e => {
              e.preventDefault()
              setFetching(true)
              dispatch(addToCart(skuID, itemCount)).then(() => {
                setFetching(false)
                setItemCount(1)
              })
            }}
          />
        </div>
      )}
    </div>
  )
}

const ProductCard = props => {
  const { productName, productCode, salePrice, urlTitle, brandName, imagePath, imageFile, brandUrlTitle, listPrice, images, productClearance, skuID = '', skuCode, settings, skus, showInput = false, showInputLabel = false } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isFetching, setFetching] = useState(false)
  const [itemCount, setItemCount] = useState(1)
  const [, setSkuID] = useState(skuID)
  const [showModal, setModal] = useState(false)

  const brand = useSelector(getBrandRoute)
  const product = useSelector(getProductRoute)
  const productLink = `/${product}/${urlTitle}` + (skuID.length ? `?skuid=${skuID}` : '')
  const useResizedImage = images && images?.length > 0
  const authenticationRequiredForAddToCart = !!settings?.skuRequireLoginToAddToCart ? !isAuthenticated() : false

  return (
    <div className="card productCard p-3 pt-2 h-100">
      {productClearance === true && <span className="badge">{t('frontend.core.special')}</span>}
      <HeartButton skuID={skuID} />
      <Link to={`/${product}/${urlTitle}?skuid=${skuID}`}>
        {useResizedImage && <SimpleImage className="img-fluid card-image-height productImage" src={images?.at(0)} alt={productName} type="product" />}
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

        <ProductPrice salePrice={salePrice} listPrice={listPrice} ShowPriceForUserType={settings?.skuShowPriceForUserType} className="d-flex" />
      </div>
      <div className="text-center card-footer border-0 bg-transparent pb-3 pt-0">
        {authenticationRequiredForAddToCart && skus?.length <= 1 && (
          <div className="alert alert-warning fs-6" role="alert">
            {t('frontend.product.loginToAdd')}
            <br />
            <Link to="/my-account/login"> {t('frontend.account.login')} </Link>
          </div>
        )}
        {!authenticationRequiredForAddToCart && showInput && (
          <div
            style={{
              margin: '0 auto',
              float: 'none',
              width: '5em',
            }}
          >
            <ProductQuantityInput showLabel={showInputLabel} setQuantity={setItemCount} quantity={itemCount} sku={props} stock={props.calculatedQATS || props.stocks_calculatedQATS} />
          </div>
        )}

        {!authenticationRequiredForAddToCart && skus?.length <= 1 && (
          <Button
            disabled={isFetching}
            isLoading={isFetching}
            className="btn btn-primary btn-block my-3"
            label={t('frontend.product.add_to_cart')}
            onClick={e => {
              e.preventDefault()
              setFetching(true)
              dispatch(addToCart(skuID, itemCount)).then(() => {
                setFetching(false)
                setItemCount(1)
              })
            }}
          />
        )}
        {skus?.length > 1 && (
          <>
            <Button
              disabled={isFetching}
              className="btn btn-primary btn-block my-3"
              label={'Configure Product'}
              onClick={e => {
                e.preventDefault()
                setModal(true)
              }}
            />
            {showModal && (
              <ProductModal
                product={product}
                setShow={setModal}
                addToCart={(skuID, itemCount) => {
                  setModal(false)
                  setItemCount(itemCount)
                  setSkuID(skuID)
                  dispatch(addToCart(skuID, itemCount))
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export { ProductCard, SkuCard }
