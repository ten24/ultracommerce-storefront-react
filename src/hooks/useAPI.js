import { useState, useEffect } from 'react'
import { SlatwalApiService, axios } from '../services'
import { useHistory, useLocation } from 'react-router'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../utils'
import { useSelector } from 'react-redux'

const headers = {}

export const useGetEntity = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: [], error: '', params: {}, entity: '' })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = { ...request.params, entityName: request.entity }

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

export const useGetProductsByEntityModified = () => {
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: [], error: '', params: {}, entity: '' })
  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = { ...request.params, entityName: 'Product', includeAttributesMetadata: true }

      SlatwalApiService.general.getEntity(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          const products = response.success().data.pageRecords.map(product => {
            return { ...product, brandName: product.brand_brandName, brandUrlTitle: product.brand_urlTitle, imageFile: product.defaultSku_imageFile, skuCode: product.defaultSku_skuCode, product: product.defaultSku_imageFile, skuID: product.defaultSku_skuID }
          })
          setRequest({ data: products, attributeSets: response.success().attributeSets, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
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
const defaultParams = { products: [], potentialFilters: {}, total: 0, pageSize: 12, totalPages: 1 }

export const useGetProductsWithPagination = filters => {
  let [isFetching, setFetching] = useState(true)
  let [data, setData] = useState(defaultParams)
  let [error, setError] = useState({ isError: false, message: '' })

  useEffect(() => {
    let source = axios.CancelToken.source()
    const payload = JSON.parse(filters)
    setFetching(true)
    SlatwalApiService.products.search(payload, headers, source).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) setError({ isError: true, message: getErrorMessage(response.success().errors) })
      if (response.isSuccess()) {
        setData(response.success().data)
      } else {
        setData(defaultParams)
        setError({ isError: true, message: 'Something was wrong' })
      }
      setFetching(false)
    })

    return () => {
      source.cancel()
    }
  }, [filters])
  return { isFetching, records: data.products, potentialFilters: data.potentialFilters, total: data.total, totalPages: Math.ceil(data.total / data.pageSize), error }
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

export const useGetEntityByUrlTitleAdvanced = (urlTitle, params = {}) => {
  let [isFetching, setFetching] = useState(true)
  let [data, setData] = useState({ product: {}, totalRecords: 0, totalPages: 1 })
  let [error, setError] = useState({ isError: false, message: '' })

  useEffect(() => {
    let source = axios.CancelToken.source()
    setFetching(true)
    const payload = { urlTitle, entityName: 'product', includeAttributesMetadata: true, includeCategories: true, includeOptions: true, includeSkus: true, includeSettings: true, ...params }
    SlatwalApiService.general.getEntity(payload, headers, source).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        let data = response.success().data
        data.product?.skus?.forEach(sku => {
          sku.slug = sku.options.map(opt => `${opt.optionGroupCode}=${opt.optionCode}`).join('&')
        })
        if (data.product?.defaultSku_skuID?.length && data.product?.skus?.length) {
          const defaultSku = data.product?.skus.filter(sku => sku.skuID === data.product?.defaultSku_skuID)
          if (defaultSku.length) {
            data.product.defaultSku_slug = defaultSku[0].options.map(opt => `${opt.optionGroupCode}=${opt.optionCode}`).join('&')
          }
        }
        setData(data)
      } else {
        setData([])
        setError({ isError: true, message: 'Something was wrong' })
      }
      setFetching(false)
    })

    return () => {
      source.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTitle])
  return { isFetching, product: data.product, attributeSets: data.attributeSets, productOptions: data?.product?.optionGroups, skus: data?.product?.skus, error }
}
export const useGetEntityWithPagination = (entity, currentPage, maxCount, orderBy, filters = '{}') => {
  let [isFetching, setFetching] = useState(true)
  let [data, setData] = useState({ pageRecords: [], totalRecords: 0, totalPages: 1 })
  let [error, setError] = useState({ isError: false, message: '' })
  useEffect(() => {
    let source = axios.CancelToken.source()
    const parsedFilters = JSON.parse(filters)
    const payload = { 'f:activeFlag': 1, orderBy, 'p:current': currentPage, 'P:Show': maxCount, entityName: entity, ...parsedFilters }
    setFetching(true)

    SlatwalApiService.general.getEntity(payload, headers, source).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) setError({ isError: true, message: getErrorMessage(response.success().errors) })
      if (response.isSuccess() && response.success().data && response.success().data.pageRecords) {
        setData(response.success().data)
      } else if (response.isSuccess() && response.success().data && response.success().data[entity]) {
        setData(response.success().data[entity])
      } else {
        setData([])
        setError({ isError: true, message: 'Something was wrong' })
      }
      setFetching(false)
    })

    return () => {
      source.cancel()
    }
  }, [entity, currentPage, maxCount, orderBy, filters])
  return { isFetching, records: data.pageRecords, totalRecords: data.pageRecordsCount, totalPages: data.totalPages, error }
}
export const useGetProducts = params => {
  const propertyIdentifierList = useSelector(state => state.configuration.listings.productListing.params)
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
  if (!!params['brand_slug'] || !!params['productType_slug']) {
    params['returnFacetList'] = 'brand,option,category,attribute,sorting,priceRange,productType' // if hide we should correct
  } else {
    params['returnFacetList'] = 'brand,sorting,productType'
  }

  useEffect(() => {
    let source = axios.CancelToken.source()
    if (request.makeRequest) {
      const payload = { ...propertyIdentifierList, ...request.params, includePagination: true }

      SlatwalApiService.products.search(payload, headers, source).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          const { currentPage, pageSize, potentialFilters, total } = response.success().data
          const totalPages = Math.ceil(total / pageSize)
          const products = response.success().data.products.map(sku => {
            return { ...sku, salePrice: sku.skuPrice, productName: sku.product_productName, urlTitle: sku.product_urlTitle, productCode: sku.product_productCode, imageFile: sku.sku_imageFile, skuID: sku.sku_skuID, skuCode: sku.sku_skuCode }
          })

          setRequest({
            ...request,
            filtering: { ...potentialFilters },
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
  }, [request, setRequest, propertyIdentifierList])

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

      SlatwalApiService.order.get(payload, headers, source).then(response => {
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
          setRequest({ data: response.success().cartsAndQuotesOnAccount, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
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

export const useGetProductImageGallery = urlTitle => {
  let [isFetching, setFetching] = useState(true)
  let [imageGallery, setImageGallery] = useState([])
  let [error, setError] = useState({ isError: false, message: '' })
  useEffect(() => {
    let source = axios.CancelToken.source()
    SlatwalApiService.products.getGallery({ urlTitle, resizeSizes: 'large,small' }, headers, source).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) setError({ isError: false, message: getErrorMessage(response.success().errors) })
      if (response.isSuccess()) {
        setImageGallery(response.success().images)
      } else {
        setImageGallery({})
      }
      setFetching(false)
    })
    return () => {
      source.cancel()
    }
  }, [urlTitle])

  return { isFetching, imageGallery, error }
}
