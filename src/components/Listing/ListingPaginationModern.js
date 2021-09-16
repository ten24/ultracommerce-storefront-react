import { useTranslation } from 'react-i18next'

const ListingPaginationModern = ({ currentPage = 1, setPage, count = 0 }) => {
  const { t } = useTranslation()
  currentPage = parseInt(currentPage)

  return (
    <nav className="d-flex justify-content-between pt-2" aria-label="Page navigation">
      <ul className="mx-auto pagination">
        {currentPage > 1 && (
          <li className="page-item">
            <div
              className="page-link clickable"
              aria-label="Previous"
              onClick={evt => {
                evt.preventDefault()
                setPage(currentPage - 1)
              }}
            >
              <span aria-hidden="true" className="me-1">
                &laquo;
              </span>
              <span className="sr-only">{t('frontend.pagination.previous')}</span>
            </div>
          </li>
        )}
        <li className="page-item">
          <span className="paginationTxtClr">{currentPage}</span>
        </li>

        {count === 12 && (
          <li className="page-item">
            <div
              className="page-link clickable"
              aria-label="Next"
              onClick={evt => {
                evt.preventDefault()
                setPage(currentPage + 1)
              }}
            >
              <span className="sr-only">{t('frontend.pagination.next')}</span>
              <span aria-hidden="true" className="ms-1">
                &raquo;
              </span>
            </div>
          </li>
        )}
      </ul>
    </nav>
  )
}

export { ListingPaginationModern }
