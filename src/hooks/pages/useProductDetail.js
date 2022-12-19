import { useState, useEffect } from 'react'
/*
  This will generate a list of skus that match option selection
  */
const filterSkusBySelectedOptions = (skus = [], optionsTofilter = []) => {
  return skus.filter(sku => {
    return optionsTofilter.filter(selection => sku.slug.includes(selection)).length >= optionsTofilter.length && sku
  })
}
/*
  Will check to see if optionPair exists in a list skus
  */
const optionIsValid = (optionGroupCode, optionCode, skus = []) => {
  return (
    skus.filter(sku => {
      return sku.slug.includes(`${optionGroupCode}=${optionCode}`)
    }).length > 0
  )
}
/*
  This function will flag options avaliable for
  selection based on previous selection

  */
const calculateAvaliableOptions = (productOptions = [], lastSelection, allSkus) => {
  const matchingSkusbasedOnLastSelection = filterSkusBySelectedOptions(allSkus, [`${lastSelection.optionGroupCode}=${lastSelection.optionCode}`])

  productOptions = productOptions.map(optGrp => {
    optGrp.options.map(opt => {
      opt.available = true
      return opt
    })
    return optGrp
  })
  if (!lastSelection.optionGroupCode.length) return productOptions

  // check the options against the prefiltered skus
  productOptions = productOptions.map(optGrp => {
    if (lastSelection.optionGroupCode !== optGrp.optionGroupCode) {
      optGrp.options.map(opt => {
        opt.available = optionIsValid(optGrp.optionGroupCode, opt.optionCode, matchingSkusbasedOnLastSelection)
        return opt
      })
    }

    return optGrp
  })

  return productOptions
}

/*
  This function will check to see if any additional
  parmaters can be added as a result any options 
  being labeled non-active. 
  */
const calculateAdditionalParamters = (currentOptionGroupPairs, productOptions) => {
  const paramCandidates = productOptions
    .map(optGrp => {
      const validOptions = optGrp.options.filter(opt => opt.available)
      if (validOptions.length === 1 && optGrp.options.length === 1) return generateOptionGroupPair(optGrp.optionGroupCode, validOptions?.at(0).optionCode)
      return null
    })
    .filter(data => data)

  const newParams = [...new Set([...currentOptionGroupPairs, ...paramCandidates])]
  // http://localhost:3006/product/test-product?soccerBallSize=5 ==>  soccerBallColor=green is added

  const paramtersAreEqual = newParams.length === currentOptionGroupPairs.length && newParams.every(element => currentOptionGroupPairs.includes(element))
  if (paramtersAreEqual) return []
  if (!paramtersAreEqual) return paramCandidates
}
const generateOptionGroupPair = (optionGroupCode, optionCode) => {
  return `${optionGroupCode}=${optionCode}`
}

const selectionToSku = (product, skus = [], params = [], options = []) => {
  let found = skus.filter(sku => {
    return (
      params.filter(code => {
        return sku.slug.includes(code)
      }).length === options.length
    )
  })

  //check if product is of gift card type, if yes then return default sku from sku list (as it will not have options)
  if (product?.productType_productTypeIDPath && product?.defaultSku_skuID && product.productType_productTypeIDPath.includes('50cdfabbc57f7d103538d9e0e37f61e4')) {
    found = skus.filter(sku => sku.skuID === product.defaultSku_skuID)
  }

  return found.length === 1 ? found?.at(0) : null
}

const useFindSelectedOption = (skus = [], selection, criteria, setCriteria) => {
  const [optionGroupCodeStore, setOptionGroupCodeStore] = useState({ optionGroupCode: null, optionCode: null })

  useEffect(() => {
    const singlePair = generateOptionGroupPair(optionGroupCodeStore.optionGroupCode, optionGroupCodeStore.optionCode)
    selection[optionGroupCodeStore.optionGroupCode] = optionGroupCodeStore.optionCode
    const optionsToTest = Object.keys(selection).map(key => {
      return generateOptionGroupPair(key, selection[key])
    })
    const matchingSkus = filterSkusBySelectedOptions(skus, optionsToTest)

    if (matchingSkus.length === 1) {
      // http://localhost:3006/product/test-product?colors=global-black&soccerBallSize=3
      //console.log('Single Matching sku')
      setCriteria({
        pathname: criteria.pathname,
        search: matchingSkus?.at(0).slug,
      })
    } else if (matchingSkus.length === 0) {
      const possibleSKus = filterSkusBySelectedOptions(skus, [singlePair])
      if (possibleSKus.length === 1) {
        // console.log('Single Matching sku')
        // http://localhost:3006/product/test-product?soccerBallColor=orange&colors=global-red&soccerBallSize=3  select 4
        setCriteria({
          pathname: criteria.pathname,
          search: possibleSKus?.at(0).slug,
        })
      } else if (possibleSKus.length > 1) {
        console.log('The selection was not valid so we will reset option selection to current selection')
        // http://localhost:3006/product/test-product?soccerBallColor=yellow&colors=global-black&soccerBallSize=4 ==> select red
        setCriteria({
          pathname: criteria.pathname,
          search: singlePair,
        })
      }
    } else {
      //console.log('Multiple remaining skus after new selection')
      // http://localhost:3006/product/test-product?soccerBallColor=orange&soccerBallSize=3 select orange
      setCriteria({
        pathname: criteria.pathname,
        search: optionsToTest.join('&'),
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionGroupCodeStore])

  return setOptionGroupCodeStore
}

const useProductDetail = () => {
  return { filterSkusBySelectedOptions, optionIsValid, calculateAvaliableOptions, calculateAdditionalParamters, generateOptionGroupPair, selectionToSku, useFindSelectedOption }
}

export { useProductDetail }
