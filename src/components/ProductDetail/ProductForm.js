import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../actions'
import { useProductPrice } from '../../hooks'
import { Button, ProductQuantityInput } from '../'
import { isAuthenticated, toBoolean } from '../../utils'
import { Link } from 'react-router-dom'

const ProductForm = ({ sku, isDisabled, isLoading, quantity, setQuantity }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { showAddToCart } = useProductPrice({ salePrice: sku?.salePrice, listPrice: sku?.listPrice })
  
  const authenticationRequiredForAddToCart = !!sku?.settings?.skuRequireLoginToAddToCart ? !isAuthenticated() : false

  if (toBoolean(sku?.settings?.skuAllowOrderTemplateFlag)) return null
  return (
    <div className="d-flex d-flex align-items-end ">
      <form
        className="d-flex align-items-end "
        onSubmit={event => {
          event.preventDefault()
        }}
      >
        {showAddToCart && !authenticationRequiredForAddToCart && (
          <div className="form-group me-2 mb-4">
            <ProductQuantityInput setQuantity={setQuantity} quantity={quantity} sku={sku} stock={sku.calculatedQATS || sku.stocks_calculatedQATS} />

            <Button
              disabled={isDisabled || quantity < 1}
              isLoading={isLoading}
              className="btn btn-primary btn-block my-3"
              label={t('frontend.product.add_to_cart')}
              onClick={event => {
                event.preventDefault()
                dispatch(addToCart(sku.skuID, quantity)).then(() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                })
              }}
            />
          </div>
        )}
        {showAddToCart && authenticationRequiredForAddToCart && (
          <div className="alert alert-warning fs-6" role="alert">
            {t('frontend.product.loginToAdd')}
            <br />
            <Link to="/my-account/login"> {t('frontend.account.login')} </Link>
          </div>
        )}
      </form>
    </div>
  )
}
export { ProductForm }
