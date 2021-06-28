const AccountToolBar = ({ term, updateTerm, search }) => {
  return (
    <div className="d-flex justify-content-between align-items-center pt-lg-2 pb-4 pb-lg-3">
      <div className="d-flex justify-content-between w-100">
        <div className="input-group-overlay d-lg-flex me-3 w-50">
          <input
            className="form-control appended-form-control"
            type="text"
            value={term}
            onChange={event => {
              event.preventDefault()
              updateTerm(event.target.value)
            }}
            placeholder="Search item #, order #, or PO"
          />
          <div className="input-group-append-overlay ms-1 mt-1">
            <span className="input-group-text">
              <i
                className="bi bi-search"
                style={{ cursor: 'pointer' }}
                onClick={event => {
                  event.preventDefault()
                  search()
                }}
              />
            </span>
          </div>
        </div>
        {/* <a href="##" className="btn btn-outline-secondary">
          <i className="far fa-file-alt mr-2"></i> {t('frontend.account.request_statement')}
        </a> */}
      </div>
    </div>
  )
}

export { AccountToolBar }
