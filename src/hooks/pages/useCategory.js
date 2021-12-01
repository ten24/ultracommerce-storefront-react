import { useGetEntity, useGetEntityByID } from '../useAPI'
import { useSelector } from 'react-redux'
import { getCategoryRoute } from '../../selectors'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import { useUtilities } from '../useUtilities'

const useCategory = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const pathKey = pathname.split('/').reverse()[0]
  const history = useHistory()
  const { nestDataByKey } = useUtilities()
  const categoryRoute = useSelector(getCategoryRoute)
  const [categoryRequest, setCategoryRequest] = useGetEntityByID()
  const [categoryListRequest, setCategoryListRequest] = useGetEntity()
  let isError = false
  let errorMessage = ''
  const crumbCalculator = () => {
    return categoryRequest?.data?.ancestors
      ?.map(crumb => {
        return { title: crumb.categoryName, urlTitle: crumb.urlTitle }
      })
      .filter(crumb => crumb.urlTitle !== pathKey)
      .map(crumb => {
        return { ...crumb, urlTitle: `/${categoryRoute}/${crumb.urlTitle}` }
      })
  }

  useEffect(() => {
    const unload = history.listen(location => {
      const urlTitle = location.pathname.split('/').reverse()[0]
      const hasData = !!categoryListRequest.data.filter(pt => pt.urlTitle === urlTitle).length
      if (!hasData && categoryListRequest.data.length > 0) {
        setCategoryRequest({ ...categoryRequest, data: {}, isFetching: false, isLoaded: false, params: { urlTitle }, makeRequest: true })
      } else {
      }
    })
    return () => {
      unload()
    }
  }, [history, setCategoryRequest, categoryRequest, setCategoryListRequest, categoryListRequest])
  useEffect(() => {
    setCategoryRequest({ ...categoryRequest, isFetching: true, isLoaded: false, entity: 'category', params: { urlTitle: pathKey, 'f:allowProductAssignmentFlag': true }, makeRequest: true })
    setCategoryListRequest({ ...categoryListRequest, data: [], isFetching: true, isLoaded: false, entity: 'category', params: { 'f:allowProductAssignmentFlag': true, 'p:show': 250, includeSettingsInList: true }, makeRequest: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!categoryRequest?.isFetching && categoryRequest?.isLoaded && Object.keys(categoryRequest?.data)?.length === 0) {
    isError = true
    errorMessage = t('frontend.core.error.no_products')
  }
  let categoryData = nestDataByKey(categoryListRequest.data, 'parentCategory_categoryID', 'categoryID')
  categoryData = categoryData.filter(con => con.urlTitle === pathKey).reduce((accumulator, con) => con, {})

  return { categoryRequest, categoryData, categoryListRequest, crumbCalculator, categoryRoute, isError, errorMessage }
}
export { useCategory }
