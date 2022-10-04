import { useTranslation } from 'react-i18next'
import { SlatwalApiService, axios, sdkURL } from '../../services'
import { useFormatCurrency } from '../../hooks/'
import { getProductRoute } from '../../selectors'
import { useDispatch, useSelector } from 'react-redux'
import { requestCart, receiveCart } from '../../actions/'
import { Link } from 'react-router-dom'
import { SimpleImage } from '../../components'
import { toast } from 'react-toastify'
import { getErrorMessage, getFailureMessageOnSuccess } from '../../utils'

const BundleConfig = ({ bundlesOnAccount, productBundleBuildID = null, setBundlesOnAccount }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [formatCurrency] = useFormatCurrency({})
  const productRoute = useSelector(getProductRoute)

  const addtoCart = () => {
    dispatch(requestCart())
    const payload = {
      productBundleBuildID: productBundleBuildID,
      returnJSONObjects: 'cart',
    }

    SlatwalApiService.cart.addProductBundleBuild(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      getFailureMessageOnSuccess(response, getErrorMessage(response.success().messages))
      if (response.isSuccess() && response.success()?.successfulActions.length > 0) {
        toast.success(t('frontend.product.productBundle.bundle_build_added_to_cart'))
        dispatch(receiveCart(response.success().cart))
        setBundlesOnAccount({})
      } else {
        dispatch(receiveCart({}))
      }
    })
  }

  const removeProductBundleBuild = () => {
    const payload = {
      productBundleBuildID: productBundleBuildID,
    }

    SlatwalApiService.products.removeBundleBuild(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success(t('frontend.product.productBundle.bundle_build_deleted'))
        setBundlesOnAccount({})
      }
    })
  }

  const removeProductBundleItem = productBundleBuildItemID => {
    const payload = {
      productBundleBuildItemID: productBundleBuildItemID,
    }

    axios({
      method: 'POST',
      withCredentials: true,
      url: `${sdkURL}api/scope/removeProductBundleBuildItem`,
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response && !response.data?.failureActions.length) {
        let items = Object.values(bundlesOnAccount).filter(item => item.productBundleBuildItemID !== productBundleBuildItemID)
        setBundlesOnAccount(items)
      } else {
        toast.error(t('frontend.product.productBundle.bundle_build_item_deletion_failure'))
      }
    })
  }

  if (!Object.entries(bundlesOnAccount).length) return null
  return (
    <div className="accordion mt-2 mb-2" id={`accordion1`}>
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse1`} aria-expanded="true" aria-controls="collapseOne">
            {t('frontend.product.productBundle.bundle_config')}
          </button>
        </h2>
        <div id={`collapse1`} className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          <div className="accordion-body">
            <div className="d-flex justify-content-end">
              <button className="btn btn-light" onClick={removeProductBundleBuild}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
            <div className="row w-100 mt-2">
              {bundlesOnAccount &&
                Object.entries(bundlesOnAccount).map(([skuID, item], index) => {
                  return (
                    <div className="col-3 d-flex mt-2" key={skuID}>
                      {index !== 0 ? <i className="bi bi-plus-circle col-2 align-self-center"></i> : <div className="col-2"></div>}
                      <div className="card col-10">
                        <i className="bi bi-x-circle position-absolute text-primary" style={{ right: '-5px', top: '-5px' }} onClick={() => removeProductBundleItem(item.productBundleBuildItemID)}></i>
                        <div className="card-body text-center">
                          <Link to={`/${productRoute}/${item.product_urlTitle}`}>
                            <SimpleImage className="img-fluid  m-auto image_container productImage" src={item?.images?.at(0)} alt={item?.product_productName} type="product" />
                          </Link>
                        </div>
                        <div className="card-footer">
                          <p className="text-dark"> {`${formatCurrency(item.salePrice || item.price)} x ${item.quantity}`}</p>
                          <Link to={`/${productRoute}/${item.product_urlTitle}`}>{item?.product_productName}</Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
            <div className="row justify-content-center mt-2">
              <button className="btn btn-dark d-block col-3" onClick={addtoCart}>
                {t('frontend.product.productBundle.add_to_cart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { BundleConfig }
