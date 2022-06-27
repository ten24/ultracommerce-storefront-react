import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../actions'
import { Button, ProductModal, ProductPrice, SimpleImage } from '../../components'
import { useFormatCurrency } from '../../hooks'
import { getBrandRoute, getProductRoute } from '../../selectors'
import { Link } from 'react-router-dom'

const ProductRow = ({ product }) => {
  const isCartFetching = useSelector(state => state.cart.isFetching)
  const [itemCount, setItemCount] = useState(1)
  const [skuID, setSkuID] = useState(product.sku_skuID)
  const [formatCurrency] = useFormatCurrency({})
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [showModal, setModal] = useState(false)

  const calculatePriceOrRange = product => {
    if (!product.skus || product.skus?.length <= 1) return formatCurrency(product.salePrice)
    const prices = product.skus?.map(sku => sku.salePrice).sort()
    const minPrice = prices.at(0)
    const maxPrice = prices.at(-1)
    if (minPrice === maxPrice) return formatCurrency(minPrice)
    return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
  }
  return (
    <tr>
      <td>
        <SimpleImage style={{ maxHeight: '100px' }} src={product.images[0] || product.imagePath} />
      </td>
      <td>{product.product_productName}</td>
      <td>{product.brandName}</td>

      <td>{calculatePriceOrRange(product)}</td>
      <td>
        {product?.skus?.length <= 1 && (
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
        {product?.skus?.length <= 1 && (
          <Button
            disabled={isCartFetching || itemCount < 1}
            className="btn btn-primary btn-block my-3"
            label={t('frontend.product.add_to_cart')}
            onClick={e => {
              e.preventDefault()
              dispatch(addToCart(skuID, !!itemCount ? itemCount : 1))
            }}
          />
        )}
        {product?.skus?.length > 1 && (
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

const SkuRow = ({ config, product, quantity = 0, onButtonClick, onInputChange }) => {
  const isCartFetching = useSelector(state => state.cart.isFetching)
  const { t } = useTranslation()
  const brand = useSelector(getBrandRoute)
  const producturl = useSelector(getProductRoute)
  const productLink = `/${producturl}/${product.urlTitle}` + (product.skuID.length ? `?skuid=${product.skuID}` : '')
  // const {headings} = config TODO: use this one day to make headings dynamic
  return (
    <tr>
      <td className='product-image'>
        <SimpleImage style={{ maxHeight: '100px' }} src={product.images[0] || product.imagePath} />
      </td>
      <td className='product-sku'><Link to={`/${brand}/${product.brandUrlTitle}`} className="text-capitalize mb-3" style={{ fontSize: 12 }}>
          {product.brandName}
        </Link>
        <h2>
          <Link to={productLink} className="product-name d-inline-block w-100">
            {product.product_productName}
          </Link>
        </h2>
        {!product.skuCode && product.productCode && <div className="product-brand">{product.productCode}</div>}
        {product.skuCode && <div className="product-brand">{product.skuCode}</div>}</td>

      <td className='product-price'>
        <ProductPrice salePrice={product.salePrice} listPrice={product.listPrice} className="d-flex" />
      </td>
      <td className='product-quantity'>
        <input
          type="number"
          className="form-control"
          value={quantity}
          disabled={isCartFetching}
          onChange={e => {
            e.preventDefault()
            Promise.resolve(onInputChange(product, parseInt(e.target.value))).then(() => {})
          }}
        />
      </td>
      <td className='product-btn'>
        <Button
          className="btn btn-primary btn-block my-3"
          label={t(config.buttonLabel)}
          onClick={e => {
            e.preventDefault()
            Promise.resolve(onButtonClick(product)).then(() => {})
          }}
        />
      </td>
    </tr>
  )
}

export { ProductRow, SkuRow }
