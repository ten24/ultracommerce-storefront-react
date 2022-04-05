import { useEffect, useState } from 'react'

import { useGetAllOrders } from '../..'

const useOrderHistoryList = ({ pageRecordsShow = 10 }) => {
  const [keyword, setSearchTerm] = useState('')
  let [orders, setRequest] = useGetAllOrders()
  const search = (currentPage = 1) => {
    setRequest({ ...orders, params: { currentPage, pageRecordsShow: 10, keyword }, makeRequest: true, isFetching: true, isLoaded: false })
  }

  useEffect(() => {
    let didCancel = false
    if (!orders.isFetching && !orders.isLoaded && !didCancel) {
      setRequest({ ...orders, isFetching: true, isLoaded: false, params: { pageRecordsShow: pageRecordsShow, keyword }, makeRequest: true })
    }
    return () => {
      didCancel = true
    }
  }, [orders, keyword, setRequest, pageRecordsShow])

  return { search, setSearchTerm, keyword, orders, totalPages: Math.ceil(orders.data.records / pageRecordsShow) }
}
export { useOrderHistoryList }
