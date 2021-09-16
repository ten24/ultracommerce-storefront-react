const SwRadioSelect = ({ label, onChange, options = [], selectedValue }) => {
  return (
    <div className="form-group">
      {/* don't pass label for custom label */}
      {label && (
        <>
          <label className="w-100 h4">{label}</label>
          {/* <hr />
          <br /> */}
        </>
      )}

      <div className="d-flex flex-column">
        {options.length > 0 &&
          options.map(({ value, name, code }) => {
            return (
              <div key={value} className="form-check form-check-inline custom-control custom-radio align-items-center d-inline-flex" style={{ zIndex: 0 }}>
                <input className="custom-control-input" type="radio" id={code || value} value={value} onChange={e => onChange(e.target.value)} checked={selectedValue === value} />
                <label
                  className="my-1 ms-2 custom-control-label"
                  htmlFor={code || value}
                  onClick={() => {
                    onChange(value)
                  }}
                  style={{ letterSpacing: '1.1' }}
                >
                  {name}
                </label>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export { SwRadioSelect }
