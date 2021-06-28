const ProductPageHeader = ({ title = '', children }) => {
  return (
    <div className="bg-light">
      <div className="container d-flex justify-content-between align-items-center py-3">
        {/* <div className="order-lg-1 pr-lg-4 text-center text-lg-left">
          <h2 className="h5 m-0">{title}</h2>
        </div> */}
        <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">{children}</div>
      </div>
    </div>
  )
}

export { ProductPageHeader }
