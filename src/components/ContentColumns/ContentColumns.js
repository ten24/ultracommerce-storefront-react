const ContentColumns = props => {
  const { children, columnsTotal = '12', contentHeading = '', columnWidthMedium = '6', columnWidthLarge = '4', columnWidthSmall = '12' } = props
  return (
    <section className="my-5 content-columns-sec cetColumns">
      {contentHeading?.trim()?.length > 0 && <h3 className="text-center section-title">{contentHeading}</h3>}
      <div className="container">
        <div className=" justify-content-center">
          <div className="grid " style={{ '--bs-columns': columnsTotal }}>
            {children?.map((el, idx) => {
              return (
                <div key={idx} className={`cetColumnsItem g-col-${columnWidthSmall} g-col-md-${columnWidthMedium} g-col-lg-${columnWidthLarge}`}>
                  {el}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export { ContentColumns }
