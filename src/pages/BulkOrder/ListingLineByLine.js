import { Layout, SimpleImage } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { addMultipleItemsToCart } from '../../actions'
import { useNavigate } from 'react-router-dom'
import { useFormatCurrency } from '../../hooks'
import { axios, SlatwalApiService } from '../../services'
import { toast } from 'react-toastify'
import { CSVReaderContainer } from './CSVReaderContainer'
import { getBrandRoute, getProductRoute } from '../../selectors'
import { Link } from 'react-router-dom'

const ListingLineByLine = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [lineItems, setLineItems] = useState([])

  const addtoCart = () => {
    let items = lineItems.filter(item => item.sku && item.quantity > 0)
    let skuIDs = []
    let quantities = []
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      if (item.sku.skuID) {
        skuIDs[i] = item.sku.skuID
        quantities[i] = item.quantity
      }
    }
    dispatch(addMultipleItemsToCart(skuIDs.join(), quantities.join())).then(e => {
      navigate({ pathname: '/shopping-cart' })
    })
  }

  return (
    <Layout>
      <div className="container product-listing mb-5">
        <div className="row mt-3">
          <div className="col">
            <div className="row">
              <div className="col-8">
                <NewLine updateItem={setLineItems} />
              </div>
              <div className="col-4">
                <CSVReaderContainer updateItem={setLineItems} />
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th scope="col">{t('frontend.bulkorder.lineView.productCode')}:</th>
                  <th scope="col">{t('frontend.bulkorder.lineView.price')}:</th>
                  <th scope="col" className="text-end">
                    {t('frontend.bulkorder.lineView.qty')}:
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map(lineItem => {
                  return lineItem.quantity > 0 && <LineItemRow key={lineItem.sku.skuCode} lineItem={lineItem} updateItem={setLineItems} />
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="bg-lightgray py-4">
        <div className="container d-lg-flex justify-content-end py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center">
            <div className="btn-group">
              <button type="button" onClick={addtoCart} className="btn btn-dark text-white" aria-expanded="false">
                {t('frontend.bulkorder.add_all_to_cart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const NewLine = ({ updateItem }) => {
  let [, setFetching] = useState()
  let source = axios.CancelToken.source()
  const { t } = useTranslation()
  let [keyword, setKeyword] = useState('')
  let [quantity, setQuantity] = useState(1)
  useEffect(() => {
    return () => {
      source.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="row">
      <div className="col-7">
        <input
          type="text"
          name="productCode"
          required="required"
          placeholder="Enter the product code"
          className="form-control appended-form-control rounded-pill"
          value={keyword}
          onChange={e => {
            e.preventDefault()
            setKeyword(e.currentTarget.value)
          }}
        />
      </div>
      <div className="col-2">
        <input
          type="number"
          name="quantity"
          className="form-control"
          value={quantity}
          required="required"
          onChange={e => {
            e.preventDefault()
            setQuantity(e.currentTarget.value)
          }}
        />
      </div>
      <div className="col-3">
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={e => {
            e.preventDefault()
            setFetching(true)
            searchforSku(keyword, source).then(result => {
              setFetching(false)
              if (result?.skuCode) {
                setKeyword('')
                updateItem(items => {
                  return [...items, { sku: result, quantity: quantity }]
                })
              }
              if (result?.err) {
                toast.error(result?.err)
              }
            })
          }}
        >
          {t('frontend.bulkorder.add_to_list')}
        </button>
      </div>
    </div>
  )
}

const searchforSku = (skuCode, source, params = {}) => {
  return SlatwalApiService.general.getEntity({ 'f:skuCode': skuCode, entityName: 'sku', includeOptions: true, includeSettings: true, ...params }, [], source).then(response => {
    if (response.isSuccess()) {
      if (response.success().data?.pageRecords?.length) {
        return response.success().data?.pageRecords?.at(0)
      } else {
        return { err: 'SKU is not found' }
      }
    }
    return response.isSuccess()
  })
}

const LineItemRow = ({ lineItem, updateItem }) => {
  const { t } = useTranslation()
  const [formatCurrency] = useFormatCurrency({})
  let [quantity, setQuantity] = useState(lineItem.quantity)
  const brand = useSelector(getBrandRoute)
  const producturl = useSelector(getProductRoute)
  const productLink = `/${producturl}/${lineItem.sku.urlTitle}` + (lineItem.sku.skuID.length ? `?skuid=${lineItem.sku.skuID}` : '')

  return (
    <tr>
      <td>
        <SimpleImage style={{ maxHeight: '100px' }} src={lineItem.sku.images?.at(0) || lineItem.sku.imagePath} />
      </td>
      <td>
        <Link to={`/${brand}/${lineItem.sku.product_brand_urlTitle}`} className="text-capitalize mb-3" style={{ fontSize: 12 }}>
          {lineItem.sku.product_brand_brandName}
        </Link>
        <h2>
          <Link to={productLink} className="product-name d-inline-block w-100">
            {lineItem.sku.product_productName}
          </Link>
        </h2>
        {!lineItem.sku.skuCode && lineItem.sku.productCode && <div className="product-brand">{lineItem.sku.productCode}</div>}
        {lineItem.sku.skuCode && <div className="product-brand">{lineItem.sku.skuCode}</div>}
      </td>
      <td>{formatCurrency(lineItem.sku.salePrice)}</td>
      <td className="text-end">
        <input
          type="number"
          name="quantity"
          value={quantity}
          required="required"
          onChange={e => {
            e.preventDefault()
            setQuantity(e.currentTarget.value)
          }}
        />
      </td>
      <td>
        {quantity !== lineItem.quantity && (
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={e => {
              e.preventDefault()
              updateItem(currentList => {
                return [
                  ...currentList.map(entry => {
                    return entry.sku.skuCode === lineItem.sku.skuCode ? { ...entry, quantity: quantity } : entry
                  }),
                ]
              })
            }}
          >
            update
          </button>
        )}
        {quantity === lineItem.quantity && (
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={event => {
              event.preventDefault()
              updateItem(currentList => {
                return [...currentList.filter(entry => entry.sku?.skuCode !== lineItem.sku.skuCode)]
              })
            }}
          >
            {t('frontend.bulkorder.lineView.button.remove')}
          </button>
        )}
      </td>
    </tr>
  )
}

export { ListingLineByLine }
