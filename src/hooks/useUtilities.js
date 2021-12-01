import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { cleanHTML, renameKeys, renameKeysInArrayOfObjects, isAuthenticated, containsHTML, isString, isBoolean, booleanToString, skuIdsToSkuCodes, parseErrorMessages, organizeProductTypes, augmentProductType, groupBy, processQueryParameters, getContentByType } from '../utils'

const useUtilities = () => {
  let history = useHistory()
  const { basePath, host } = useSelector(state => state.configuration.theme)

  const nestDataByKey = (data = [], parentKey = '', childKey = '') => {
    let dataResponse = data.sort((a, b) => a.sortOrder - b.sortOrder)
    if (dataResponse.length) {
      const groupedItems = groupBy(dataResponse, parentKey)
      dataResponse = dataResponse
        .map(item => {
          item.children = groupedItems.hasOwnProperty(item[childKey]) ? groupedItems[item[childKey]] : []
          return item
        })
        .sort((a, b) => a.sortOrder - b.sortOrder)
    }
    return dataResponse
  }
  const convertToFullPath = (file = '', path) => {
    if (file.includes('http')) {
      return file
    } else if (path) {
      return host + path + file
    } else {
      return host + basePath + file
    }
  }

  const eventHandlerForWSIWYG = event => {
    event.preventDefault()

    if (event.target.getAttribute('href')) {
      if (event.target.getAttribute('href').includes('.pdf')) {
        window.open(event.target.getAttribute('href'), '_blank')
        return
      }
      if (event.target.getAttribute('target') && (event.target.getAttribute('target').includes('blank') || event.target.getAttribute('target').includes('tab') || event.target.getAttribute('target').includes('new'))) {
        window.open(event.target.getAttribute('href'), '_blank')
        return
      }
      if (event.target.getAttribute('href').includes('http') && !event.target.getAttribute('href').includes('.pdf')) {
        window.location.href = event.target.getAttribute('href')
      } else {
        history.push(event.target.getAttribute('href'))
      }
    } else {
      if (event.target.closest('a')) {
        history.push(event.target.closest('a').getAttribute('href'))
      }
    }
  }

  return { convertToFullPath, nestDataByKey, eventHandlerForWSIWYG, cleanHTML, renameKeys, renameKeysInArrayOfObjects, isAuthenticated, containsHTML, isString, isBoolean, booleanToString, skuIdsToSkuCodes, parseErrorMessages, organizeProductTypes, augmentProductType, groupBy, processQueryParameters, getContentByType }
}
export { useUtilities }
