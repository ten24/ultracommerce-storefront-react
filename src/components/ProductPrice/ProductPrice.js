import { useTranslation } from 'react-i18next'
import { useFormatCurrency, useProductPrice } from '../../hooks/'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../../utils'

const ProductPrice = ({ priceGroupLabel = '',salePrice = 0, listPrice = 0, type = 'product', ShowPriceForUserType = 'All', ignoreDisplayRules = false, salePriceSuffixKey, accentSalePrice = true, listPriceSuffixKey = 'frontend.core.list' }) => {
  const [formatCurrency] = useFormatCurrency({})
  const { t } = useTranslation()
  const { showMissingPrice, showSalePrice, showListPrice, isActionRequiredToShowPrice } = useProductPrice({ salePrice, listPrice, type, ShowPriceForUserType, ignoreDisplayRules })
  return (
    <>
      <div className="product-price">
        {showMissingPrice && <small>{t('frontend.product.missingprice')}</small>}
        {showListPrice &&
          ShowPriceForUserType === 'All' && ( // show list price only when list price is more than sale price
            <small className="text-muted">
              <s>{`${formatCurrency(listPrice)}`}</s>
            </small>
          )}
        {showSalePrice && <span className="d-block">{formatCurrency(salePrice)}</span>}
      </div>
      {(isActionRequiredToShowPrice && ShowPriceForUserType === 'Authenticated') ||
        (!isAuthenticated() && isActionRequiredToShowPrice && ShowPriceForUserType === 'Verified' && (
          <div className="alert alert-warning fs-6" role="alert">
            {t('frontend.product.loginToView')}
            <br />
            <Link to="/my-account/login"> {t('frontend.account.login')} </Link>
          </div>
        ))}
      {isAuthenticated() && isActionRequiredToShowPrice && ShowPriceForUserType === 'Verified' && (
        <div className="alert alert-warning fs-6" role="alert">
          {t('frontend.product.verifyForPricing')}
        </div>
      )}
    </>
  )
}

export { ProductPrice }
