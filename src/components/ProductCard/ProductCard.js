import { useDispatch, useSelector } from 'react-redux'
import { HeartButton, SimpleImage, ProductPrice, Button, ProductImage, ProductQuantityInput, ProductOutOfStock, validateProductInStock } from '..'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getBrandRoute, getProductRoute, getVerifiedAccountFlag } from '../../selectors'
import { addToCart } from '../../actions'
import { useState } from 'react'
import { isAuthenticated } from '../../utils'

const SkuCard = ({ cardConfiguration, productName, productCode, salePrice, urlTitle, brandName, imagePath, imageFile, brandUrlTitle, listPrice, images, productClearance, skuID = '', skuCode, settings, product_defaultSku_calculatedImageExists, calculatedImageExists, product_defaultSku_imageFile, ...props }) => {
  const { t } = useTranslation()
  const [isFetching, setFetching] = useState(false)
  const [itemCount, setItemCount] = useState(1)
  const brand = useSelector(getBrandRoute)

  const product = useSelector(getProductRoute)
  const productLink = `/${product}/${urlTitle}` + (skuID.length ? `?skuid=${skuID}` : '')
  const useResizedImage = images && images?.length > 0
  const isProductInStock = !isFetching && validateProductInStock(props)
  let imageFilePath = imageFile

  if (calculatedImageExists === true) {
    imageFilePath = imageFile
  } else if (product_defaultSku_calculatedImageExists === true) {
    //fallback to default sku image
    imageFilePath = product_defaultSku_imageFile
  } else {
    imageFilePath = imageFile
  }
  if (!cardConfiguration || !Object.keys(cardConfiguration)?.length) {
    console.log('Missing Configuration')
    return null
  }
  return (
    <div className="card skuCard p-3 pt-2 h-100">
      {productClearance === true && <span className="badge">{t('frontend.core.special')}</span>}
      {!!cardConfiguration?.enableFavorites && <HeartButton skuID={skuID} />}
      <Link to={`/${product}/${urlTitle}?skuid=${skuID}`}>
        {useResizedImage && <SimpleImage className="img-fluid card-image-height productImage" src={images?.at(0)} alt={productName} type="product" />}
        {!useResizedImage && imagePath && <ProductImage customClass="img-fluid card-image-height" imageFile={imagePath} skuID={skuID} customPath="/" />}
        {!useResizedImage && imageFilePath && <ProductImage customClass="img-fluid card-image-height" imageFile={imageFilePath} skuID={skuID} />}
      </Link>
      <div className="card-body">
        {cardConfiguration?.showBrand && (
          <Link to={`/${brand}/${brandUrlTitle}`} className="text-capitalize mb-3" style={{ fontSize: 12 }}>
            {brandName}
          </Link>
        )}
        <h2>
          <Link to={productLink} className="product-name d-inline-block w-100">
            {productName}
          </Link>
        </h2>
        {cardConfiguration.showProductCode && productCode && <div className="product-brand">{productCode}</div>}
        {cardConfiguration.showSkuCode && skuCode && <div className="product-brand">{skuCode}</div>}
        {cardConfiguration?.showPrice && <ProductPrice salePrice={salePrice} listPrice={listPrice} ShowPriceForUserType={settings?.skuShowPriceForUserType} className="d-flex" />}
      </div>
      <ProductOutOfStock isFetching={isFetching} sku={props} />
      <CardProductQuantityInput skuSettings={settings} cardConfiguration={cardConfiguration} isProductInStock={isProductInStock} setQuantity={setItemCount} quantity={itemCount} sku={props} stock={props.calculatedQATS || props.stocks_calculatedQATS} />
      <ListingButtons skuSettings={settings} cardConfiguration={cardConfiguration} isProductInStock={isProductInStock} productLink={productLink} isFetching={isFetching} skuID={skuID} itemCount={itemCount} setFetching={setFetching} setItemCount={setItemCount} />
    </div>
  )
}

