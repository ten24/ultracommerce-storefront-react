import { useState, useEffect } from 'react'
import { SlatwalApiService, axios } from '../services'
import { useHistory, useLocation } from 'react-router'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../utils'

const headers = {}

export const useGetEntity = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: [], error: '', params: {}, entity: '' })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = { ...request.params, entityName: request.entity, includeAttributesMetadata: true }

      SlatwalApiService.general.getEntity(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess() && response.success().data && response.success().data.pageRecords) {
          setRequest({ data: response.success().data.pageRecords, attributeSets: response.success().attributeSets, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else if (response.isSuccess() && response.success().data && response.success().data[request.entity]) {
          setRequest({ data: response.success().data[request.entity], attributeSets: response.success().attributeSets, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: [], attributeSets: [], isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useGetProductsByEntity = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: [], error: '', params: {}, entity: '' })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = { ...request.params, entityName: 'Product', includeAttributesMetadata: true }

      SlatwalApiService.general.getEntity(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setRequest({ data: response.success().data, attributeSets: response.success().attributeSets, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: [], attributeSets: [], isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}
/*
Currently this only wokrs for product
*/
export const useGetEntityByUrlTitle = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: [], error: '', params: {}, entity: '' })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = { ...request.params, entityName: request.entity, includeAttributesMetadata: true }

      SlatwalApiService.general.getEntity(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setRequest({ data: response.success().data.product, attributeSets: response.success().data.attributeSets, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: [], isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useGetEntityByID = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: [], error: '', params: {}, entity: '' })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = { ...request.params, entityName: request.entity }

      SlatwalApiService.general.getEntity(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setRequest({ data: response.success().data, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: [], isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useGetProductDetails = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: {}, error: '', params: {} })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params
      SlatwalApiService.products.list(payload, headers, source).then(response => {
        if (response.isSuccess() && response.success().pageRecords && response.success().pageRecords.length) {
          setRequest({ data: response.success().pageRecords[0], isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: {}, isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useGetProducts = params => {
  let [request, setRequest] = useState({
    isFetching: false,
    isLoaded: false,
    makeRequest: false,
    params: {},
    filtering: {
      keyword: params.keyword,
      orderBy: params.orderBy,
    },
    data: {
      pageRecords: [],
      limitCountTotal: '',
      currentPage: '',
      pageRecordsCount: '',
      pageRecordsEnd: '',
      pageRecordsShow: '',
      pageRecordsStart: '',
      recordsCount: '',
      totalPages: '',
    },
  })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params
      console.log('payload', payload)
      SlatwalApiService.products.search(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          const { currentPage, pageSize, potentialFilters, products, total } = response.success().data
          const totalPages = Math.ceil(total / pageSize)
          setRequest({
            ...request,
            filtering: { ...request.filtering, ...potentialFilters },
            data: { ...request.data.data, currentPage, pageSize, recordsCount: total, totalPages, pageRecords: products },
            isFetching: false,
            isLoaded: true,
            makeRequest: false,
          })
        } else {
          setRequest({
            data: {
              pageRecords: [],
              limitCountTotal: '',
              currentPage: '',
              pageRecordsCount: '',
              pageRecordsEnd: '',
              pageRecordsShow: '',
              pageRecordsStart: '',
              recordsCount: '',
              totalPages: '',
            },
            isFetching: false,
            makeRequest: false,
            isLoaded: true,
            params: {},
            error: 'Something was wrong',
          })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useGetAvailableShippingMethods = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: {}, error: '', params: {} })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params
      SlatwalApiService.cart.availableShippingMethods(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess() && response.success().pageRecords && response.success().pageRecords.length) {
          setRequest({ data: response.success().pageRecords[0], isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: {}, isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useGetAvailablePaymentMethods = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: {}, error: '', params: {} })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params
      SlatwalApiService.cart.availablePaymentMethods(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess() && response.success().pageRecords && response.success().pageRecords.length) {
          setRequest({ data: response.success().pageRecords[0], isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: {}, isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useAddWishlistItem = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: {}, error: '', params: {} })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params

      SlatwalApiService.orderTemplate.addWishlistItem(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setRequest({ data: response.success().pageRecords, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: {}, isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }

    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useGetOrderDetails = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: {}, error: '', params: {} })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params

      SlatwalApiService.order.getOrderDetails(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setRequest({ data: response.success().orderDetails, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: {}, isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useGetAllOrders = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: [], error: '', params: {} })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params

      SlatwalApiService.account.orders(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setRequest({ data: response.success().ordersOnAccount, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: {}, isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useGetAccountCartsAndQuotes = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: [], error: '', params: {} })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params

      SlatwalApiService.account.cartsAndQuotes(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setRequest({ data: response.success().cartsAndQuotesOnAccount.ordersOnAccount, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: {}, isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useResizedImageByProfileName = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: [], error: '', params: { profileName: 'listing', skuIDs: '' } })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params

      SlatwalApiService.products.getImagePaths(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setRequest({ data: response.success().resizedImagePaths, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: {}, isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useAddOrderShippingAddress = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: {}, error: '', params: {} })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params

      SlatwalApiService.cart.addShippingAddress(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setRequest({ data: response.success(), isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: {}, isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useGetProductAvailableSkuOptions = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: { sku: {} }, error: '', params: {} })
  const loc = useLocation()
  const history = useHistory()
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params

      SlatwalApiService.products.getDetails(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setRequest({ data: response.success(), isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: { sku: {} }, isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest, loc, history])

  return [request, setRequest]
}

export const useGetProductSkuSelected = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: {}, error: '', params: {} })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params

      SlatwalApiService.products.getSkuSelected(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setRequest({ data: response.success(), isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: {}, isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useGetSkuOptionDetails = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: [], error: '', params: {} })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params

      SlatwalApiService.products.getSkuOptionDetails(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          const filterdOptions = Object.keys(response.success().skuOptionDetails)
            .map(key => {
              return response.success().skuOptionDetails[key]
            })
            .sort((a, b) => a.sortOrder - b.sortOrder)
          setRequest({ data: filterdOptions, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: [], isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}

export const useGetProductImageGallery = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: {}, error: '', params: {} })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = request.params

      SlatwalApiService.products.getGallery(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          setRequest({ data: response.success(), isFetching: false, isLoaded: true, makeRequest: false, params: {} })
        } else {
          setRequest({ data: {}, isFetching: false, makeRequest: false, isLoaded: true, params: {}, error: 'Something was wrong' })
        }
      })
    }
    return () => {
      source.cancel()
    }
  }, [request, setRequest])

  return [request, setRequest]
}
