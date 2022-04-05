import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../actions'
import { Button, ProductModal, SimpleImage } from '../../components'
import { useFormatCurrency } from '../../hooks'

const ProductRow = ({ product }) => {
  const isCartFetching = useSelector(state => state.cart.isFetching)
  const [itemCount, setItemCount] = useState(0)
  const [skuID, setSkuID] = useState(product.sku_skuID)
  const [formatCurrency] = useFormatCurrency({})
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [showModal, setModal] = useState(false)
  const calculatePriceOrRange = () => {
    return formatCurrency(10)
  }
  return (
    <tr>
      <td>
        <SimpleImage style={{ maxHeight: '100px' }} src={product.images[0] || product.imagePath} />
      </td>
      <td>{product.product_productName}</td>
      <td>{product.brandName}</td>
      <td>{calculatePriceOrRange()}</td>
      <td>
        {product.skus.length <= 1 && (
          <input
            type="number"
            className="form-control"
            value={itemCount}
            disabled={isCartFetching}
            onChange={e => {
              setItemCount(e.target.value)
            }}
          />
        )}
      </td>
      <td>
        {product.skus.length <= 1 && (
          <Button
            disabled={isCartFetching}
            className="btn btn-primary btn-block my-3"
            label={t('frontend.product.add_to_cart')}
            onClick={e => {
              e.preventDefault()
              dispatch(addToCart(skuID, !!itemCount ? itemCount : 1))
            }}
          />
        )}
        {product.skus.length > 1 && (
          <>
            <Button
              disabled={isCartFetching}
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
                  dispatch(addToCart(skuID, !!itemCount ? itemCount : 1))
                }}
              />
            )}
          </>
        )}
      </td>
    </tr>
  )
}

export { ProductRow }
