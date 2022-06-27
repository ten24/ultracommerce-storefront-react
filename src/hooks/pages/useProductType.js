import { useGetEntity } from '../../hooks/useAPI'
import { useSelector } from 'react-redux'
import { getProductTypeRoute } from '../../selectors/configurationSelectors'
import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useUtilities } from '../useUtilities'

const useProductType = () => {
  const { id } = useParams()
  const history = useHistory()
  const { augmentProductType } = useUtilities()
  const productTypeRoute = useSelector(getProductTypeRoute)
  const productTypeBase = useSelector(state => state.configuration.filtering.productTypeBase)
  const [productTypeRequest, setProductTypeRequest] = useGetEntity()
  const [productTypeListRequest, setProductTypeListRequest] = useGetEntity()
  let isError = false
  let errorMessage = ''
  const crumbCalculator = () => {
    return productTypeRequest.data?.ancestors
      ?.map(crumb => {
        return { title: crumb.productTypeName, urlTitle: crumb.urlTitle }
      })
      .filter(crumb => crumb.urlTitle !== productTypeBase)
      .filter(crumb => crumb.urlTitle !== id)
      .map(crumb => {
        return { ...crumb, urlTitle: `/${productTypeRoute}/${crumb.urlTitle}` }
      })
  }
  useEffect(() => {
    const unload = history.listen(location => {
      const urlTitle = location.pathname.split('/').reverse()[0]
      const hasData = !!productTypeListRequest.data.filter(pt => pt.urlTitle === urlTitle).length
      if (!hasData && productTypeListRequest.data.length > 0) {
        setProductTypeRequest({ ...productTypeRequest, data: {}, isFetching: false, isLoaded: false, params: { urlTitle }, makeRequest: true })
        setProductTypeListRequest({ ...productTypeListRequest, data: [], isFetching: false, isLoaded: false, params: {}, makeRequest: false })
      } else {
      }
    })
    return () => {
      unload()
    }
  }, [history, setProductTypeRequest, productTypeRequest, setProductTypeListRequest, productTypeListRequest])

  if (!productTypeRequest.isFetching && !productTypeRequest.isLoaded) {
    setProductTypeRequest({ ...productTypeRequest, isFetching: true, isLoaded: false, entity: 'productType', params: { urlTitle: id }, makeRequest: true })
  }
  if (!productTypeRequest.isFetching && productTypeRequest.isLoaded && Object.keys(productTypeRequest.data).length === 0) {
    isError = true
    //throw new Error(t('frontend.core.error.title'))
  }
  if (!productTypeListRequest.isFetching && !productTypeListRequest.isLoaded && productTypeRequest.isLoaded) {
    setProductTypeListRequest({ ...productTypeListRequest, data: [], isFetching: true, isLoaded: false, entity: 'productType', params: { 'f:productTypeIDPath:like': `%${productTypeRequest.data.productTypeID}%`, 'p:show': 250, includeSettingsInList: true }, makeRequest: true })
  }
  const productTypeData = augmentProductType(id, productTypeListRequest.data)

  return { productTypeRequest, productTypeData, productTypeListRequest, crumbCalculator, productTypeRoute, isError, errorMessage }
}

export { useProductType }
