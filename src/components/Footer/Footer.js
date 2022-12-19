const Footer = props => {
  const { children } = props
  const ribbons = children?.filter(child => child.props.el.contentElementTypeCode === 'cetRibbon')
  const copyrights = children?.filter(child => child.props.el.contentElementTypeCode === 'cetCopyright')
  const contentStack = children?.filter(child => !['cetRibbon', 'cetCopyright'].includes(child.props.el.contentElementTypeCode))
  return (
    <footer className="footer no-print">
      <div className="container pt-3">
        <div className="uc-grid pt-2">{contentStack}</div>
      </div>
      {copyrights}
      {ribbons}
    </footer>
  )
}

export { Footer }
