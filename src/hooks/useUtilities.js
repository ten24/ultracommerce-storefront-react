import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { cleanHTML, renameKeys, renameKeysInArrayOfObjects, isAuthenticated, containsHTML, isString, isBoolean, booleanToString, skuIdsToSkuCodes, parseErrorMessages, organizeProductTypes, augmentProductType, groupBy, processQueryParameters, getContentByType } from '../utils'

const useUtilities = () => {
  const navigate = useNavigate()
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
  const checkLinkForNew = target => target?.getAttribute('target')?.includes('blank') || target?.getAttribute('target')?.includes('tab') || target?.getAttribute('target')?.includes('new')

  const eventHandlerForWSIWYG = event => {
    if (event.target.getAttribute('href')) {
      if (event.target.getAttribute('href').includes('tel:') || event.target.getAttribute('href').includes('mailto:')) {
        return
      }
      event.preventDefault()
      if (event.target.getAttribute('href').includes('http') || event.target.getAttribute('href').includes('.pdf')) {
        if (checkLinkForNew(event.target)) {
          window.open(event.target.getAttribute('href'), '_blank')
        } else {
          window.location = event.target.getAttribute('href')
        }
        return
      }
      event.preventDefault()

      if (event.target.getAttribute('target') && checkLinkForNew(event.target)) {
        window.open(event.target.getAttribute('href'), '_blank')
        return
      }
      if (event.target.getAttribute('href').includes('http') && !event.target.getAttribute('href').includes('.pdf')) {
        window.open(event.target.getAttribute('href'), '_blank')
        return
      } else {
        navigate(event.target.getAttribute('href'))
      }
    } else {
      event.preventDefault()

      if (event.target.closest('a')) {
        if (event.target.closest('a').getAttribute('href').includes('http')) {
          if (checkLinkForNew(event.target)) {
            window.open(event.target.closest('a').getAttribute('href'), '_blank')
          } else {
            window.location = event.target.closest('a').getAttribute('href')
          }
          return
        } else {
          navigate(event.target.closest('a').getAttribute('href'))
        }
      }
    }
  }

  return { convertToFullPath, nestDataByKey, eventHandlerForWSIWYG, cleanHTML, renameKeys, renameKeysInArrayOfObjects, isAuthenticated, containsHTML, isString, isBoolean, booleanToString, skuIdsToSkuCodes, parseErrorMessages, organizeProductTypes, augmentProductType, groupBy, processQueryParameters, getContentByType }
}
export { useUtilities }
