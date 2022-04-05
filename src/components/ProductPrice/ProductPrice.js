import { useTranslation } from 'react-i18next'
import { useFormatCurrency, useProductPrice } from '../../hooks/'
import { Link } from 'react-router-dom'

const ProductPrice = ({ salePrice = 0, listPrice = 0, type = 'product', salePriceSuffixKey, accentSalePrice = true, listPriceSuffixKey = 'frontend.core.list', showloginRequired = false }) => {
  const [formatCurrency] = useFormatCurrency({})
  const { t } = useTranslation()
  const { showMissingPrice, showSalePrice, showListPrice, loginRequiredForPrice } = useProductPrice({ salePrice, listPrice, type, showloginRequired })
  return (
    <>
      <div className="product-price">
        {showMissingPrice && <small>{t('frontend.product.missingprice')}</small>}
        {showListPrice && ( // show list price only when list price is more than sale price
          <small className="text-muted">
            <s>{`${formatCurrency(listPrice)}`}</s>
          </small>
        )}
        {showSalePrice && <span className="d-block">{formatCurrency(salePrice)}</span>}
      </div>
      {loginRequiredForPrice && showloginRequired && (
        <div className="alert alert-warning fs-6" role="alert">
          Login to view price
          <br />
          <Link to="/my-account"> Login or Create Account </Link>
        </div>
      )}
    </>
  )
}

export { ProductPrice }
