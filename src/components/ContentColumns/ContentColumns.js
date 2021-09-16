const ContentColumns = ({ children, title }) => {
  return (
    <section className="mb-5 pb-5">
      <header className="section-title">{title && <h2>{title}</h2>} </header>
      <div className="container">{children}</div>
    </section>
  )
}

export { ContentColumns }
