import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { processQueryParameters } from '../../utils'

const ListingToolBar = ({ sorting, orderBy, setSort, recordsCount }) => {
  const loc = useLocation()
  const { t } = useTranslation()
  const qs = processQueryParameters(loc.search)
  if (qs.orderBy) {
    orderBy = qs.orderBy
  }
  let dropdownLabel = []
  if (sorting) {
    dropdownLabel = sorting.options.filter(data => data.value === orderBy)
  }
  return (
    <div className="d-flex flex-row align-items-center justify-content-between">
      <div className="col-6">
        <h6>
          <strong>{recordsCount}</strong>
          {t('frontend.product.availableProducts')}
        </h6>
      </div>
      <div className="text-right">
        <div className="btn-group">
          <button type="button" className="btn btn-secondary dropdown-toggle text-white" data-bs-toggle="dropdown" aria-expanded="false">
            {orderBy === '' ? 'Sort By' : dropdownLabel.length > 0 && dropdownLabel[0].name}
          </button>
          <ul className="dropdown-menu dropdown-menu-end" value={orderBy}>
            {sorting &&
              sorting.options &&
              sorting.options.length > 1 &&
              sorting.options.map(({ name, value }) => {
                return (
                  <li
                    key={name}
                    onClick={() => {
                      setSort(value)
                    }}
                    className={dropdownLabel.length && dropdownLabel[0].name === name ? 'dropdown-item active' : 'dropdown-item'}
                  >
                    {name}
                  </li>
                )
              })}
          </ul>
        </div>
      </div>
    </div>
  )
}
export { ListingToolBar }
