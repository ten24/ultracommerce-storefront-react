import { useState } from 'react'
import { useUtilities } from '../../hooks'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSelector } from 'react-redux'
import { getErrorMessage, toBoolean } from '../../utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import axios from 'axios'
const sdkURL = process.env.REACT_APP_API_URL

const FormRow = ({ children }) => {
  return <div className="row py-2">{children}</div>
}

const FormCol = ({ children }) => {
  return <div className="col">{children}</div>
}

const FormTextField = ({ attributeName, attributeCode, requiredFlag, setValue, value = '', inputType, row = 5, invalid, validationMessage }) => {
  return (
    <>
      <label htmlFor={attributeCode} className={`form-label ${requiredFlag ? 'required' : ''}`}>
        {attributeName}
      </label>
      {inputType !== 'textArea' && (
        <input
          className={'form-control' + (invalid ? ' is-invalid' : '')}
          id={attributeCode}
          type={inputType}
          value={value}
          onChange={e => {
            setValue(response => {
              return {
                ...response,
                [attributeCode]: e.target.value,
              }
            })
          }}
        />
      )}
      {inputType === 'textArea' && (
        <textarea
          row={row}
          className={'form-control' + (invalid ? ' is-invalid' : '')}
          id={attributeCode}
          value={value}
          onChange={e => {
            setValue(response => {
              return {
                ...response,
                [attributeCode]: e.target.value,
              }
            })
          }}
        />
      )}
      {invalid && <div className="invalid-feedback">{validationMessage ?? ''}</div>}
    </>
  )
}

const FormRadioField = ({ attributeName, attributeCode, requiredFlag, options, setValue, value, invalid, validationMessage }) => {
  return (
    <fieldset>
      <div className={`form-label ${requiredFlag ? 'required' : ''}`}>{attributeName}</div>
      {options.map((option, idx) => {
        return (
          <div className="form-check" key={idx}>
            <input
              onChange={() => {
                setValue(response => {
                  return {
                    ...response,
                    [attributeCode]: option.value,
                  }
                })
              }}
              value={attributeCode}
              className={'form-check-input' + (invalid ? ' is-invalid' : '')}
              type="radio"
              name={attributeCode + option.name}
              checked={option.value === value}
              id={attributeCode + option.name}
            />
            <label className="form-check-label" htmlFor={attributeCode + option.name}>
              {option.name}
            </label>
          </div>
        )
      })}
      {invalid && <div className="invalid-feedback">{validationMessage ?? ''}</div>}
    </fieldset>
  )
}

const FormSelectField = ({ attributeName, attributeCode, requiredFlag, options, setValue, value, invalid, validationMessage }) => {
  return (
    <fieldset>
      <div className={`form-label ${requiredFlag ? 'required' : ''}`}>{attributeName}</div>
      <select
        name={attributeCode}
        value={value}
        onChange={e => {
          e.preventDefault()
          setValue(response => {
            return {
              ...response,
              [attributeCode]: e.target.value,
            }
          })
        }}
      >
        {options.map((option, idx) => {
          return (
            <option key={idx} value={option.value}>
              {option.name}
            </option>
          )
        })}
      </select>
      {invalid && <div className="invalid-feedback">{validationMessage ?? ''}</div>}
    </fieldset>
  )
}

const FormCheckboxGroupField = ({ attributeName, attributeCode, requiredFlag, options, setValue, value, invalid, validationMessage }) => {
  return (
    <fieldset>
      <div className={`form-label ${requiredFlag ? 'required' : ''}`}>{options.length > 1 ? attributeName : ''}</div>
      {options.map((option, idx) => {
        return (
          <div className="form-check" key={idx}>
            <input
              onChange={() => {
                setValue(response => {
                  let val
                  if (response[attributeCode]?.includes(option.value)) {
                    val = response[attributeCode].filter(i => i !== option.value)
                    if (val.length === 0)
                      // prevent false negative on required field validation
                      val = undefined
                  } else {
                    // attempt to push the option to the response
                    const pushRes = response[attributeCode]?.push(option.value)
                    // if the push was unsuccessful, create a new array and set val
                    if (!pushRes) val = [option.value]
                    // otherwise val is just the response
                    else val = response[attributeCode]
                  }
                  return {
                    ...response,
                    [attributeCode]: val,
                  }
                })
              }}
              value={attributeCode}
              className={'form-check-input' + (invalid ? ' is-invalid' : '')}
              type="checkbox"
              name={attributeCode + option.name}
              checked={value?.includes(option.value)}
              id={attributeCode + option.name}
            />
            <label className="form-check-label" htmlFor={attributeCode + option.name}>
              {option.name}
            </label>
          </div>
        )
      })}
      {invalid && <div className="invalid-feedback">{validationMessage ?? ''}</div>}
    </fieldset>
  )
}

