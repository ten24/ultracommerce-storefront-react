const SwSelect = ({ id, value, onChange, options, disabled, onBlur, required = false }) => {
  return (
    <select
      disabled={disabled}
      className="form-control custom-select"
      id={id}
      name={`['${id}']`}
      value={value}
      required={required}
      placeholder="Enter a valid email address"
      onChange={onChange}
      onBlur={e => {
        e.preventDefault()
        if (onBlur) onBlur(e.target.value)
      }}
    >
      {options &&
        options.map(({ key, name, value }, index) => {
          return (
            <option key={index} value={value}>
              {key || name}
            </option>
          )
        })}
    </select>
  )
}

export { SwSelect }
