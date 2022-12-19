import { SWImage } from '../SWImage/SWImage'
import { Spinner } from '../Spinner/Spinner'
const ProductTypeList = ({ data, onSelect, isFetching = true }) => {
  return (
    <>
      {isFetching && (
        <div className="container bg-light box-shadow-lg rounded-lg p-5">
          <Spinner />
        </div>
      )}
      {!isFetching && data.childProductTypes && data.childProductTypes?.length > 0 && (
        <div className="container pb-4 pb-sm-5">
          <div className="row pt-5">
            {data.childProductTypes
              .sort((a, b) => (a.productTypeName > b.productTypeName ? 1 : -1))
              .map(({ productTypeID, productTypeName, imageFile, urlTitle, childProductTypes }) => {
                let customImagePath = ''
                let imageFileName = ''
                if (imageFile !== '') {
                  imageFileName = imageFile.split('/').reverse()?.at(0)
                  customImagePath = imageFile.split('/').slice(0, -1).join('/') + '/'
                }

                return (
                  <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3" key={productTypeID}>
                    <div className="card border-0">
                      <div
                        className="d-block overflow-hidden rounded-lg"
                        onClick={e => {
                          e.preventDefault()
                          onSelect(urlTitle)
                        }}
                      >
                        <SWImage className="d-block w-100" customPath={customImagePath} src={imageFileName} alt={productTypeName} type="productType" />
                      </div>
                      <div className="card-body">
                        <h2 className="h5">
                          <button
                            className="link-button"
                            onClick={e => {
                              e.preventDefault()
                              onSelect(urlTitle)
                            }}
                          >
                            {productTypeName}
                          </button>
                        </h2>
                        <ul className="list-unstyled font-size-sm mb-0">
                          {childProductTypes
                            .sort((a, b) => (a.productTypeName > b.productTypeName ? 1 : -1))
                            .map(({ productTypeID, productTypeName, urlTitle }) => {
                              return (
                                <li className="d-flex align-items-center justify-content-between" key={productTypeID}>
                                  <button
                                    className="link-button nav-link-style d-flex align-items-center justify-content-between text-left"
                                    onClick={e => {
                                      e.preventDefault()
                                      onSelect(urlTitle)
                                    }}
                                  >
                                    <i className="bi bi-chevron-circle-right pr-2"></i>
                                    {productTypeName}
                                  </button>
                                </li>
                              )
                            })}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </>
  )
}
export { ProductTypeList }
