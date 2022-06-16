import { ProductSubscriptionForm } from '../../components'
import { useFormatCurrency } from '../../hooks/'
import { toBoolean } from '../../utils'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const ProductTypeRadioList = ({ selectedSKu, product, isDisabled, isFetching }) => {
  const PRODUCT_TYPE_ONE_TIME_PURCHASE = '1'
  const PRODUCT_TYPE_SUBSCRIPTION = '2'
  const [productType, setProductType] = useState(PRODUCT_TYPE_ONE_TIME_PURCHASE)
  const [formatCurrency] = useFormatCurrency({})
  const { t } = useTranslation()

  return (
    <>
    { toBoolean(selectedSKu?.settings?.skuAllowOrderTemplateFlag) && (
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
            {t('frontend.product.oneTimePurchase')} {productType === PRODUCT_TYPE_ONE_TIME_PURCHASE && <span className="fw-bold">{formatCurrency(product.salePrice)} </span>}
          </label>
          {product?.productID && productType === PRODUCT_TYPE_ONE_TIME_PURCHASE && <ProductSubscriptionForm sku={selectedSKu} productType={PRODUCT_TYPE_ONE_TIME_PURCHASE} isDisabled={isDisabled} isLoading={isFetching} />}
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
            {t('frontend.product.subscribeProduct')} {productType === PRODUCT_TYPE_SUBSCRIPTION && <span className="fw-bold">{formatCurrency(product.salePrice)} </span>}
          </label>
          {product?.productID && productType === PRODUCT_TYPE_SUBSCRIPTION && <ProductSubscriptionForm sku={selectedSKu} productType={PRODUCT_TYPE_SUBSCRIPTION} />}
        </div>
      </div>
      </>
      )}
    </>
  )
}
export { ProductTypeRadioList }
