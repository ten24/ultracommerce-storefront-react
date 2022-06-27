import { useEffect, useState } from 'react'

import { useGetAccountCartsAndQuotes } from '../..'

const useAccountCarts = ({ pageRecordsShow = 10, includeCartsOnly = true}) => {
  const [keyword, setSearchTerm] = useState('')
  let [orders, setRequest] = useGetAccountCartsAndQuotes()
  const search = (currentPage = 1) => {
    setRequest({ ...orders, params: { currentPage, pageRecordsShow, keyword, includeCartsOnly }, makeRequest: true, isFetching: true, isLoaded: false })
  }
  useEffect(() => {
    let didCancel = false
    if (!orders.isFetching && !orders.isLoaded && !didCancel) {
      setRequest({ ...orders, isFetching: true, isLoaded: false, params: { pageRecordsShow, keyword, includeCartsOnly }, makeRequest: true })
    }
    return () => {
      didCancel = true
    }
  }, [orders, keyword, setRequest, pageRecordsShow, includeCartsOnly])
  return { keyword, setSearchTerm, search, orders, totalPages: Math.ceil(orders.data.recordsCount / pageRecordsShow) }
}

export { useAccountCarts }
