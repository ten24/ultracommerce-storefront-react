import { useProductDetail } from '../../hooks'
import { useLocation, useNavigate } from 'react-router-dom'
import React from 'react'

// selection is an object of current paramters
// optionGroupPairs is an array of current paramters key=value
const SkuOptions = ({ productOptions, selection, skus = [], selectedOptionInModel, setLastSelection }) => {
  const { filterSkusBySelectedOptions, generateOptionGroupPair } = useProductDetail()
  let loc = useLocation()
  const navigate = useNavigate()

  // http://localhost:3006/product/test-product?colors=global-black&soccerBallColor=orange&soccerBallSize=3
  const selectedOption = (skus = [], optionGroupCode, optionCode, selection) => {
    setLastSelection({ optionGroupCode, optionCode })
    const singlePair = generateOptionGroupPair(optionGroupCode, optionCode)
    selection[optionGroupCode] = optionCode
    const optionsToTest = Object.keys(selection).map(key => {
      return generateOptionGroupPair(key, selection[key])
    })
    const matchingSkus = filterSkusBySelectedOptions(skus, optionsToTest)

    if (matchingSkus.length === 1) {
      // http://localhost:3006/product/test-product?colors=global-black&soccerBallSize=3
      console.log('Single Matching sku')
      navigate({
        pathname: loc.pathname,
        search: matchingSkus?.at(0).slug,
      })
    } else if (matchingSkus.length === 0) {
      const possibleSKus = filterSkusBySelectedOptions(skus, [singlePair])
      if (possibleSKus.length === 1) {
        console.log('Single Matching sku')
        // http://localhost:3006/product/test-product?soccerBallColor=orange&colors=global-red&soccerBallSize=3  select 4
        navigate({
          pathname: loc.pathname,
          search: possibleSKus?.at(0).slug,
        })
      } else if (possibleSKus.length > 1) {
        console.log('The selection was not valid so we will reset option selection to current selection')
        // http://localhost:3006/product/test-product?soccerBallColor=yellow&colors=global-black&soccerBallSize=4 ==> select red
        navigate({
          pathname: loc.pathname,
          search: singlePair,
        })
      }
    } else {
      console.log('Multiple remaining skus after new selection')
      // http://localhost:3006/product/test-product?soccerBallColor=orange&soccerBallSize=3 select orange
      navigate({
        pathname: loc.pathname,
        search: optionsToTest.join('&'),
      })
    }
  }
  if (skus?.length === 0) return null
  productOptions?.forEach(productOption => {
    productOption?.options?.forEach(option => {
      option.active = Object.keys(selection).includes(productOption?.optionGroupCode) && option.optionCode === selection[productOption.optionGroupCode]
    })
  })
  //Changes-Replaced the dropdowns for variants with buttons. Variants are preselected and unavailable variants are always at the end.
  return (
    <div className="optionGroup d-flex flex-column">
      {productOptions?.map(({ optionGroupName, options, optionGroupID, optionGroupCode }) => {
        const selectedOptionCode = selection[optionGroupCode] || 'select'

        return (
          <div className="form-group pe-4 my-4" key={optionGroupID}>
            <div className="d-flex justify-content-between align-items-center pb-1">
              <label className="optionGroupName h6" htmlFor={optionGroupID}>
                {optionGroupName}
              </label>
            </div>
            <div className="d-flex options-div" required value={selectedOptionCode} id={optionGroupID}>
              {/* Only for available variants. providing checked for input for preselecting the value */}
              {options?.map(option => {
                return (
                  <button
                    key={option.optionCode}
                    onClick={e => {
                      if (selectedOptionInModel) {
                        selectedOptionInModel(optionGroupCode, option.optionCode)
                      } else {
                        selectedOption(skus, optionGroupCode, option.optionCode, selection)
                      }
                    }}
                    className={` mx-2 p-1 btn skuOption ${option.active ? 'active' : 'nonactive'} ${option.available ? 'available' : 'nonavailable'}`}
                  >
                    {option.optionName}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const SkuSelector = ({ sku, skus = [], productOptions, selectedOptionInModel }) => {
  let loc = useLocation()
  const navigate = useNavigate()
  if (productOptions?.length !== 0 || skus.length === 0) return null
  return (
    <div className="d-flex flex-row">
      <div className="form-group pe-4 mb-4">
        <select
          className="custom-select rounded-pill"
          required
          value={sku?.skuID}
          id="skuSelector"
          onChange={e => {
            if (selectedOptionInModel) {
              selectedOptionInModel('', e.target.value)
            } else {
              navigate({
                pathname: loc.pathname,
                search: `skuid=${e.target.value}`,
              })
            }
          }}
        >
          {skus?.map(skuOption => {
            return (
              <option className="" key={skuOption.skuID} value={skuOption.skuID}>
                {skuOption.calculatedSkuDefinition}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}

export { SkuOptions, SkuSelector }