const FormMultiSelectField = ({ attributeName, attributeCode, requiredFlag, options, setValue, value, invalid, validationMessage }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  let label
  if (value?.length)
    label = options
      .filter(o => value?.includes(o.value))
      .map(o => o.name)
      .join(', ')
  else label = 'Select'

  return (
    <fieldset>
      <div className={`form-label ${requiredFlag ? 'required' : ''}`}>{attributeName}</div>
      <button
        className="btn btn-primary"
        type="button"
        onClick={e => {
          setShowDropdown(s => !s)
        }}
      >
        {label}
      </button>
      <div className={showDropdown ? 'show' : 'collapse'}>
        {options.map((option, idx) => {
          return (
            <div className={'form-check'} key={idx}>
              <input
                onChange={() => {
                  setValue(response => {
                    let val
                    if (response[attributeCode]?.includes(option.value)) val = response[attributeCode].filter(i => i !== option.value)
                    else {
                      const pushRes = response[attributeCode]?.push(option.value)
                      if (!pushRes) val = [option.value]
                      else val = response[attributeCode]
                    }
                    return {
                      ...response,
                      [attributeCode]: val,
                    }
                  })
                }}
                value={attributeCode}
                className={'form-check-input' + (invalid ? ' is-invalid' : '')}
                type="checkbox"
                name={attributeCode + option.name}
                checked={value?.includes(option.value)}
                id={attributeCode + option.name}
              />
              <label className="form-check-label" htmlFor={attributeCode + option.name}>
                {option.name}
              </label>
            </div>
          )
        })}
      </div>

      {invalid && <div className="invalid-feedback">{validationMessage ?? ''}</div>}
    </fieldset>
  )
}

const FormChronoField = ({ attributeName, attributeCode, requiredFlag, setValue, value, invalid, validationMessage, chronoType }) => {
  return (
    <fieldset>
      <div className={`form-label ${requiredFlag ? 'required' : ''}`}>{attributeName}</div>
      <input
        type={chronoType}
        value={value}
        onChange={e => {
          setValue(response => ({ ...response, [attributeCode]: e.target.value }))
        }}
      />
      {invalid && <div className="invalid-feedback">{validationMessage ?? ''}</div>}
    </fieldset>
  )
}

const FormYesNoField = props => (
  <FormRadioField
    {...props}
    options={[
      { value: 'Yes', name: 'Yes' },
      { value: 'No', name: 'No' },
    ]}
  />
)

const FormCheckboxField = props => <FormCheckboxGroupField {...props} options={[{ value: true, name: props.attributeName }]} />

const FormFileField = ({ attributeName, attributeCode, requiredFlag, setValue, value = '', inputType, row = 5, invalid, validationMessage }) => {
  return (
    <>
      <label htmlFor={attributeCode} className={`form-label ${requiredFlag ? 'required' : ''}`}>
        {attributeName}
      </label>
      <input
        className={'form-control' + (invalid ? ' is-invalid' : '')}
        id={attributeCode}
        type={inputType}
        value={value}
        onChange={e => {
          var filename = e.target.value.match(/[^\\/]*$/)?.at(0)
          setValue(response => {
            return {
              ...response,
              [attributeCode]: e.target.value,
              [`${attributeCode}-filename`]: filename,
              [`${attributeCode}-file`]: e.target.files[0],
              [`${attributeCode}-path`]: e.target.value,
            }
          })
        }}
      />
      {invalid && <div className="invalid-feedback">{validationMessage ?? ''}</div>}
    </>
  )
}

