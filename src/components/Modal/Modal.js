import React from 'react'

const sizes = {
  default: '',
  small: 'modal-sm',
  large: 'modal-lg',
  xLarge: 'modal-xl',
}

const Modal = ({ show = true, setShow, title = 'Modal Title', children, size = 'default', footer = false }) => {
  return (
    <div className="modal" tabIndex="-1" aria-modal="true" role="dialog" style={{ display: show ? 'inline' : 'none' }} onClick={() => setShow(false)}>
      <div className={'modal-dialog modal-dialog-centered ' + sizes[size]} onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShow(false)}></button>
          </div>
          <div className="modal-body">{children}</div>
          {footer && (
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShow(false)}>
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { Modal }
