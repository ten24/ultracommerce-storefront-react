import { useSelector } from 'react-redux'
import { HeartButton, SimpleImage, ProductPrice, Button, ProductImage } from '../../components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getBrandRoute, getProductRoute } from '../../selectors'

const ProductCard = ({ productData, setBulkOrderList, bulkOrderList }) => {
  const { t } = useTranslation()
  const isCartFetching = useSelector(state => state.cart.isFetching)
  const brand = useSelector(getBrandRoute)
  const product = useSelector(getProductRoute)
  const productLink = `/${product}/${productData.urlTitle}` + (productData.skuID.length ? `?skuid=${productData.skuID}` : '')
  const useResizedImage = productData.images && productData.images?.length > 0
  
  return (
    <div className="card p-3 pt-2 h-100">
      {productData.productClearance === true && <span className="badge">{t('frontend.core.special')}</span>}
      <HeartButton skuID={productData.skuID} />
      <Link to={`/${product}/${productData.urlTitle}?skuid=${productData.skuID}`}>
        {useResizedImage && <SimpleImage className="img-fluid card-image-height productImage" src={productData.images[0]} alt={productData.product_productName} type="product" />}
        {!useResizedImage && productData.imagePath && <ProductImage customClass="img-fluid card-image-height" imageFile={productData.imagePath} skuID={productData.skuID} customPath="/" />}
        {!useResizedImage && productData.imageFile && <ProductImage customClass="img-fluid card-image-height" imageFile={productData.imageFile} skuID={productData.skuID} />}
      </Link>
      <div className="card-body">
        <Link to={`/${brand}/${productData.brandUrlTitle}`} className="text-capitalize mb-3" style={{ fontSize: 12 }}>
          {productData.brandName}
        </Link>
        <h2>
          <Link to={productLink} className="product-name d-inline-block w-100">
            {productData.product_productName}
          </Link>
        </h2>
        {!productData.skuCode && productData.productCode && <div className="product-brand">{productData.productCode}</div>}
        {productData.skuCode && <div className="product-brand">{productData.skuCode}</div>}
        <div className="row">
          <div className="col-8">
            <ProductPrice salePrice={productData.salePrice} listPrice={productData.listPrice} className="d-flex" />
          </div>
          <div className="col-4">
            <input
              type="number"
              className="form-control"
              min = {0}
              value={bulkOrderList[productData.sku_skuID] ? bulkOrderList[productData?.sku_skuID].quantity : 0}
              disabled={isCartFetching}
              onChange={e => {
                setBulkOrderList(currentlist => {
                  let qty = 1
                  
                  if (bulkOrderList[productData.sku_skuID]?.quantity) qty = e.target.value
                  
                  if(parseInt(qty) === 0){
                    delete currentlist[productData.sku_skuID]
                    return { ...currentlist}
                  }
                  
                  return { ...currentlist, [productData.sku_skuID]: { quantity: qty, images: productData.images, skuDefinition: productData.skuDefinition, skuCode: productData.skuCode, salePrice: productData.salePrice, productName: productData.product_productName } }
                })
              }}
            />
          </div>
        </div>
      </div>
      <div className="text-center card-footer border-0 bg-transparent pb-3 pt-0">
        <Button
          className="btn btn-primary btn-block my-3"
          label={t('frontend.bulkorder.add_to_list')}
          onClick={e => {
            e.preventDefault()
            setBulkOrderList(currentlist => {
              let qty = 1
              if (bulkOrderList[productData.sku_skuID]?.quantity) qty = bulkOrderList[productData.sku_skuID]?.quantity + 1
              return { ...currentlist, [productData.sku_skuID]: { quantity: qty, images: productData.images, skuDefinition: productData.skuDefinition, skuCode: productData.skuCode, salePrice: productData.salePrice, productName: productData.product_productName } }
            })
          }}
        />
      </div>
    </div>
  )
}

export { ProductCard }
