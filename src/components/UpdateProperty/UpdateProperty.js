import { useDispatch } from 'react-redux'
import { SlatwalApiService } from '../../services/SlatwalApiService'
import { receiveCart } from '../../actions/orderActions'
import { toBoolean } from '../../utils'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const UpdatePropertyFlag = ({ propertyCode, propertyName, propertyValue, entity = 'order', entityID, disabled = false }) => {
  const dispatch = useDispatch()
  if (!entityID?.length) return null
  const savePublicProperty = event => {
    SlatwalApiService.cart.updateOrder({ orderID: entityID, [propertyCode]: event.target.checked, returnJSONObjects: 'cart' }).then(response => {
      if (response.isSuccess()) dispatch(receiveCart(response.success().cart))
    })
  }
  return (
    <div className=" pt-1 pb-4">
      <label htmlFor={`${entity}publicPropertFlag${propertyCode}`}>{propertyName}</label>
      <input onChange={savePublicProperty} className="float-start" disabled={disabled} type="checkbox" id={`${entity}publicPropertFlag${propertyCode}`} defaultChecked={toBoolean(propertyValue)} name={propertyCode} value={propertyCode} />
    </div>
  )
}

const UpdatePropertyTextArea = ({ propertyCode, isFetching = false, propertyName, propertyValue, entity = 'order', entityID, disabled = false }) => {
  const [changedInput, setChangedInput] = useState(false)
  const [reference, setReferenceNumber] = useState({ text: '', original: '' })
  const { t } = useTranslation()
  const dispatch = useDispatch()

  if (!entityID?.length) return null

  if (propertyValue !== reference.original) {
    setReferenceNumber({ text: propertyValue, original: propertyValue })
  }

  return (
    <div className=" pt-1 pb-4">
      <label className="mb-2" htmlFor={`${propertyCode}-TextArea`}>
        <span className="font-weight-medium">{propertyName}</span>
      </label>
      <textarea
        className="form-control UpdatePropertyTextArea"
        rows="2"
        id={`${propertyCode}-TextArea`}
        disabled={isFetching}
        value={reference.text}
        onChange={e => {
          e.preventDefault()
          setReferenceNumber({ text: e.target.value, original: propertyValue })
          setChangedInput(e.target.value !== propertyValue)
        }}
      />
      <div className="custom_float">
        {changedInput && (
          <button
            className="btn btn-primary btn-block mt-4"
            type="submit"
            disabled={isFetching}
            onClick={event => {
              SlatwalApiService.cart.updateOrder({ orderID: entityID, [propertyCode]: reference.text, returnJSONObjects: 'cart' }).then(response => {
                if (response.isSuccess()) dispatch(receiveCart(response.success().cart))
                setChangedInput(false)
                setReferenceNumber(({ text }) => {
                  return { text, original: text }
                })
              })

              event.preventDefault()
            }}
          >
            {t('frontend.core.save')}
          </button>
        )}
      </div>
    </div>
  )
}
export { UpdatePropertyFlag, UpdatePropertyTextArea }
