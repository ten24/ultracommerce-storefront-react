import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { cleanHTML, renameKeys, renameKeysInArrayOfObjects, isAuthenticated, containsHTML, isString, isBoolean, booleanToString, skuIdsToSkuCodes, parseErrorMessages, organizeProductTypes, augmentProductType, groupBy, processQueryParameters } from '../utils'

const useUtilities = () => {
  let history = useHistory()
  const { basePath, host } = useSelector(state => state.configuration.theme)
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

  return { convertToFullPath, eventHandlerForWSIWYG, cleanHTML, renameKeys, renameKeysInArrayOfObjects, isAuthenticated, containsHTML, isString, isBoolean, booleanToString, skuIdsToSkuCodes, parseErrorMessages, organizeProductTypes, augmentProductType, groupBy, processQueryParameters }
}
export { useUtilities }
