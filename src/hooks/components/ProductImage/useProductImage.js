import { useEffect } from 'react'
import { useResizedImageByProfileName } from '../../'
import { useSelector } from 'react-redux'
import { getImageFallbackFlag } from '../../../selectors'

const useProductImage = ({ skuID, imageFile, defaultSku_imageFile, forceImageCall = false }) => {
  const imageFallbackFlag = useSelector(getImageFallbackFlag)
  let [imageRequest, setImageRequest] = useResizedImageByProfileName()
  const callForImage = (!imageFile || !defaultSku_imageFile) && (imageFallbackFlag || forceImageCall)
  useEffect(() => {
    let didCancel = false
    if (!didCancel && !imageRequest.isFetching && !imageRequest.isLoaded && callForImage) {
      setImageRequest({
        ...imageRequest,
        params: { skuIDs: skuID, profileName: 'listing' },
        makeRequest: true,
        isFetching: true,
        isLoaded: false,
      })
    }
    return () => {
      didCancel = true
    }
  }, [imageRequest, setImageRequest, skuID, callForImage])

  return { callForImage, imageRequest }
}

export { useProductImage }
