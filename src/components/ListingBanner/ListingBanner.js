import { SimpleImage, BreadCrumb } from '..'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
const ListingBanner = ({ heading = '', crumbs, images, description, subHeading, type = 'brand' }) => {
  const { t } = useTranslation()
  return (
    <div className="container-fluid bg-light p-2 px-lg-5 py-lg-4 d-flex flex-column justify-content-center">
      <div className="row px-lg-3 py-auto">
        <div className="col-xs-12 col-sm-4 col-md-3 col-lg-2 text-center">{images && <SimpleImage src={images?.at(0)} alt={heading} style={{ maxHeight: '125px', border: '1px solid #dee2e6', background: '#fff' }} type={type} />}</div>
        <div className="col-xs-12 col-sm-8 col-md-6 col-lg-8 d-flex flex-column justify-content-center">
          <div className="row text-left">
            {type === 'brand' && (
              <Link className="text-uppercase small" to="/brands">
                {t('frontend.product.shopByBrand')}
              </Link>
            )}

            <h2 className="display-6 align-content-start m-0">{heading}</h2>
            {!!subHeading && <h3 className="h5 text-secondary m-0">{subHeading}</h3>}
          </div>

          <div className="row text-left">
            <span className="mb-0 mt-2" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>
      </div>
      {crumbs && (
        <div className="row p-4">
          <div className="col-xs-12 col-sm-4 col-md-3 col-lg-2 text-center">
            <BreadCrumb crumbs={crumbs} />
          </div>
        </div>
      )}
    </div>
  )
}

export { ListingBanner }
