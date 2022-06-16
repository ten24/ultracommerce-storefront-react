import { useTranslation } from 'react-i18next'
import { useProductDetail } from '../../hooks'
import { useHistory, useLocation } from 'react-router'

// selection is an object of current paramters
// optionGroupPairs is an array of current paramters key=value
const SkuOptions = ({ productOptions, selection, skus = [], selectedOptionInModel }) => {
  const { filterSkusBySelectedOptions, generateOptionGroupPair } = useProductDetail()
  const { t } = useTranslation()
  let loc = useLocation()
  let history = useHistory()

  // http://localhost:3006/product/test-product?colors=global-black&soccerBallColor=orange&soccerBallSize=3
  const selectedOption = (skus = [], optionGroupCode, optionCode, selection) => {
    const singlePair = generateOptionGroupPair(optionGroupCode, optionCode)
    selection[optionGroupCode] = optionCode
    const optionsToTest = Object.keys(selection).map(key => {
      return generateOptionGroupPair(key, selection[key])
    })
    const matchingSkus = filterSkusBySelectedOptions(skus, optionsToTest)

    if (matchingSkus.length === 1) {
      // http://localhost:3006/product/test-product?colors=global-black&soccerBallSize=3
      console.log('Single Matching sku')
      history.replace({
        pathname: loc.pathname,
        search: matchingSkus[0].slug,
      })
    } else if (matchingSkus.length === 0) {
      const possibleSKus = filterSkusBySelectedOptions(skus, [singlePair])
      if (possibleSKus.length === 1) {
        console.log('Single Matching sku')
        // http://localhost:3006/product/test-product?soccerBallColor=orange&colors=global-red&soccerBallSize=3  select 4
        history.replace({
          pathname: loc.pathname,
          search: possibleSKus[0].slug,
        })
      } else if (possibleSKus.length > 1) {
        console.log('The selection was not valid so we will reset option selection to current selection')
        // http://localhost:3006/product/test-product?soccerBallColor=yellow&colors=global-black&soccerBallSize=4 ==> select red
        history.replace({
          pathname: loc.pathname,
          search: singlePair,
        })
      }
    } else {
      console.log('Multiple remaining skus after new selection')
      // http://localhost:3006/product/test-product?soccerBallColor=orange&soccerBallSize=3 select orange
      history.replace({
        pathname: loc.pathname,
        search: optionsToTest.join('&'),
      })
    }
  }
  return (
    <div className="d-flex flex-row">
      {productOptions.length > 0 &&
        productOptions.map(({ optionGroupName, options, optionGroupID, optionGroupCode }) => {
          const selectedOptionCode = selection[optionGroupCode] || 'select'
          return (
            <div className="form-group pe-4 mb-4" key={optionGroupID}>
              <div className="d-flex justify-content-between align-items-center pb-1">
                <label className="font-weight-medium" htmlFor={optionGroupID}>
                  {optionGroupName}
                </label>
              </div>
              <select
                className="custom-select rounded-pill"
                required
                value={selectedOptionCode}
                id={optionGroupID}
                onChange={e => {
                  if (selectedOptionInModel) {
                    selectedOptionInModel(optionGroupCode, e.target.value)
                  } else {
                    selectedOption(skus, optionGroupCode, e.target.value, selection)
                  }
                }}
              >
                {selectedOptionCode === 'select' && (
                  <option className={`option nonactive`} value="select">
                    {t('frontend.product.select')}
                  </option>
                )}
                {options &&
                  options.map(option => {
                    return (
                      <option className={`option ${option.active ? 'active' : 'nonactive'}`} key={option.optionID} value={option.optionCode}>
                        {option.available && option.optionName}
                        {!option.available && option.optionName + ' - ' + t('frontend.product.na')}
                      </option>
                    )
                  })}
              </select>
            </div>
          )
        })}
    </div>
  )
}

const SkuSelector = ({ sku, skus = [], selectedOptionInModel }) => {
  let loc = useLocation()
  let history = useHistory()
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
              history.replace({
                pathname: loc.pathname,
                search: `skuid=${e.target.value}`,
              })
            }
          }}
        >
          {skus &&
            skus.map(skuOption => {
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
