import { Layout, ListingToolBar, ListingSidebar, ListingPagination, ListingGrid, SimpleImage } from '../../components'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { useFormatCurrency, useListing } from '../../hooks'
import { useState } from 'react'
import { useLocation } from 'react-router'
import { ProductListingListView } from './ProductListingListView'
import { Link } from 'react-router-dom'
import { getProductRoute } from '../../selectors'
import { removeItem } from '../../actions'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
const preFilter = {}
const GRID = 'GRID'
const LISTING = 'LISTING'

const BulkOrder = () => {
  const [viewMode] = useState(LISTING)
  const loc = useLocation()
  const siteName = useSelector(state => state.configuration.site.siteName)
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const hide = []
  const { records, isFetching, potentialFilters, total, totalPages, setSort, updateAttribute, setPage, setKeyword, params } = useListing(preFilter, 'bulkOrder')

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
      <div className="container-fluid product-listing mb-5">
        <ListingToolBar hide={hide} {...potentialFilters} removeFilter={updateAttribute} setSort={setSort} recordsCount={total} />
        <div className="row mt-5">
          <ListingSidebar isFetching={isFetching} hide={hide} filtering={potentialFilters} recordsCount={total} keyword={params['keyword']} setKeyword={setKeyword} updateAttribute={updateAttribute} />
          <div className="col">
            {viewMode === LISTING && <ProductListingListView isFetching={isFetching} pageRecords={records} />}
            {viewMode === GRID && <ListingGrid isFetching={isFetching} pageRecords={records} />}
            <ListingPagination recordsCount={total} currentPage={params['currentPage']} totalPages={totalPages} setPage={setPage} />
          </div>

          <SideCart />
        </div>
      </div>
    </Layout>
  )
}

const SideCart = () => {
  const cart = useSelector(state => state.cart)
  const { orderItems, total } = cart
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
                            dispatch(removeItem(orderItemID)).then(resp => {
                              if (resp.isSuccess()) toast.error(t('frontend.cart.removeCartItem'))
                            })
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
export default BulkOrder
