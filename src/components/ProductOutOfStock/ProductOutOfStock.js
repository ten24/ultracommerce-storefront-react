import { useTranslation } from 'react-i18next'

const ProductOutOfStock = ({ isFetching, sku }) => {
  const { t } = useTranslation()
  const isProductOutOfStock = !isFetching && validateProductOutOfStock(sku)
  if (!isProductOutOfStock) return null
  return (
    <div style={{ margin: '5px' }}>
      <span className="text-accent"> {t('frontend.checkout.stock')}</span>
    </div>
  )
}

//we can rely on calcualtedQATS to check if item is in stock
//if track invetory is off, it'll contain default value
//if track inventory is on, it'll contain real value
const validateProductOutOfStock = sku => {
  return !sku || sku?.calculatedQATS < 1
}
const validateProductInStock = sku => {
  return !validateProductOutOfStock(sku)
}

export { ProductOutOfStock, validateProductOutOfStock, validateProductInStock }
