import { SWImage } from '..'
import { useProductImage } from '../../hooks/'
import ContentLoader from 'react-content-loader'

const ImageSkeleton = props => {
  return (
    <ContentLoader speed={2} width={200} height={200} viewBox="0 0 200 200" backgroundColor="#f3f3f3" foregroundColor="#dedede" {...props}>
      <rect x="0" y="0" rx="44" ry="44" width="200" height="200" />
    </ContentLoader>
  )
}

const ProductImage = ({ customClass = '', skuID, imageFile, defaultSku_imageFile, customPath, forceImageCall = false, fallbackFileName = '' }) => {
  const { callForImage, request } = useProductImage(skuID, imageFile, defaultSku_imageFile, forceImageCall)

  return (
    <>
      {!callForImage && <SWImage className={customClass} customPath={customPath ? customPath : 'custom/assets/images/product/default/'} src={imageFile || defaultSku_imageFile} alt="Product" fallbackPath={fallbackFileName.length ? `${fallbackFileName}` : ''} />}
      {callForImage && request.isLoaded && <SWImage className={customClass} customPath="/" src={request.data[skuID]} alt="Product" fallbackPath={fallbackFileName.length ? `${fallbackFileName}` : ''} />}
    </>
  )
}

export { ProductImage, ImageSkeleton }
