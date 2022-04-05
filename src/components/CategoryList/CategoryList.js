import { SimpleImage } from '../SWImage/SWImage'
import { Spinner } from '../Spinner/Spinner'
const CategoryList = ({ data, onSelect, isFetching = true }) => {
  return (
    <>
      {isFetching && (
        <div className="container bg-light box-shadow-lg rounded-lg p-5">
          <Spinner />
        </div>
      )}
      {!isFetching && data.children && data.children?.length > 0 && (
        <div className="container pb-4 pb-sm-5">
          <div className="row pt-5">
            {data.children
              .sort((a, b) => (a.categoryName > b.categoryName ? 1 : -1))
              .map(cat => {
                return (
                  <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3" key={cat.categoryID}>
                    <div className="card border-0">
                      <div
                        className="d-block overflow-hidden rounded-lg"
                        onClick={e => {
                          e.preventDefault()
                          onSelect(cat.urlTitle)
                        }}
                      >
                        <SimpleImage className="d-block w-100" src={''} alt={cat.categoryName} type="category" />
                      </div>
                      <div className="card-body">
                        <h2 className="h5">
                          <button
                            className="link-button"
                            onClick={e => {
                              e.preventDefault()
                              onSelect(cat.urlTitle)
                            }}
                          >
                            {cat.categoryName}
                          </button>
                        </h2>
                        <ul className="list-unstyled font-size-sm mb-0">
                          {cat.children
                            .sort((a, b) => (a.categoryName > b.categoryName ? 1 : -1))
                            .map(cat => {
                              return (
                                <li className="d-flex align-items-center justify-content-between" key={cat.categoryID}>
                                  <button
                                    className="link-button nav-link-style d-flex align-items-center justify-content-between text-left"
                                    onClick={e => {
                                      e.preventDefault()
                                      onSelect(cat.urlTitle)
                                    }}
                                  >
                                    <i className="bi bi-chevron-circle-right pr-2"></i>
                                    {cat.categoryName}
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
export { CategoryList }
