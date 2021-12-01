const SwSelect = ({ id, value, onChange, options, disabled, onBlur }) => {
  return (
    <select
      disabled={disabled}
      className="form-control custom-select"
      id={id}
      name={`['${id}']`}
      value={value}
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
