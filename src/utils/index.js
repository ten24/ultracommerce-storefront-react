import jwt_decode from 'jwt-decode'
import queryString from 'query-string'
import { toast } from 'react-toastify'

export const cleanHTML = data => data.replace('class=', 'className=')
export const renameKeys = (obj, find, replace = '') => {
  Object.keys(obj).forEach(key => {
    const newKey = key.replace(find, replace)
    obj[newKey] = obj[key]
    delete obj[key]
  })
}
export const renameKeysInArrayOfObjects = (arr, find, replace) => {
  arr.forEach(obj => {
    renameKeys(obj, find, replace)
  })
}

export const isAuthenticated = () => {
  let token = localStorage.getItem('token')
  if (token) {
    try {
      token = jwt_decode(token)
      return token.exp && token.exp * 1000 > Date.now() && token.accountID.length > 0
    } catch (error) {}
  }
  return false
}
export const getMyAccountUrl = () => {
  return isAuthenticated() ? '/my-account/overview' : '/my-account/login'
}
export const isImpersonating = () => {
  let token = localStorage.getItem('token')
  if (token) {
    try {
      token = jwt_decode(token)
      return token?.isImpersonating || false
    } catch (error) {}
  }
  return false
}
export const toBoolean = (val = false) => {
  if (isBoolean(val)) return val
  if (Number.isInteger(val)) return val > 0
  if (isString(val)) return val?.toLowerCase()?.trim() === 'true' || val?.toLowerCase()?.trim() === 'yes' || val?.toLowerCase()?.trim() === '1'
  return false
}
export const containsHTML = str => /<[a-z][\s\S]*>/i.test(str)
export const isString = val => 'string' === typeof val
export const isBoolean = val => 'boolean' === typeof val
export const booleanToString = value => (value ? 'Yes' : 'No')
export const skuIdsToSkuCodes = (idList, productOptionGroups) => {
  return productOptionGroups
    .map(optionGroup =>
      optionGroup.options
        .filter(option => {
          return idList.includes(option.optionID)
        })
        .map(option => {
          let payload = {}
          payload[optionGroup.optionGroupCode] = option.optionCode
          return payload
        })
    )
    .flat()
}
export const parseErrorMessages = error => {
  if (error instanceof Object) {
    return Object.keys(error)
      .map(key => parseErrorMessages(error[key]))
      .flat()
  }
  return error
}
export const getErrorMessage = error => {
  return parseErrorMessages(error)?.join('. ')
}

export const getFailureMessageOnSuccess = (response, message) => {
  if (response.isSuccess() && Object.keys(response.success()?.messages || {}).length) return toast.error(message)
}

export const organizeProductTypes = (parents, list) => {
  return parents.map(parent => {
    let childProductTypes = list
      .filter(productType => {
        return productType.productTypeIDPath.includes(parent.productTypeIDPath) && productType.productTypeID !== parent.productTypeID
      })
      .filter(productType => {
        return productType.productTypeIDPath.split(',').length === parent.productTypeIDPath.split(',').length + 1
      })
    if (list.length > 0) {
      childProductTypes = organizeProductTypes(childProductTypes, list)
    }
    return { ...parent, childProductTypes }
  })
}
export const augmentProductType = (parent, data) => {
  let parents = data.filter(productType => {
    return productType.urlTitle.toLowerCase() === parent.toLowerCase()
  })
  parents = organizeProductTypes(parents, data)

  if (parents.length > 0) {
    parents = parents?.at(0)
  }
  return parents
}

export const groupBy = (xs, key) => {
  return xs.reduce(function (rv, x) {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}
export const processQueryParameters = params => {
  let qParams = queryString.parse(params, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  Object.keys(qParams).forEach(key => (qParams[key] = Array.isArray(qParams[key]) ? qParams[key].join() : qParams[key]))
  return qParams
}
export const sorting = (array, order, key) => {
  array.sort(function (a, b) {
    var A = a[key],
      B = b[key]

    if (order.indexOf(A) > order.indexOf(B)) {
      return 1
    } else {
      return -1
    }
  })

  return array
}
export const getOptionByCode = (filteredOptions, optionGroupCode, optionCode) => {
  return filteredOptions
    .filter(optionGroup => optionGroupCode === optionGroup.optionGroupCode)
    .map(optionGroup => optionGroup.options.filter(option => optionCode === option.optionCode))
    .flat()
    .shift()
}
export const getContentByTypeCode = (content = [], code = '') => {
  return content.filter(con => code.split(',').includes(con?.contentElementType_systemCode)).sort((a, b) => a.sortOrder - b.sortOrder)
}
export const getContentPages = (content = []) => {
  return content.filter(con => con?.isPageFlag === true).sort((a, b) => a.sortOrder - b.sortOrder)
}
export const getAllChildrenContentByType = (content = [], code = '') => {
  const response = []
  content.forEach(con => {
    if (con?.contentElementType_systemCode === code) {
      response.push(con)
    }
    if (con.children.length) {
      const children = getAllChildrenContentByType(con.children, code)
      response.push(...children)
    }
  })
  response.sort((a, b) => {
    return a.sortOrder - b.sortOrder
  })
  return response
}

export const deepMerge = (source, target) => {
  for (const [key, val] of Object.entries(source)) {
    if (val !== null && typeof val === `object`) {
      if (target[key] === undefined) {
        target[key] = new val.__proto__.constructor()
      }
      deepMerge(val, target[key])
    } else {
      target[key] = val
    }
  }
  return target // we're replacing in-situ, so this is more for chaining than anything else
}

export const unflattenObject = (obj, delimiter = '_') =>
  Object.keys(obj).reduce((res, k) => {
    k.split(delimiter).reduce((acc, e, i, keys) => acc[e] || (acc[e] = isNaN(Number(keys[i + 1])) ? (keys.length - 1 === i ? obj[k] : {}) : []), res)
    return res
  }, {})

export const formatXml = (xml, tab = '    ', nl = '\n') => {
  let formatted = '',
    indent = ''
  const nodes = xml.slice(1, -1).split(/>\s*</)
  if (nodes[0][0] === '?') formatted += '<' + nodes.shift() + '>' + nl
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node[0] === '/') indent = indent.slice(tab.length) // decrease indent
    formatted += indent + '<' + node + '>' + nl
    if (node[0] !== '/' && node[node.length - 1] !== '/' && node.indexOf('</') === -1) indent += tab // increase indent
  }
  return formatted
}

export const getCurrentSiteCode = () => {
  let localSiteCode = JSON.parse(localStorage.getItem('appConfiguration') || '{}')?.currentSite
  if (!!localSiteCode) return localSiteCode
  localStorage.setItem('appConfiguration', JSON.stringify({ currentSite: process.env.REACT_APP_SITE_CODE, sites: [] }))
  return process.env.REACT_APP_SITE_CODE
}
