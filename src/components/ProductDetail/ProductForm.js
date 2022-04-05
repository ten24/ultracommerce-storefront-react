import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../actions'
import { useProductPrice } from '../../hooks'
import { Button, ProductQuantityInput } from '../'
import { checkInvetory } from '../../selectors'

const ProductQuantityMessage = () => {
  const { t } = useTranslation()
  return (
    <div style={{ marginRight: '5px' }}>
      <span className="text-accent"> {t('frontend.checkout.stock')}</span>
    </div>
  )
}

const ProductForm = ({ sku, isDisabled, isLoading }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const checkInvetoryFlag = useSelector(checkInvetory)
  const { showAddToCart } = useProductPrice({ salePrice: sku?.salePrice, listPrice: sku?.listPrice })
  const [quantity, setQuantity] = useState(1)
  if (checkInvetoryFlag && (!sku || sku?.calculatedQATS < 1 || sku?.stocks_calculatedQATS < 1)) return <ProductQuantityMessage />
  return (
    <div className="d-flex d-flex align-items-end ">
      <form
        className="d-flex align-items-end "
        onSubmit={event => {
          event.preventDefault()
        }}
      >
        {showAddToCart && (
          <div className="form-group me-2 mb-4">
            <ProductQuantityInput setQuantity={setQuantity} quantity={quantity} sku={sku} stock={sku.calculatedQATS || sku.stocks_calculatedQATS} />

            <Button
              disabled={isDisabled}
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
      </form>
    </div>
  )
}
export { ProductForm }