const FormEL = ({ q, setValue, value, invalid }) => {
  if (q?.inputType === 'text' || q?.inputType === 'email' || q?.inputType === 'password') return <FormTextField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} />
  if (q?.inputType === 'textArea') return <FormTextField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} />
  if (q?.inputType === 'radioGroup') return <FormRadioField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} />
  if (q?.inputType === 'checkboxGroup') return <FormCheckboxGroupField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} />
  if (q?.inputType === 'checkbox') return <FormCheckboxField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} />
  if (q?.inputType === 'yesNo') return <FormYesNoField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} />
  if (q?.inputType === 'select') return <FormSelectField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} />
  if (q?.inputType === 'typeSelect') return <FormSelectField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} />
  if (q?.inputType === 'multiselect') return <FormMultiSelectField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} />
  if (q?.inputType === 'date') return <FormChronoField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} chronoType="date" />
  if (q?.inputType === 'time') return <FormChronoField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} chronoType="time" />
  if (q?.inputType === 'dateTime') return <FormChronoField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} chronoType="datetime-local" />
  if (q?.inputType === 'file') return <FormFileField key={q.attributeCode} {...q} value={value} setValue={setValue} invalid={invalid} />
  return <h2>Not found - {q?.inputType}</h2>
}

const DynamicForm = props => {
  const { formLayout = '[]', formQuestions = [], formDescription, formHeading, formReference, formRequireReCAPTCHA = false, formAction = '8a8284c983f707020183fb05ec0109b9', stylingCustomClasses = '' } = props
  const [payload, setResponse] = useState({})
  const [invalidTracker, setInvalidTracker] = useState({})
  const recaptchaSitekey = useSelector(state => state.configuration.site.settings.siteRecaptchaSiteKey)
  const [validRecaptcha, setValidRecaptcha] = useState(false)
  let { eventHandlerForWSIWYG } = useUtilities()
  const [success, setSuccess] = useState(false)
  const [submitDisabled] = useState(false)
  const { t } = useTranslation()
  const EMAIL_VALIDATION_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const stringObject = o => {
    Object.keys(o).forEach(k => {
      o[k] = '' + o[k]
    })
    return o
  }
  const handleFormSubmit = async e => {
    e.preventDefault()

    const invalidFields = {}
    // validate form
    const requiredFieldsFilledOut = formQuestions
      .filter(q => q.requiredFlag)
      .reduce((acc, curr) => {
        // the value is not undefined, and is not an empty string
        const thisIsValid = payload[curr.attributeCode] !== undefined && payload[curr.attributeCode] !== ''

        if (!thisIsValid) invalidFields[curr.attributeCode] = true

        return acc && thisIsValid
      }, true)

    const regexMatches = formQuestions
      .filter(q => q.validationRegex)
      .reduce((acc, curr) => {
        // the current answer, if undefined is treated as an empty string, and compared to the validation regex
        const thisIsValid = !!(payload[curr.attributeCode] ?? '').match(curr.validationRegex)

        if (!thisIsValid) invalidFields[curr.attributeCode] = true

        return acc && thisIsValid
      }, true)

    const emailsValid = formQuestions
      .filter(q => q.inputType === 'email')
      .reduce((acc, curr) => {
        // the current answer, if undefined is treated as an empty string, and compared to the validation regex
        const thisIsValid = !!(payload[curr.attributeCode] ?? '').match(EMAIL_VALIDATION_REGEX)

        if (!thisIsValid) invalidFields[curr.attributeCode] = true

        return acc && thisIsValid
      }, true)

    const formIsValid = requiredFieldsFilledOut && regexMatches && emailsValid
    setInvalidTracker(invalidFields)

    const newPayload = { ...payload }
    for (const [key, value] of Object.entries(payload)) {
      if (key.includes('-filename')) {
        var newKey = key.replace('-filename', '')
        newPayload[newKey] = value
      }
    }

    try {
      if (formIsValid && formAction === '8a8284c983f707020183fb05ec0109b9') {
        console.log('start addFormResponse ')
        const formSubmitResponse = await axios({
          method: 'POST',
          withCredentials: true,
          url: `${sdkURL}api/scope/addFormResponse`,
          headers: {
            'Content-Type': 'application/json',
          },
          data: { ...stringObject({ ...newPayload }), formResponse: { formID: formReference } },
        }).then(resp => {
          console.log('end addFormResponse ')
          if (resp?.data?.failureActions?.length) toast.error(getErrorMessage(resp?.data?.errors))
          return { ...resp?.data?.data, status: resp?.status }
        })
        for (const fileKey of Object.keys(formSubmitResponse?.uploadDetails)) {
          let xmlHeaderInputs = formSubmitResponse.uploadDetails[fileKey]
          let fileHeader = { file: newPayload[`${fileKey}-file`] }
          console.log(`start file post for ${fileKey} `)
          await axios({
            method: 'POST',
            url: xmlHeaderInputs?.url,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: { ...xmlHeaderInputs?.inputs, ...fileHeader },
          })
            .then(res => {
              console.log(`end file post for ${fileKey} `, res)
            })
            .catch(err => {
              // Handle error
              console.log('error', err)
            })
        }

        console.log('finish addFormResponse', formSubmitResponse?.status)
        setSuccess(true)
      } else {
        console.log('Form Submit action not supported')
      }
    } catch (err) {
      console.log('catch', err)
    }
  }
  const onChange = recaptchaToken => {
    axios({
      method: 'POST',
      withCredentials: true,
      url: `${sdkURL}api/scope/verifyRecaptcha`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        recaptchaToken,
      },
    }).then(response => {
      if (response?.status === 200 && response?.data?.captchaResult) {
        setValidRecaptcha(true)
      }
    })
  }

  const onExpired = () => {
    setValidRecaptcha(false)
  }

  const setValue = attributeCode => func => {
    // returns a curried function that acts in the same way as the set response hook
    // but will delete the specified attribute code from the invalid tracker
    setResponse(func)
    setInvalidTracker(tracker => {
      const copy = { ...tracker }
      delete copy[attributeCode]
      return copy
    })
  }

  let layout = JSON.parse(formLayout)
  if (!Array.isArray(layout)) layout = []
  layout?.forEach(stack => (stack.innerChild = stack.elements.split(',').map(field => formQuestions.filter(q => q.attributeCode === field).at(0))))
  const remains = formQuestions.filter(question => !layout?.filter(group => group.elements.split(',').includes(question.attributeCode))?.length > 0)
  return (
    <div className={`px-3 cetForm ${stylingCustomClasses}`}>
      <h3 className="text-center">{formHeading}</h3>
      <div
        className="text-center"
        onClick={eventHandlerForWSIWYG}
        dangerouslySetInnerHTML={{
          __html: formDescription,
        }}
      />
      {success && <p className="text-center">{t('frontend.contact.success_general')}</p>}
      {!success && (
        <form onSubmit={handleFormSubmit} className={''}>
          {layout?.map((group, i) => (
            <FormRow key={i}>
              {group?.innerChild
                ?.filter(q => q)
                ?.map((q, idx) => {
                  if (group.orientation === 'Horizontal') {
                    return (
                      <FormCol key={idx}>
                        <FormEL q={q} setValue={setValue(q.attributeCode)} value={payload[q.attributeCode]} invalid={invalidTracker[q.attributeCode]} />
                      </FormCol>
                    )
                  }
                  return (
                    <FormRow key={idx}>
                      <FormEL key={idx} q={q} setValue={setValue(q.attributeCode)} value={payload[q.attributeCode]} invalid={invalidTracker[q.attributeCode]} />
                    </FormRow>
                  )
                })}
            </FormRow>
          ))}
          {remains
            ?.filter(q => q)
            ?.map((q, idx) => {
              return (
                <FormRow key={idx}>
                  <FormCol>
                    <FormEL q={q} setValue={setValue(q.attributeCode)} value={payload[q.attributeCode]} invalid={invalidTracker[q.attributeCode]} />
                  </FormCol>
                </FormRow>
              )
            })}
          {toBoolean(formRequireReCAPTCHA) && !!recaptchaSitekey && (
            <FormRow>
              <FormCol>
                <ReCAPTCHA sitekey={recaptchaSitekey} onChange={onChange} onExpired={onExpired} />
              </FormCol>
            </FormRow>
          )}
          <button className="btn btn-primary btn-block mt-2" disabled={submitDisabled || (!validRecaptcha && toBoolean(formRequireReCAPTCHA) && !!recaptchaSitekey)}>
            <span className="d-sm-inline">{t('frontend.core.submit')}</span>
            <i className="bi bi-arrow-right-circle float-end mt-1 ms-2"></i>
          </button>
        </form>
      )}
    </div>
  )
}

export { DynamicForm, FormEL, FormCheckboxField, FormYesNoField, FormChronoField, FormMultiSelectField, FormSelectField, FormRadioField, FormTextField, FormFileField, FormCol, FormRow }
