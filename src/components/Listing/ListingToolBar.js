import { useLocation } from 'react-router-dom'
import { processQueryParameters } from '../../utils'

const ListingToolBar = ({ sorting, orderBy, setSort, recordsCount }) => {
  const loc = useLocation()
  const qs = processQueryParameters(loc.search)
  if (qs.orderBy) {
    orderBy = qs.orderBy
  }
  let dropdownLabel = []
  if (sorting) {
    dropdownLabel = sorting.options.filter(data => data.value === orderBy)
  }
  if (recordsCount < 1) return null

  return (
    <div className="d-flex justify-content-end sort-options">
      <div className="text-right">
        <div className="btn-group">
          <button type="button" className="btn btn-secondary dropdown-toggle text-white" data-bs-toggle="dropdown" aria-expanded="false">
            {dropdownLabel.length > 0 ? dropdownLabel?.at(0).name : sorting?.name ? sorting.name : 'Sort By'}
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
                    className={dropdownLabel.length && dropdownLabel?.at(0).name === name ? 'dropdown-item active' : 'dropdown-item'}
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
