import { SWImage } from '..'
const BrandBanner = ({ brandName = '', imageFile, brandDescription, subHeading }) => {
  return (
    <div className="container-fluid bg-light p-2 px-lg-5 py-lg-4 d-flex flex-column justify-content-center">
      <div className="row px-lg-3 py-auto">
        <div className="col-xs-12 col-sm-4 col-md-3 col-lg-2 text-center">
          <SWImage style={{ maxHeight: '125px', border: '1px solid #dee2e6', background: '#fff' }} customPath="/custom/assets/images/brand/logo/" src={imageFile} alt={brandName} />
        </div>
        <div className="col-xs-12 col-sm-8 col-md-6 col-lg-8 d-flex flex-column justify-content-center">
          <div className="row text-left">
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