const CardProductQuantityInput = ({ cardConfiguration, isProductInStock, skuSettings, ...props }) => {
  const isVerifiedAccount = useSelector(getVerifiedAccountFlag)
  const isAuthenticatedUser = isAuthenticated()
  const authenticationRequiredForAddToCart = !!skuSettings?.skuRequireLoginToAddToCart ? isAuthenticatedUser : false
  let criteriaPassed = false
  if (cardConfiguration.input.showCriteria === 'all') criteriaPassed = true
  if (cardConfiguration.input.showCriteria === 'showForAuthenticatedUsers') criteriaPassed = isAuthenticatedUser
  if (cardConfiguration.input.showCriteria === 'showForAuthenticatedUsersAndInStock') criteriaPassed = isAuthenticatedUser && isProductInStock
  if (cardConfiguration.input.showCriteria === 'showForVerifiedUsers') criteriaPassed = isVerifiedAccount
  if (cardConfiguration.input.showCriteria === 'showForVerifiedUsersAndInStock') criteriaPassed = isVerifiedAccount && isProductInStock
  if (!criteriaPassed || !authenticationRequiredForAddToCart) return null

  return (
    <div className="text-center border-0 bg-transparent pb-3 pt-0 ">
      <div
        style={{
          margin: '0 auto',
          float: 'none',
          width: '5em',
        }}
      >
        <ProductQuantityInput showLabel={cardConfiguration?.showInputLabel} {...props} />
      </div>
    </div>
  )
}

const AuthenticateRequiredMessage = () => {
  const { t } = useTranslation()
  return (
    <div className="alert alert-warning fs-6" role="alert">
      {t('frontend.product.loginToAdd')}
      <br />
      <Link to="/my-account/login"> {t('frontend.account.login')} </Link>
    </div>
  )
}

