import { useEffect } from 'react'
import { useGetAllOrders } from '../../../hooks/'

const useAccountOverview = () => {
  let [orders, setRequest] = useGetAllOrders()
  useEffect(() => {
    let didCancel = false
    if (!orders.isFetching && !orders.isLoaded && !didCancel) {
      setRequest({ ...orders, isFetching: true, isLoaded: false, params: {}, makeRequest: true })
    }
    return () => {
      didCancel = true
    }
  }, [orders, setRequest])

  return { orders }
}

export { useAccountOverview }
