import { useGetEntityByUrlTitleAdvanced } from '../'
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

  return found.length === 1 ? found[0] : null
}

const usePopulateSlug = parentProduct => {
  let { product } = useGetEntityByUrlTitleAdvanced(parentProduct?.urlTitle)
  return product
}

const useUpdatedProductOptions = (product = {}, productOptions = [], skus = [], searchParams = {}) => {
  const [location, setLocation] = useState({ pathname: null, search: '' })
  const [updatedProductOptions, setUpdatedProductOptions] = useState([])
  const [params, setParams] = useState([])
  const [optionGroupPairs, setOptionGroupPairs] = useState([])
  let searchParameter = { ...location }

  useEffect(() => {
    // selection is an object of current paramters
    // optionGroupPairs is an array of current paramters key=value

    let searchOptionGroupPairs = location.search
      ?.replace('?', '')
      .split('&')
      .filter(param => param.length)
    let searchUpdatedProductOptions = {}
    if (searchOptionGroupPairs == null) searchOptionGroupPairs = []

    if (searchParams?.skuid) {
      // If we have a skuID we need to redirect to codes
      console.log('skuID found, waiting for skus', !product)
      const found = skus?.filter(sku => sku.skuID === searchParams.skuid)

      if (found.length) {
        console.log('Redirect based on found sku')
        // eslint-disable-next-line react-hooks/exhaustive-deps
        searchParameter = {
          pathname: `-/${product.urlTitle}?`,
          search: found[0].slug,
        }
      }
    } else if (searchOptionGroupPairs.length === 0 && product.defaultSku_slug) {
      // This check is for no optionGroupPairs passed
      console.log('<------- product.defaultSku_slug', searchOptionGroupPairs, product)
      searchParameter = {
        pathname: `-/${product.urlTitle}?`,
        search: product.defaultSku_slug,
      }
    } else {
      const matchingSkus = filterSkusBySelectedOptions(skus, searchOptionGroupPairs)
      searchUpdatedProductOptions = calculateAvaliableOptions(productOptions, searchParams, matchingSkus)
      let updateParams = calculateAdditionalParamters(searchOptionGroupPairs, searchUpdatedProductOptions)

      if (updateParams.length) {
        // http://localhost:3006/product/test-product?soccerBallSize=5 ==>  soccerBallColor=green is added
        console.log('Add additional optionGroupPairs because of option matrix')
        searchParameter = {
          pathname: `-/${product.urlTitle}?`,
          search: [...searchOptionGroupPairs, updateParams].join('&'),
        }
      }
    }
    //http://localhost:3006/product/demo-product

    if (JSON.stringify(updatedProductOptions) !== JSON.stringify(searchUpdatedProductOptions)) {
      setUpdatedProductOptions(searchUpdatedProductOptions)
    }
    if (JSON.stringify(params) !== JSON.stringify(searchParams)) {
      setParams(searchParams)
    }
    if (JSON.stringify(optionGroupPairs) !== JSON.stringify(searchOptionGroupPairs)) {
      setOptionGroupPairs(searchOptionGroupPairs)
    }
    if (JSON.stringify(searchParameter) !== JSON.stringify(location)) {
      setLocation(searchParameter)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParameter])

  console.log(location)
  return { product, location, setLocation, updatedProductOptions, params, optionGroupPairs }
}

const useSelectedOption = (skus = [], selection, location, setLocation) => {
  const [optionGroupCodeStore, setOptionGroupCodeStore] = useState({ optionGroupCode: null, optionCode: null })

  useEffect(() => {
    let selectedLocation = { ...location }
    const singlePair = generateOptionGroupPair(optionGroupCodeStore.optionGroupCode, optionGroupCodeStore.optionCode)
    selection[optionGroupCodeStore.optionGroupCode] = optionGroupCodeStore.optionCode
    const optionsToTest = Object.keys(selection).map(key => {
      return generateOptionGroupPair(key, selection[key])
    })
    const matchingSkus = filterSkusBySelectedOptions(skus, optionsToTest)

    if (matchingSkus.length === 1) {
      // http://localhost:3006/product/test-product?colors=global-black&soccerBallSize=3
      console.log('Single Matching sku')
      selectedLocation = {
        pathname: location.pathname,
        search: matchingSkus[0].slug,
      }
    } else if (matchingSkus.length === 0) {
      const possibleSKus = filterSkusBySelectedOptions(skus, [singlePair])
      if (possibleSKus.length === 1) {
        console.log('Single Matching sku')
        // http://localhost:3006/product/test-product?soccerBallColor=orange&colors=global-red&soccerBallSize=3  select 4
        selectedLocation = {
          pathname: location.pathname,
          search: possibleSKus[0].slug,
        }
      } else if (possibleSKus.length > 1) {
        console.log('The selection was not valid so we will reset option selection to current selection')
        // http://localhost:3006/product/test-product?soccerBallColor=yellow&colors=global-black&soccerBallSize=4 ==> select red
        selectedLocation = {
          pathname: location.pathname,
          search: singlePair,
        }
      }
    } else {
      console.log('Multiple remaining skus after new selection')
      // http://localhost:3006/product/test-product?soccerBallColor=orange&soccerBallSize=3 select orange
      selectedLocation = {
        pathname: location.pathname,
        search: optionsToTest.join('&'),
      }
    }

    if (JSON.stringify(location) !== JSON.stringify(selectedLocation)) {
      setLocation(selectedLocation)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionGroupCodeStore])

  return setOptionGroupCodeStore
}

const useProductDetail = () => {
  return { filterSkusBySelectedOptions, optionIsValid, calculateAvaliableOptions, calculateAdditionalParamters, generateOptionGroupPair, selectionToSku, useUpdatedProductOptions, usePopulateSlug, useSelectedOption }
}

export { useProductDetail }
