import { SimpleImage } from '..'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
const BrandBanner = ({ brandName = '', images, imageFile, brandDescription, subHeading }) => {
  const { t } = useTranslation()
  return (
    <div className="container-fluid bg-light p-2 px-lg-5 py-lg-4 d-flex flex-column justify-content-center">
      <div className="row px-lg-3 py-auto">
        <div className="col-xs-12 col-sm-4 col-md-3 col-lg-2 text-center">{images && <SimpleImage src={images[0]} alt={brandName} style={{ maxHeight: '125px', border: '1px solid #dee2e6', background: '#fff' }} type="brand" />}</div>
        <div className="col-xs-12 col-sm-8 col-md-6 col-lg-8 d-flex flex-column justify-content-center">
          <div className="row text-left">
            <Link className="text-uppercase small" to="/brands">
              {t('frontend.product.shopByBrand')}
            </Link>
            <h2 className="display-6 align-content-start m-0">{brandName}</h2>
            {!!subHeading && <h3 className="h5 text-secondary m-0">{subHeading}</h3>}
          </div>

          <div className="row text-left">
            <span className="mb-0 mt-2" dangerouslySetInnerHTML={{ __html: brandDescription }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export { BrandBanner }
