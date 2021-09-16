import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../actions'
import { Button } from '../Button/Button'

const ProductForm = ({ sku, isDisabled, isLoading }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [quantity, setQuantity] = useState(1)
  if (!sku || sku?.calculatedQATS < 1) return null

  return (
    <div className="d-flex d-flex align-items-end ">
      <form
        className="d-flex align-items-end "
        onSubmit={event => {
          event.preventDefault()
          dispatch(addToCart(sku.skuID, quantity))
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }}
      >
        <div className="form-group me-2 mb-4">
          <label className="qtyLabel">{t('frontend.core.quantity')}</label>
          <div>
            <select
              value={quantity}
              onChange={event => {
                setQuantity(event.target.value)
              }}
              className="custom-select mb-3 rounded-pill"
              id="qty"
            >
              {[...Array(sku.calculatedQATS > 20 ? 20 : sku.calculatedQATS).keys()].map((value, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>

          <Button
            disabled={isDisabled}
            isLoading={isLoading}
            className="btn btn-primary btn-block my-3"
            label={t('frontend.product.add_to_cart')}
            onClick={event => {
              dispatch(addToCart(sku.skuID, quantity))
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }}
          />
        </div>
      </form>
    </div>
  )
}
export { ProductForm }
