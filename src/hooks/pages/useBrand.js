import { useSelector } from 'react-redux'
import { useLocation } from 'react-use'
import queryString from 'query-string'
import { useEffect } from 'react'
import { useGetEntity } from '../useAPI'
import { getBrandRoute } from '../../selectors'
import { useUtilities } from '../useUtilities'

const useBrand = () => {
  const loc = useLocation()
  const brandRoute = useSelector(getBrandRoute)
  const productTypeBase = useSelector(state => state.configuration.filtering.productTypeBase)
  const [brandResponse, setBrandRequest] = useGetEntity()
  const [productTypeRequest, setProductTypeRequest] = useGetEntity()
  const { augmentProductType } = useUtilities()
  const path = loc.pathname.split('/').reverse()
  const params = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  const productTypeUrl = params['key'] || productTypeBase
  let isError = false
  let errorMessage = ''
  const crumbCalculator = () => {
    return productTypeRequest.data
      ?.filter(productType => {
        return productTypeData?.productTypeIDPath?.includes(productType.productTypeID)
      })
      .map(crumb => {
        return { title: crumb.productTypeName, urlTitle: crumb.urlTitle }
      })
      .filter(crumb => crumb.urlTitle?.toLowerCase() !== productTypeBase?.toLowerCase())
      .filter(crumb => crumb.urlTitle?.toLowerCase() !== productTypeUrl?.toLowerCase())
      .map(crumb => {
        return { ...crumb, urlTitle: `${loc.pathname}?${queryString.stringify({ key: crumb.urlTitle }, { arrayFormat: 'comma' })}` }
      })
  }

  useEffect(() => {
    if (!productTypeRequest.isFetching && !productTypeRequest.isLoaded) {
      setProductTypeRequest({
        ...productTypeRequest,
        isFetching: true,
        isLoaded: false,
        entity: 'ProductType',
        params: { brandUrlTitle: path[0], 'p:show': 250, includeSettingsInList: true, includeImages: true },
        makeRequest: true,
      })
    }
    if (!brandResponse.isFetching && !brandResponse.isLoaded) {
      setBrandRequest({ ...brandResponse, isFetching: true, isLoaded: false, entity: 'brand', params: { 'f:urlTitle': path[0], includeImages: true, includeSettings: true }, makeRequest: true })
    }
  }, [productTypeUrl, setBrandRequest, brandResponse, path, setProductTypeRequest, productTypeRequest])

  if (!productTypeRequest.isFetching && productTypeRequest.isLoaded && Object.keys(productTypeRequest.data).length === 0) {
    isError = true
    // throw new Error(t('frontend.core.error.title'))
  }

  const productTypeData = augmentProductType(productTypeUrl, productTypeRequest.data)
  const subHeading = productTypeData?.productTypeName?.toLowerCase() === productTypeBase?.toLowerCase() ? '' : productTypeData?.productTypeName
  const urlTitle = `/${brandRoute}/${brandResponse?.data[0]?.urlTitle}`
  const title = brandResponse?.data[0]?.brandName
  const slug = brandResponse?.data[0]?.urlTitle
  return { brandResponse, productTypeRequest, productTypeData, brandKey: params['key'], crumbCalculator, subHeading, slug, urlTitle, title, params, pathname: loc.pathname, isError, errorMessage }
}
export { useBrand }
