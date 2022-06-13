import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { SimpleImage } from '../../'
import { useState } from 'react'
import { addToCart } from '../../../actions/'
import { transformShipping, transformPickup, useFormatCurrency } from '../../../hooks/'
import { getProductRoute } from '../../../selectors/'
import { Modal } from '../..'
import { AddReview } from '../../../components'
import { isAuthenticated } from '../../../utils'
import { axios, sdkURL } from '../../../services'
import { ShippingAddressDetails } from '../../Checkout/Review/ShippingAddressDetails'
import { PickupLocationDetails } from '../../Checkout/Review/PickupLocationDetails'

const OrderItem = ({ quantity, sku_skuID, sku_product_productName, sku_product_urlTitle, images, BrandName, isSeries, ProductSeries, calculatedExtendedPriceAfterDiscount, sku_calculatedSkuDefinition, sku_imageFile, price, sku_product_productID, files, showActions = true }) => {
  const [formatCurrency] = useFormatCurrency({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const productRouting = useSelector(getProductRoute)
  const [showModal, setModal] = useState(false)
  const [selectedRate, setSelectedRate] = useState(0)
  const [hoveredRate, setHoveredRate] = useState(0)

  return (
    <div className="row border-bottom py-3">
      <div className="col-sm-2 col-3">
        <Link to={`/${productRouting}/${sku_product_urlTitle}?skuid=${sku_skuID}`} className="mx-auto mr-sm-4">
          {images && images?.length > 0 && <SimpleImage className="img-fluid  m-auto image_container productImage" src={images[0]} alt={sku_product_productName} type="product" />}
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
        {files && files.length > 0 && isAuthenticated() && (
          <div>
            {files
              .filter(file => file.baseID === sku_product_productID)
              .map(file => (
                <span
                  className="link-primary pe-auto text-decoration-underline"
                  key={file.file_fileID}
                  onClick={e => {
                    e.preventDefault()

                    axios({
                      method: 'POST',
                      url: `${sdkURL}api/scope/downloadFile?fileID=${file.file_fileID}`,
                      responseType: 'blob', // had to add this one here
                    }).then(response => {
                      const url = window.URL.createObjectURL(new Blob([response.data]))
                      const link = document.createElement('a')
                      link.href = url
                      link.setAttribute('download', `${file.file_fileName}.${file.file_fileType}`)
                      document.body.appendChild(link)
                      link.click()
                    })
                  }}
                >
                  {t('frontend.cart.download')}
                </span>
              ))}
          </div>
        )}
      </div>
      <div className="col-sm-12 col-md-6 d-none d-sm-block">
        <div className="row">
          <div className="col-sm-3">
            <span className="d-block">{`${formatCurrency(price)}`}</span>
            <span className="d-block">{/* <span className="text-muted mr-2">{`($${listPrice} list)`}</span> */}</span>
            {/* <!--- each / list price ---> */}
          </div>
          <div className="col-sm-3">
            <small>{t('frontend.cart.quantity')}</small> {quantity}
          </div>
          <div className="col-sm-6">
            <div className="row">
              <div className="col-12">
                {formatCurrency(calculatedExtendedPriceAfterDiscount)}
                {/* <!--- total ---> */}
              </div>
            </div>
            {isAuthenticated() && showActions && (
              <div className="row">
                <div className="col-12">
                  <button
                    className="link-button"
                    onClick={event => {
                      event.preventDefault()
                      setModal(!showModal)
                    }}
                  >
                    {t('frontend.cart.writeReview')}
                  </button>
                </div>
              </div>
            )}
            {showActions && (
              <div className="row">
                <div className="col-12">
                  <button
                    className="link-button"
                    onClick={event => {
                      event.preventDefault()
                      dispatch(addToCart(sku_skuID, quantity))
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      })
                    }}
                  >
                    {t('frontend.cart.reOrder')}
                  </button>
                </div>
              </div>
            )}
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

const OrderShipments = ({ shipments, files }) => {
  const { t } = useTranslation()
  return (
    <div className="order-items mr-3">
      {shipments &&
        shipments.map((shipment, index) => {
          return (
            <div className="card mb-4" key={index}>
              <div className="card-header bg-secondary text-light">
                <div className="row">
                  <div className="col-sm-6">{`Shipment ${index + 1} of ${shipments.length}`}</div>
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
                  shipment.orderItems.map((item, index) => {
                    return <OrderItem key={index} {...item} files={files} />
                  })}
              </div>
            </div>
          )
        })}
    </div>
  )
}

const OrderFulfilments = ({ fulfilments, files }) => {
  const { t } = useTranslation()
  return (
    <div className="order-items mr-3">
      {fulfilments &&
        fulfilments.map((fulfilment, index) => {
          return (
            <div className="card mb-4" key={index}>
              <div className="card-header bg-secondary text-light">
                <div className="row">
                  <div className="col-sm-6">{`${t('frontend.checkout.fulfillment')} ${index + 1} of ${fulfilments.length}: ${fulfilment.orderFulfillmentMethodName}`}</div>
                  {fulfilment.trackingNumbers.length > 0 && <div className="col-sm-6 text-right">{`Tracking: ${fulfilment.trackingNumbers.join(', ')}`}</div>}
                </div>
              </div>

              {fulfilment.fulfillmentMethodType === 'shipping' && (
                <div className="card-header ">
                  <div className="row">
                    <ShippingAddressDetails className="" orderFulfillment={{ shippingAddress: transformShipping(fulfilment.orderFulfillmentItems.at(0)) }} displayOnly={true} />
                  </div>
                </div>
              )}
              {fulfilment.fulfillmentMethodType === 'pickup' && (
                <div className="card-header ">
                  <div className="row">
                    <PickupLocationDetails className="" pickupLocation={transformPickup(fulfilment.orderFulfillmentItems.at(0))} displayOnly={true} />{' '}
                  </div>
                </div>
              )}

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
                {fulfilment.orderFulfillmentItems &&
                  fulfilment.orderFulfillmentItems.map(item => {
                    return <OrderItem key={item.orderItemID} {...item} files={files} />
                  })}
              </div>
            </div>
          )
        })}
    </div>
  )
}

export { OrderShipments, OrderFulfilments, OrderItem }
