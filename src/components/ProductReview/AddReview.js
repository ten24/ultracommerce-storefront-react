import { useFormik } from 'formik'
import { Link } from 'react-router-dom'
import { SimpleImage } from '../'
import { toast } from 'react-toastify'
import { SlatwalApiService } from '../../services'
import { useTranslation } from 'react-i18next'
import { getProductRoute } from '../../selectors'
import { getErrorMessage } from '../../utils'
import { useSelector } from 'react-redux'

const possibleRates = [1, 2, 3, 4, 5]
const AddReview = ({ selectedRate, setSelectedRate, hoveredRate, setHoveredRate, sku_product_productID, sku_product_productName, sku_product_urlTitle, sku_skuID, images, showModal, setModal }) => {
  const productRouting = useSelector(getProductRoute)
  const user = useSelector(state => state.userReducer)
  const addProductReview = async values => {
    SlatwalApiService.products
      .addProductReview({
        newProductReview: {
          product: {
            productID: sku_product_productID,
          },
          reviewTitle: formik.values.reviewTitle,
          reviewerName: user.firstName,
          rating: selectedRate,
          review: formik.values.review,
        },
      })
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setModal(false)
          setSelectedRate(0)
          setHoveredRate(0)
          formik.resetForm()
          toast.success(t('frontend.product.review.success'))
        }
      })
  }
  const { t } = useTranslation()
  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      reviewTitle: '',
      review: '',
    },
    initialStatus: { showForm: true, review: '' },
    onSubmit: values => {
      if (selectedRate) {
        addProductReview(values)
      } else {
        toast.error(t('frontend.product.review.validationRating'))
      }
    },
  })
  return (
    <>
      {!formik.status.showForm && <p>{formik.status.message}</p>}
      {formik.status.showForm && (
        <form name="add-review" onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="overAllRating">{t('frontend.product.review.ratingInput')}</label>

                <div>
                  <div className="stars">
                    {possibleRates.map(rate => (
                      <i
                        key={rate}
                        className={'bi bi-star-fill ' + (rate <= selectedRate ? ' text-primary in-rate ' : '') + (rate <= hoveredRate ? ' text-primary in-hover ' : '')}
                        onClick={() => setSelectedRate(rate)}
                        onMouseEnter={() => {
                          setHoveredRate(rate)
                          setSelectedRate(selectedRate)
                        }}
                        onMouseLeave={() => setHoveredRate(selectedRate)}
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="reviewTitle">{t('frontend.product.review.title')}</label>
                <input className="form-control" type="text" id="reviewTitle" value={formik.values.reviewTitle} onChange={formik.handleChange} required />
              </div>
            </div>
            <div className="col-md-8 align-self-center d-flex">
              <div className="col-md-2">
                <Link to={`/${productRouting}/${sku_product_urlTitle}?skuid=${sku_skuID}`} className="mx-auto mr-sm-4">
                  {images && images?.length > 0 && <SimpleImage className="img-fluid  m-auto image_container productImage" src={images?.at(0)} alt={sku_product_productName} style={{ width: '86px', height: '86px' }} type="product" />}
                </Link>
              </div>
              <div className="col-md-10">
                <h3 className="product-title font-size-base mb-2 h5">
                  <Link className="link" to={`/${productRouting}/${sku_product_urlTitle}?skuid=${sku_skuID}`}>
                    {sku_product_productName}
                  </Link>
                </h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="review">{t('frontend.product.review.reviewInput')}</label>
                <textarea className="form-control" type="text" id="review" value={formik.values.review} onChange={formik.handleChange} required />
              </div>
            </div>
          </div>
          <button className="btn btn-primary btn-block mt-2 d-block m-auto">
            <span className="d-none d-sm-inline">{t('frontend.product.review.submit')}</span>
          </button>
        </form>
      )}
    </>
  )
}
export { AddReview }
