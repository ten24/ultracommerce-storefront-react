import { useSelector } from 'react-redux'

const useUtilities = () => {
  const { basePath, host } = useSelector(state => state.configuration.theme)

  const convertToFullPath = (file = '') => {
    if (file.includes('http')) {
      return file
    } else {
      return host + basePath + file
    }
  }

  return { convertToFullPath: convertToFullPath }
}
export { useUtilities }
