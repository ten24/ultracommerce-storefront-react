import { SlatwalApiService } from '../../services'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getProductRoute } from '../../selectors'
import { ProductPrice, SimpleImage, ListingPagination } from '../../components'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getErrorMessage, getFailureMessageOnSuccess } from '../../utils'

const BundleItem = ({ bundleItem, totalSkuCount, minValue, maxValue, defaultSkuID, productBundleGroupID, bundlesOnAccount, setBundleBuildsOnAccount }) => {
  const productRouting = useSelector(getProductRoute)
  const [quantity, setQuantity] = useState(0)
  const { t } = useTranslation()

  useEffect(() => {
    setQuantity(bundlesOnAccount[bundleItem['skuID']]?.quantity || 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundlesOnAccount])

  const addBundleBuild = () => {
    if (quantity === 0) return

    const payload = {
      skuIDList: bundleItem.skuID,
      quantities: quantity,
      defaultSkuID: defaultSkuID,
      productBundleGroupID: productBundleGroupID,
    }

    SlatwalApiService.products.createBundleBuild(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      getFailureMessageOnSuccess(response, getErrorMessage(response.success().messages))
      if (response.isSuccess() && response.success()?.successfulActions.length > 0) {
        toast.success(t('frontend.product.productBundle.bundle_build_created'))
        if (response.success()?.data?.productBundleBuildOnAccount) setBundleBuildsOnAccount(response.success().data.productBundleBuildOnAccount)
      }
    })
  }

  return (
    <div className="row border-bottom py-3">
      <div className="col-sm-2 col-3">{bundleItem.images && bundleItem.images?.length > 0 && <SimpleImage className="img-fluid  m-auto image_container productImage border border-light" src={bundleItem.images?.at(0)} alt={bundleItem.product_productName} type="product" />}</div>
      <div className="col-sm-4 col-9">
        <h5>
          <Link
            to={{
              pathname: `/${productRouting}/${bundleItem?.product_urlTitle}`,
              state: { ...bundleItem.product },
            }}
            className="link"
          >
            {bundleItem.product_productName}
          </Link>
        </h5>
        <div className="font-size-sm">
          <span className="text-muted mr-2"> {bundleItem?.product_brand_brandName}</span>
        </div>
        <div className="font-size-sm">
          <span className="text-muted mr-2">{bundleItem.skuCode}</span>
        </div>
      </div>
      <div className="col-sm-3">
        <ProductPrice type="cart" salePrice={bundleItem.price} salePriceSuffixKey="frontend.core.each" accentSalePrice={false} />
      </div>
      <div className="col-sm-3">
        <div className="row m-2">
          <div className="col-sm-6">
            <small>{t('frontend.cart.quantity')}</small>
            <input
              type="number"
              className="form-control"
              value={quantity}
              onChange={e => {
                e.preventDefault()
                if (e.target.value < 0) return

                if (e.target.value > maxValue) return
                if (e.target.value < minValue) e.target.value = minValue

                setQuantity(e.target.value)
              }}
            />
          </div>
        </div>
        <div className="row justify-content-center m-2">
          <button
            className="w-100 btn btn-primary d-block col-3"
            onClick={e => {
              e.preventDefault()
              addBundleBuild()
            }}
          >
            {t('frontend.product.productBundle.add_to_bundle')}
          </button>
        </div>
      </div>
    </div>
  )
}

const ProductBundleItems = ({ productBundleItem, productID, bundlesOnAccount, setBundleBuildsOnAccount }) => {
  const { t } = useTranslation()
  const [productItems, setProductItems] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(productItems?.totalSkuCount / 10)
  const [isOpen, setIsOpen] = useState(false)

  const getProductBundles = (productBundleGroupID, currentPage) => {
    const payload = {
      productBundleGroupID: productBundleGroupID,
      productID: productID,
      currentPage: currentPage,
      pageRecordsShow: 10,
    }

    SlatwalApiService.products.getBundles(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      getFailureMessageOnSuccess(response, getErrorMessage(response.success().messages))
      if (response.isSuccess() && response.success()?.successfulActions.length > 0) {
        if (response.success()?.data) {
          setProductItems(response.success().data?.at(0))
        }
      }
    })
  }
  return (
    <div className="accordion mt-2 mb-2" id={`accordion_${productBundleItem.productBundleGroupID}`} key={productBundleItem.productBundleGroupID}>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#collapse_${productBundleItem.productBundleGroupID}`}
            aria-expanded="false"
            aria-controls="collapseOne"
            onClick={() => {
              setIsOpen(!isOpen)
              if (!isOpen && !productItems) getProductBundles(productBundleItem.productBundleGroupID)
            }}
          >
            {productBundleItem?.bundleType} : {productBundleItem?.minimumQuantity === productBundleItem?.maximumQuantity ? t('frontend.product.productBundle.select_count_products', { count: `${productBundleItem?.minimumQuantity}` }) : t('frontend.product.productBundle.select_min_max_products', { min: `${productBundleItem?.minimumQuantity}`, max: `${productBundleItem?.maximumQuantity}` })}
          </button>
        </h2>
        <div id={`collapse_${productBundleItem.productBundleGroupID}`} className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordion_${productBundleItem.productBundleGroupID}`}>
          <div className="accordion-body">
            {productItems?.skuList?.map(item => {
              return <BundleItem key={item.skuID} bundleItem={item} totalSkuCount={productItems.totalSkuCount} minValue={productItems.minimumQuantity} maxValue={productItems.maximumQuantity} defaultSkuID={productItems.defaultSkuID} productBundleGroupID={productItems.productBundleGroupID} bundlesOnAccount={bundlesOnAccount} setBundleBuildsOnAccount={setBundleBuildsOnAccount} />
            })}

            <ListingPagination
              recordsCount={productItems?.totalSkuCount}
              currentPage={currentPage}
              totalPages={totalPages}
              setPage={page => {
                setCurrentPage(page)
                getProductBundles(productBundleItem.productBundleGroupID, page)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export { ProductBundleItems }
