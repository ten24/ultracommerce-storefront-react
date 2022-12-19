import { useSelector } from 'react-redux'
import { LanguagePicker } from '../LanguagePicker/LanguagePicker'
import { MultiSitePicker } from '../MultiSitePicker/MultiSitePicker'

const DevTools = () => {
  const enableDevToolsFlag = useSelector(state => state?.configuration?.site?.settings?.siteStorefrontConfig?.enableDevToolsFlag) || false //enableDevToolsFlag
  if (process?.env?.NODE_ENV !== 'development' && !enableDevToolsFlag) return null
  return (
    <>
      <div className="uc-devtools-launcher" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
        <i className="bi bi-wrench uc-devtools-launcher-icon" />
      </div>
      <div className="uc-devtools-menu offcanvas offcanvas-end" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
            Developer Tools
          </h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <p>Here you will fine easy access to common Developer Tools</p>
          <MultiSitePicker />
          <LanguagePicker />
        </div>
      </div>
    </>
  )
}
export { DevTools }
