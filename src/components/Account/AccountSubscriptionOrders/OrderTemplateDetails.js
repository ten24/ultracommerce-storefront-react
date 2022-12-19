import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { SimpleImage } from '../../'
import { useState } from 'react'
import { useFormatCurrency } from '../../../hooks/'
import { getProductRoute } from '../../../selectors/'
import { Modal } from '../..'
import { toast } from 'react-toastify'
import { AddReview } from '../../../components'
import { SlatwalApiService } from '../../../services'
import { getErrorMessage } from '../../../utils'

const OrderTemplateItem = ({ isDisabled = false, templateID, quantity, sku_skuID, sku_product_productName, orderTemplateItemID, sku_product_urlTitle, images, BrandName, isSeries, ProductSeries, listPrice, sku_calculatedSkuDefinition, sku_imageFile, calculatedFulfillmentTotal, calculatedSubTotal, sku_product_productID }) => {
  const [formatCurrency] = useFormatCurrency({})
  const { t } = useTranslation()
  const productRouting = useSelector(getProductRoute)
  const [showModal, setModal] = useState(false)
  const [itemCount, setItemCount] = useState(quantity)
  const [selectedRate, setSelectedRate] = useState(0)
  const [hoveredRate, setHoveredRate] = useState(0)
  const updateOrderTemplateItemQuantity = values => {
    SlatwalApiService.orderTemplate.editOrderTemplateItem({ orderTemplateItemID: values.orderTemplateItemID, orderTemplateID: templateID, quantity: values.itemCount }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success(t('frontend.account.scheduled.delivery.detail.toolbar.subscriptionModal.successMessage'))
      } else {
        toast.error(t('frontend.core.error.network'))
      }
    })
  }

  return (
    <div className="row border-bottom py-3">
      <div className="col-sm-2 col-3">
        <Link to={`/${productRouting}/${sku_product_urlTitle}?skuid=${sku_skuID}`} className="mx-auto mr-sm-4">
          {images && images?.length > 0 && <SimpleImage className="img-fluid  m-auto image_container productImage" src={images?.at(0)} alt={sku_product_productName} type="product" />}
        </Link>
      </div>
      <div className="col-sm-4 col-9">
        {isSeries && <span className="product-meta d-block font-size-xs pb-1">{ProductSeries}</span>}
        {/* <!--- only show this span if part of a bundled product? ---> */}
        <h3 className="product-title font-size-base mb-2 h5">
          <Link className="link" to={`/${productRouting}/${sku_product_urlTitle}?skuid=${sku_skuID}`}>
            {sku_product_productName}
          </Link>
        </h3>
        {/* <!--- product title ---> */}
        <div className=" font-size-sm">
          {BrandName} <span className="text-muted mr-2">{sku_calculatedSkuDefinition}</span>
        </div>
        {/* <!--- brand / sku ---> */}
      </div>
      <div className="col-sm-12 col-md-6 d-none d-sm-block">
        <div className="row">
          <div className="col-sm-3">
            <span className="d-block">{`${formatCurrency(listPrice)}`}</span>
          </div>

          {!isDisabled ? (
            <>
              <div className="col-sm-3">
                <input
                  type="number"
                  className="form-control"
                  value={itemCount}
                  disabled={!sku_skuID}
                  onChange={e => {
                    setItemCount(e.target.value)
                  }}
                />
                <button
                  className="btn text-muted btn-link p-1 text-end"
                  onClick={() => {
                    updateOrderTemplateItemQuantity({ orderTemplateItemID, itemCount })
                  }}
                >
                  {t('frontend.account.scheduled.delivery.history.updateQuantity')}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="col-sm-3">
                <small>{t('frontend.cart.quantity')}</small> {quantity}
              </div>
            </>
          )}
          <div className="col-sm-6">
            <div className="row">
              <div className="col-12">
                {formatCurrency(itemCount * listPrice)}
                {/* <!--- total ---> */}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <button
                  className="btn btn-link p-1"
                  onClick={event => {
                    event.preventDefault()
                    setModal(!showModal)
                  }}
                >
                  {t('frontend.cart.writeReview')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} setShow={setModal} title={t('frontend.product.review.heading')} modalClass="addReviewModal" size="large">
        <div className="container">
          <AddReview setModal={setModal} showModal={showModal} selectedRate={selectedRate} setSelectedRate={setSelectedRate} hoveredRate={hoveredRate} setHoveredRate={setHoveredRate} sku_product_productID={sku_product_productID} sku_product_productName={sku_product_productName} sku_product_urlTitle={sku_product_urlTitle} sku_skuID={sku_skuID} images={images} />
        </div>
      </Modal>
    </div>
  )
}

const OrderTemplateDetails = ({ orderItems, templateID }) => {
  const { t } = useTranslation()
  return (
    <div className="order-items mr-3">
      {orderItems &&
        orderItems.map((shipment, index) => {
          return (
            <div className="card mb-4" key={index}>
              <div className="card-header bg-secondary text-light">
                <div className="row">
                  <div className="col-sm-6">{`Shipment ${index + 1} of ${orderItems.length}`}</div>
                  {shipment.trackingNumber && (
                    <div className="col-sm-6 text-right">
                      {'Tracking Number: '}
                      <a href="/#to-shipper" target="_blank">
                        {shipment.trackingNumber}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-header">
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <h4 className="mb-0">{t('frontend.cart.orderItem')}</h4>
                  </div>
                  <div className="col-sm-12 col-md-6 d-none d-md-block">
                    <div className="row">
                      <div className="col-sm-3">
                        <small>{t('frontend.product.price')}</small>
                      </div>
                      <div className="col-sm-3">
                        <small>{t('frontend.cart.quantity')}</small>
                      </div>
                      <div className="col-sm-6">
                        <small>{t('frontend.cart.total')}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body py-0">
                {shipment.orderItems &&
                  shipment.orderItems.map(item => {
                    return <OrderTemplateItem key={item.orderTemplateItemID} templateID={templateID} {...item} />
                  })}
              </div>
            </div>
          )
        })}
    </div>
  )
}

export { OrderTemplateDetails }
