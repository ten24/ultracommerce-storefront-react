const ContentColumns = ({ children, title }) => {
  return (
    <>
      <header className="section-title">{title && <h2>{title}</h2>} </header>
      <div className="container">{children}</div>
    </>
  )
}

export { ContentColumns }
