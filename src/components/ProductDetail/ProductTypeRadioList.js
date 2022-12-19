import { ProductSubscriptionForm } from '../../components'
import { useFormatCurrency, useProductPrice } from '../../hooks/'
import { isAuthenticated, toBoolean } from '../../utils'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const ProductTypeRadioList = ({ selectedSKu, product, isDisabled, isFetching }) => {
  const PRODUCT_TYPE_ONE_TIME_PURCHASE = '1'
  const PRODUCT_TYPE_SUBSCRIPTION = '2'
  const [productType, setProductType] = useState(PRODUCT_TYPE_ONE_TIME_PURCHASE)
  const [formatCurrency] = useFormatCurrency({})
  const { t } = useTranslation()
  const { showSalePrice } = useProductPrice({ salePrice: selectedSKu?.salePrice, listPrice: selectedSKu?.listPrice, type: 'product', ShowPriceForUserType: selectedSKu?.settings?.skuShowPriceForUserType })
  const authenticationRequiredForAddToCart = !!selectedSKu?.settings?.skuRequireLoginToAddToCart ? !isAuthenticated() : false

  return (
    <>
      {toBoolean(selectedSKu?.settings?.skuAllowOrderTemplateFlag) && (
        <>
          <div className="d-flex m-auto mb-4 product-type-radio-list overflow-hidden">
            <div className={productType === PRODUCT_TYPE_ONE_TIME_PURCHASE ? 'p-3 radio checkedRadio' : 'p-3 radio'}>
              <label>
                <input
                  type="radio"
                  className="me-2"
                  value={PRODUCT_TYPE_ONE_TIME_PURCHASE}
                  checked={productType === PRODUCT_TYPE_ONE_TIME_PURCHASE}
                  onChange={e => {
                    setProductType(e.target.value)
                  }}
                />
                {t('frontend.product.oneTimePurchase')} {productType === PRODUCT_TYPE_ONE_TIME_PURCHASE && <span className="fw-bold">{showSalePrice ? formatCurrency(selectedSKu.salePrice) : ''} </span>}
              </label>
              {!authenticationRequiredForAddToCart && product?.productID && productType === PRODUCT_TYPE_ONE_TIME_PURCHASE && <ProductSubscriptionForm sku={selectedSKu} productType={PRODUCT_TYPE_ONE_TIME_PURCHASE} isDisabled={isDisabled} isLoading={isFetching} />}
              {authenticationRequiredForAddToCart && product?.productID && productType === PRODUCT_TYPE_ONE_TIME_PURCHASE && (
                <div className="alert alert-warning fs-6" role="alert">
                  {t('frontend.product.loginToAdd')}
                  <br />
                  <Link to="/my-account/login"> {t('frontend.account.login')} </Link>
                </div>
              )}
            </div>
            <div className={productType === PRODUCT_TYPE_SUBSCRIPTION ? 'p-3 radio checkedRadio' : 'p-3 radio'}>
              <label>
                <input
                  type="radio"
                  className="me-2"
                  value={PRODUCT_TYPE_SUBSCRIPTION}
                  checked={productType === PRODUCT_TYPE_SUBSCRIPTION}
                  onChange={e => {
                    setProductType(e.target.value)
                  }}
                />
                {t('frontend.product.subscribeProduct')} {productType === PRODUCT_TYPE_SUBSCRIPTION && <span className="fw-bold">{showSalePrice ? formatCurrency(selectedSKu.salePrice) : ''} </span>}
              </label>
              {!authenticationRequiredForAddToCart && product?.productID && productType === PRODUCT_TYPE_SUBSCRIPTION && <ProductSubscriptionForm sku={selectedSKu} productType={PRODUCT_TYPE_SUBSCRIPTION} />}
              {authenticationRequiredForAddToCart && product?.productID && productType === PRODUCT_TYPE_SUBSCRIPTION && (
                <div className="alert alert-warning fs-6" role="alert">
                  {t('frontend.product.loginToAdd')}
                  <br />
                  <Link to="/my-account/login"> {t('frontend.account.login')} </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
export { ProductTypeRadioList }
