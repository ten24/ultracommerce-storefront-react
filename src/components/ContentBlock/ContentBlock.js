import React from 'react'
const ContentBlock = ({ list = [], title = {} }) => {
  if (!list || !list.items || list.items.length === 0) {
    return null
  }
  return (
    <div className="d-flex p-4 bg-light bg-gradient">
      <span className="bg-icon pt-2">
        <i className="bi bi-tags fs-5 "></i>
      </span>
      <div className="flex-1">
        <h3 className="mb-4 mt-1 fw-light">{title}</h3>
        {list.items.map(({ customBody }) => {
          return (
            <>
              {typeof customBody === 'string' && <div dangerouslySetInnerHTML={{ __html: customBody }} />}
              {typeof customBody !== 'string' && <div>{customBody}</div>}
            </>
          )
        })}
      </div>
    </div>
  )
}

export { ContentBlock }
