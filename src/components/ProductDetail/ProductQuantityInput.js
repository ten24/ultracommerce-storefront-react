import React from 'react'
import { useSelector } from 'react-redux'
import { checkInvetory } from '../../selectors'

// render quantity input on the basis of config
// renders input on text, dropdown on dropdown
function ProductQuantityInput({ setQuantity, quantity, sku, stock = 0 }) {
  const quantityInput = useSelector(state => state.configuration.products.quantityInput)
  const showInventory = useSelector(state => state.configuration.products.showInventory)
  const dropdownLimitCount = useSelector(state => state.configuration.products.dropdownLimit)
  const checkInvetoryFlag = useSelector(checkInvetory)

  const validateQuantity = quantity => {
    quantity = parseInt(quantity)
    if (!checkInvetoryFlag || (checkInvetoryFlag && quantity >= sku.skuOrderMinimumQuantity && quantity <= sku.skuOrderMaximumQuantity)) setQuantity(quantity)
  }

  const calculateDropdownLimit = () => {
    if (checkInvetoryFlag) return sku.calculatedQATS > 20 ? 20 : sku.calculatedQATS
    if (!checkInvetoryFlag) return dropdownLimitCount
  }

  return (
    <div className="mb-3">
      {quantityInput === 'text' && (
        <input
          type="number"
          onChange={event => {
            validateQuantity(event.target.value)
          }}
          value={quantity}
          className="form-control"
          style={{ width: '5rem' }}
        />
      )}
      {sku && quantityInput === 'dropdown' && (
        <select
          value={quantity}
          onChange={event => {
            validateQuantity(event.target.value)
          }}
          className="custom-select "
          style={{ width: '5rem' }}
        >
          {[...Array(calculateDropdownLimit()).keys()].map((value, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      )}

      {showInventory && stock > 0 && (
        <div style={{ marginRight: '5px' }}>
          {stock}
          <span className="text-accent"> in Stock</span>
        </div>
      )}
    </div>
  )
}

export { ProductQuantityInput }
