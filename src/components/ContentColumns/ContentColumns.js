const ContentColumns = props => {
  const { children, title } = props
  return (
    <section className="my-5 py-5 content-columns-sec">
      {title?.trim()?.length > 0 && (
        <header className="section-title">
          <h2>{title}</h2>
        </header>
      )}
      <div className="container">
        <div className="row justify-content-center">
          {children?.map((el, idx) => {
            return (
              <div key={idx} className={`col-lg-${12 / children.length} pr-4-lg`}>
                {el}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { ContentColumns }
