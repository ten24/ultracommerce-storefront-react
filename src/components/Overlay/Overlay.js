import LoadingOverlay from 'react-loading-overlay-ts'

const Overlay = ({ children, ...props }) => {
  return <LoadingOverlay {...props}>{children}</LoadingOverlay>
}

export { Overlay }
