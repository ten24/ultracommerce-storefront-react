import { Layout, SimpleImage } from '../../components'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { useFormatCurrency } from '../../hooks'
import { useState, useCallback } from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { getProductRoute } from '../../selectors'
import { removeItem } from '../../actions'
import { useTranslation } from 'react-i18next'

const LineByLineView = () => {
  const loc = useLocation()
  const siteName = useSelector(state => state.configuration.site.siteName)
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const [lineItems, setLineItems] = useState([
    { productCode: null, quantity: 0, pos: 1 },
    { productCode: null, quantity: 0, pos: 2 },
    { productCode: null, quantity: 0, pos: 3 },
  ])
  const handleLineItemChange = useCallback(
    () => (event, lineItem) => {
      const fieldName = event.target.getAttribute('name')
      const fieldValue = event.target.value
      console.log(fieldValue)

      if (fieldName === 'productCode') {
      }

      const index = lineItems.findIndex(item => item.pos === lineItem.pos)
      const data = { ...lineItem }
      data[fieldName] = fieldValue
      lineItems[index] = data
      console.log(data)
      setLineItems(lineItems)
    },
    [lineItems]
  )

  const debounce = func => {
    let timer
    return function (...args) {
      const context = this
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        func.apply(context, args)
      }, 500)
    }
  }

  const debouncedHandleLineItemChange = useCallback(() => {
    debounce((event, lineItem) => {
      handleLineItemChange(event, lineItem)
    })
  }, [handleLineItemChange])

  return (
    <Layout>
      <Helmet title={`Bulk Order - ${siteName}`} />
      <div className="bg-lightgray py-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center">
            <h1 className="h3 text-dark mb-0 font-accent text-capitalize">{content?.title || 'Bulk Order'}</h1>
          </div>
        </div>
      </div>
      <div className="container product-listing mb-5">
        <div className="row mt-3">
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Product Code:</th>
                  <th scope="col">Price:</th>
                  <th scope="col" className="text-end">
                    QTY:
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map(lineItem => (
                  <tr key={lineItem.pos}>
                    <td>
                      {' '}
                      <input type="text" name="productCode" required="required" value={lineItem.productCode} placeholder="Enter the product code" onChange={event => debouncedHandleLineItemChange(event, lineItem)} />
                    </td>
                    <td>{lineItem.price}</td>
                    <td className="text-end">
                      <input type="number" name="quantity" value={lineItem.quantity} required="required" onChange={event => debouncedHandleLineItemChange(event, lineItem)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SideCart />
        </div>
      </div>
    </Layout>
  )
}

const SideCart = () => {
  const cart = useSelector(state => state.cart)
  const { orderItems, total, isFetching } = cart
  const [formatCurrency] = useFormatCurrency({})
  const productRoute = useSelector(getProductRoute)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <div className=" listingCart col-lg-3">
      <div className="filter-block p-4">
        <h4 className="border-bottom pb-2 mb-3">Cart</h4>
        <div className={``} style={{ minWidth: '350px' }}>
          <div className="">
            <div style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '10px' }}>
              {orderItems.length > 0 &&
                orderItems.map(({ price, sku, orderItemID, quantity }) => {
                  const { skuID, product, images } = sku
                  const { productName, urlTitle } = product
                  return (
                    <div className="d-flex align-items-center py-3 justify-content-between border-bottom border-light" key={skuID}>
                      {images && images?.length > 0 && <SimpleImage className="img-fluid mw-50px productImage" src={images[0]} alt={productName} type="product" />}
                      <Link to={`/${productRoute}/${urlTitle}`} className="cart-product-name">
                        {productName}
                      </Link>
                      <span className="text-muted small fw-bolder">
                        {quantity} x <span className="text-black">{formatCurrency(price)}</span>
                      </span>
                      <figure className="m-0">
                        <i
                          onClick={() => {
                            dispatch(removeItem(orderItemID))
                          }}
                          className="bi bi-x-circle"
                          role="button"
                        ></i>
                      </figure>
                    </div>
                  )
                })}
              {orderItems.length > 0 ? (
                <>
                  <div className="d-flex justify-content-center border-top border-bottom py-2 mb-4">
                    <label className="text-muted">{t('frontend.home.subtotal')}: </label> <span className="fw-bold">&nbsp;{formatCurrency(total)}</span>
                  </div>
                  <Link to="/shopping-cart" className="btn btn-dark d-block ">
                    {t('frontend.header.checkout')}
                  </Link>
                  {isFetching && <div className="alert alert-info m-2 small">{t('frontend.cart.removeCartItem')}</div>}
                </>
              ) : (
                <div className="alert alert-secondary m-2 small">{t('frontend.cart.empty_cart')}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LineByLineView
