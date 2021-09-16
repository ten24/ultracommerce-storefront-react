import { useTranslation } from 'react-i18next'

/**
 * Primary UI component for user interaction
 */
const Button = ({ disabled = false, classList = 'btn btn-primary btn-block', isLoading = false, children, label, onClick }) => {
  const { t } = useTranslation()
  return (
    <button type="button" disabled={disabled} className={classList} onClick={onClick}>
      {isLoading && <span className="spinner-border spinner-border-sm mx-2" role="status" aria-hidden="true" />}
      {children && children}
      {!children && t(label)}
    </button>
  )
}
export { Button }
