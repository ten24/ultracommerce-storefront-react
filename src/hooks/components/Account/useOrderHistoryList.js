import { useEffect, useState } from 'react'

import { useGetAllOrders } from '../..'

const useOrderHistoryList = ({ pageRecordsShow = 10, params = '{}' }) => {
  const [keyword, setSearchTerm] = useState('')
  let [orders, setRequest] = useGetAllOrders()
  const search = (currentPage = 1) => {
    const preFilter = JSON.parse(params)
    setRequest({ ...orders, params: { ...preFilter, currentPage, pageRecordsShow: 10, keyword }, makeRequest: true, isFetching: true, isLoaded: false })
  }

  useEffect(() => {
    const preFilter = JSON.parse(params)
    let didCancel = false
    if (!orders.isFetching && !orders.isLoaded && !didCancel) {
      setRequest({ ...orders, isFetching: true, isLoaded: false, params: { ...preFilter, pageRecordsShow: pageRecordsShow, keyword }, makeRequest: true })
    }
    return () => {
      didCancel = true
    }
  }, [orders, keyword, setRequest, pageRecordsShow, params])

  return { search, setSearchTerm, keyword, orders, totalPages: Math.ceil(orders.data.records / pageRecordsShow) }
}
export { useOrderHistoryList }
