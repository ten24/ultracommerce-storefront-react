import { useTranslation } from 'react-i18next'
import { viewModes } from './constants'

const ListingViewToggle = ({ config, viewMode, setViewMode }) => {
  const { t } = useTranslation()
  return (
    <ul className="nav nav-pills mb-3 justify-content-end" id="pills-tab" role="tablist">
      {config?.viewModeOptions?.length > 1 &&
        config?.viewModeOptions?.map(key => {
          if (!viewModes[key]) return null
          return (
            <li key={key} className="nav-item border" role="presentation">
              <button className={`nav-link ${viewMode === key ? 'active' : ''}`} id="pills-home-tab" data-bs-toggle="pill" type="button" onClick={() => setViewMode(key)}>
                {t(viewModes[key].name)}
              </button>
            </li>
          )
        })}
    </ul>
  )
}
export { ListingViewToggle }