const ListingButtons = ({ skuSettings, cardConfiguration, isProductInStock, productLink, isFetching, skuID, itemCount, setFetching, setItemCount }) => {
  const dispatch = useDispatch()
  const isVerifiedAccount = useSelector(getVerifiedAccountFlag)
  const isAuthenticatedUser = isAuthenticated()
  // this is needed so we can calculate 6 or 12 of buttons
  const buttonStack = cardConfiguration?.buttons?.map(props => {
    const { showAuthenticationRequiredMessageFlag = true, hideListingButton = true, type = 'ADD_TO_CART', listingButtonDisplayCriteria } = props
    let criteriaPassed = false
    if (listingButtonDisplayCriteria === 'all') criteriaPassed = true
    if (listingButtonDisplayCriteria === 'showForAuthenticatedUsers') criteriaPassed = isAuthenticatedUser
    if (listingButtonDisplayCriteria === 'showForAuthenticatedUsersAndInStock') criteriaPassed = isAuthenticatedUser && isProductInStock
    if (listingButtonDisplayCriteria === 'showForVerifiedUsers') criteriaPassed = isVerifiedAccount
    if (listingButtonDisplayCriteria === 'showForVerifiedUsersAndInStock') criteriaPassed = isVerifiedAccount && isProductInStock
    if (type === 'ADD_TO_CART') {
      const authenticationRequiredForAddToCart = !!skuSettings?.skuRequireLoginToAddToCart ? isAuthenticatedUser : false
      if ((!criteriaPassed || authenticationRequiredForAddToCart) && showAuthenticationRequiredMessageFlag) return { ...props, shouldDisplayAuthenticationRequiredMessageFlag: true }
    }
    if (!criteriaPassed && hideListingButton) return false
    return props
  })
  return (
    <div className="text-center border-0 bg-transparent pb-3 pt-0 ">
      <div className="grid">
        {buttonStack?.map(({ shouldDisplayAuthenticationRequiredMessageFlag = false, disableListingButton = false, type = 'ADD_TO_CART', listingButtonLabel }, idx) => {
          if (type === 'VIEW') {
            return (
              <div key={idx} className={buttonStack.length > 1 ? 'g-col-6' : 'g-col-12'}>
                <Link to={productLink} className="btn btn-primary">
                  {listingButtonLabel}
                </Link>
              </div>
            )
          }

          if (type === 'ADD_TO_CART') {
            if (shouldDisplayAuthenticationRequiredMessageFlag) return <AuthenticateRequiredMessage />
            return (
              <div key={idx} className={buttonStack.length > 1 ? 'g-col-6' : 'g-col-12'}>
                <Button
                  disabled={isFetching || disableListingButton}
                  isLoading={isFetching}
                  classList="btn btn-primary "
                  label={listingButtonLabel}
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
            )
          }
          if (type === 'PRODUCT_ATTRIBUTE_FILE') {
            return (
              <div key={idx} className={buttonStack.length > 1 ? 'g-col-6' : 'g-col-12'}>
                <Link to="link-to-file" className="btn btn-primary">
                  Link to File
                </Link>
              </div>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

const ProductCard = props => {
  const { cardConfiguration, productName, productCode, salePrice, urlTitle, brandName, imagePath, imageFile, brandUrlTitle, listPrice, images, productClearance, skuID = '', skuCode, settings } = props
  const { t } = useTranslation()
  const [isFetching, setFetching] = useState(false)
  const [itemCount, setItemCount] = useState(1)
  // const dispatch = useDispatch()
  // const [, setSkuID] = useState(skuID)
  // const [showModal, setModal] = useState(false)

  const brand = useSelector(getBrandRoute)
  const product = useSelector(getProductRoute)
  const productLink = `/${product}/${urlTitle}` + (skuID.length ? `?skuid=${skuID}` : '')
  const useResizedImage = images && images?.length > 0
  if (!cardConfiguration || !Object.keys(cardConfiguration)?.length) {
    console.log('Missing Configuration')
    return null
  }

  return (
    <div className="card productCard p-3 pt-2 h-100">
      {productClearance === true && <span className="badge">{t('frontend.core.special')}</span>}
      {!!cardConfiguration?.enableFavorites && <HeartButton skuID={skuID} />}
      <div className="product-card-img">
        <Link to={`/${product}/${urlTitle}?skuid=${skuID}`}>
          {useResizedImage && <SimpleImage className="img-fluid card-image-height productImage" src={images?.at(0)} alt={productName} type="product" />}
          {!useResizedImage && imagePath && <ProductImage customClass="img-fluid card-image-height" imageFile={imagePath} skuID={skuID} customPath="/" />}
          {!useResizedImage && imageFile && <ProductImage customClass="img-fluid card-image-height" imageFile={imageFile} skuID={skuID} />}
        </Link>
      </div>
      <div className="card-body">
        {cardConfiguration?.showBrand && (
          <Link to={`/${brand}/${brandUrlTitle}`} className="text-capitalize mb-3" style={{ fontSize: 12 }}>
            {brandName}
          </Link>
        )}
        <h2>
          <Link to={productLink} className="product-name d-inline-block w-100">
            {productName}
          </Link>
        </h2>
        {cardConfiguration?.showProductCode && productCode && <div className="product-brand">{productCode}</div>}
        {cardConfiguration?.showSkuCode && skuCode && <div className="product-brand">{skuCode}</div>}
        {cardConfiguration?.showPrice && <ProductPrice salePrice={salePrice} listPrice={listPrice} ShowPriceForUserType={settings?.skuShowPriceForUserType} className="d-flex" />}
      </div>
      <ProductOutOfStock isFetching={isFetching} sku={props} />
      <CardProductQuantityInput skuSettings={settings} cardConfiguration={cardConfiguration} isProductInStock={true} setQuantity={setItemCount} quantity={itemCount} sku={props} stock={props.calculatedQATS || props.stocks_calculatedQATS} />
      <ListingButtons skuSettings={settings} cardConfiguration={cardConfiguration} isProductInStock={true} productLink={productLink} isFetching={isFetching} skuID={skuID} itemCount={itemCount} setFetching={setFetching} setItemCount={setItemCount} />
      <div className="text-center  border-0 bg-transparent pb-3 pt-0">
        {/* {!authenticationRequiredForAddToCart && skus?.length <= 1 && (
          <Button
            disabled={isFetching}
            isLoading={isFetching}
            className="btn btn-primary  btn-block my-3"
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
        )} */}
      </div>
    </div>
  )
}

export { ProductCard, SkuCard, ListingButtons, AuthenticateRequiredMessage, CardProductQuantityInput }
