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
const calculateAvaliableOptions = (productOptions = [], selection, skus) => {
  return productOptions.map(optGrp => {
    if (Object.keys(selection).includes(optGrp.optionGroupCode)) {
      optGrp.options.map(opt => {
        opt.available = true
        return opt
      })
    } else {
      optGrp.options.map(opt => {
        opt.available = optionIsValid(optGrp.optionGroupCode, opt.optionCode, skus)
        return opt
      })
    }

    return optGrp
  })
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
      if (validOptions.length === 1 && optGrp.options.length === 1) return generateOptionGroupPair(optGrp.optionGroupCode, validOptions[0].optionCode)
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

const useProductDetail = () => {
  return { filterSkusBySelectedOptions, optionIsValid, calculateAvaliableOptions, calculateAdditionalParamters, generateOptionGroupPair }
}

export { useProductDetail }
