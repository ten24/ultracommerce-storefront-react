import { Layout, ListingToolBar, ListingSidebar, ListingPagination, SimpleImage } from '../../components'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { useFormatCurrency, useListing } from '../../hooks'
import { useState } from 'react'
import { useLocation } from 'react-router'
import { ProductListingListView } from './ProductListingListView'
import { ProductListingGridView } from './ProductListingGridView'
import { ListingLineByLine } from './ListingLineByLine'
import { addMultipleItemsToCart } from '../../actions'
import { useTranslation } from 'react-i18next'
import { SkuRow } from './ProductRow'

const preFilter = {}
const GRID = 'GRID'
const LISTING = 'LISTING'
const LINEBYLINE = 'LISTINGLINEBYLINE'

const BulkOrder = () => {
  const [viewMode, setViewMode] = useState(LISTING)
  const [bulkOrderList, setBulkOrderList] = useState({})
  const { t } = useTranslation()
  const loc = useLocation()
  const siteName = useSelector(state => state.configuration.site.siteName)
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const hide = []
  const { records, isFetching, potentialFilters, total, totalPages, setSort, updateAttribute, setPage, setKeyword, params, config } = useListing(preFilter, 'bulkOrder')
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
        {viewMode !== LINEBYLINE && <ListingToolBar hide={hide} {...potentialFilters} removeFilter={updateAttribute} setSort={setSort} recordsCount={total} />}

        <ul className="nav nav-pills mb-3 justify-content-end" id="pills-tab" role="tablist">
          <li className="nav-item border" role="presentation">
            <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" type="button" onClick={() => setViewMode(LISTING)}>
              {t('frontend.bulkorder.list')}
            </button>
          </li>
          <li className="nav-item border" role="presentation">
            <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" type="button" onClick={() => setViewMode(GRID)}>
              {t('frontend.bulkorder.grid')}
            </button>
          </li>
          <li className="nav-item border" role="presentation">
            <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" type="button" onClick={() => setViewMode(LINEBYLINE)}>
              {t('frontend.bulkorder.linebyline')}
            </button>
          </li>
        </ul>
        {viewMode === LINEBYLINE && <ListingLineByLine />}
        {viewMode !== LINEBYLINE && (
          <div className="row mt-5">
            <ListingSidebar isFetching={isFetching} hide={hide} filtering={potentialFilters} recordsCount={total} keyword={params['keyword']} setKeyword={setKeyword} updateAttribute={updateAttribute} />
            <div className="col">
              {viewMode === LISTING && (
                <ProductListingListView
                  Card={SkuRow}
                  config={config}
                  list={bulkOrderList}
                  onButtonClick={product => {
                    setBulkOrderList(currentlist => {
                      let qty = 1
                      if (bulkOrderList[product.sku_skuID]?.quantity) {
                        qty = bulkOrderList[product.sku_skuID]?.quantity + 1
                      }
                      return { ...currentlist, [product.sku_skuID]: { quantity: qty, images: product.images, skuDefinition: product.skuDefinition, skuCode: product.skuCode, salePrice: product.salePrice, productName: product.product_productName } }
                    })
                  }}
                  onInputChange={(product, value) => {
                    setBulkOrderList(currentlist => {
                      if (value < 1) {
                        delete currentlist[product.sku_skuID]
                        return { ...currentlist }
                      }
                      return { ...currentlist, [product.sku_skuID]: { quantity: value, images: product.images, skuDefinition: product.skuDefinition, skuCode: product.skuCode, salePrice: product.salePrice, productName: product.product_productName } }
                    })
                  }}
                  isFetching={isFetching}
                  pageRecords={records}
                />
              )}
              {viewMode === GRID && <ProductListingGridView isFetching={isFetching} pageRecords={records} bulkOrderList={bulkOrderList} setBulkOrderList={setBulkOrderList} onButtonClick={(product, value) => {}} onInputChange={(product, value) => {}} />}
              <ListingPagination recordsCount={total} currentPage={params['currentPage']} totalPages={totalPages} setPage={setPage} />
            </div>

            <SideCart items={bulkOrderList} updateList={setBulkOrderList} />
          </div>
        )}
      </div>
    </Layout>
  )
}

const SideCart = ({ items, updateList }) => {
  const [formatCurrency] = useFormatCurrency({})
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  let filtered = Object.entries(items).filter(([skuID,item]) => (item.productName.toLowerCase().includes(search.toLowerCase())) )
  const filtereditems = Object.fromEntries(filtered);
  
  const addtoCart = lineItems => {
    let skuIDs = []
    let quantities = []
    Object.keys(lineItems).forEach(skuID => {
      skuIDs.push(skuID)
      quantities.push(lineItems[skuID].quantity)
    })

    dispatch(addMultipleItemsToCart(skuIDs.join(), quantities.join())).then(response => {
      updateList({})
    })
  }

  return (
    <div className=" listingCart col-lg-3">
      <div className="filter-block p-4">
        <h4 className="border-bottom pb-2 mb-3">List</h4>
        <div className={`input-group rounded-pill my-2 -search `}>
          <input
            className="form-control remove-focus border-end-0"
            value={search}
            onChange={event => {
              setSearch(event.target.value)
            }}
            type="text"
            placeholder={t('frontend.header.search')}
          />
          <span className="btn btn-link">
            <i className="bi bi-search"></i>
          </span>
        </div>
        <div className={``}>
          <div className="">
            <div style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '10px' }}>
              {Object.keys(filtereditems).length > 0 &&
                Object.keys(filtereditems).map(skuID => {
                  const { salePrice, skuCode, images, productName, quantity } = filtereditems[skuID]
                  return (
                    <div className="py-3  border-bottom border-light" key={skuID}>
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-2"> {images && images?.length > 0 && <SimpleImage className="img-fluid mw-50px productImage" src={images[0]} alt={productName} type="product" />}</div>
                          <div className="col-8">
                            <p>
                              <span>{productName}</span> <br />
                              <span>{skuCode}</span>
                            </p>
                          </div>
                          <div className="col-2 ">
                            <span className="text-muted small fw-bolder">
                              {quantity} x <span className="text-black">{formatCurrency(salePrice)}</span>
                            </span>
                            <figure className="m-0">
                              <i
                                onClick={() => {
                                  updateList(currentlist => {
                                    delete currentlist[skuID]
                                    return { ...currentlist }
                                  })
                                }}
                                className="bi bi-x-circle"
                                role="button"
                              />
                            </figure>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              {Object.keys(filtereditems).length > 0 && (
                <button
                  className="btn btn-dark d-block "
                  onClick={e => {
                    e.preventDefault()
                    addtoCart(filtereditems)
                  }}
                >
                  {t('frontend.bulkorder.add_all_to_cart')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BulkOrder
