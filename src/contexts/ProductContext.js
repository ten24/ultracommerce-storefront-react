import { createContext, useContext, useEffect, useState } from 'react'
import { axios, SlatwalApiService } from '../services'
import { STATUS } from './Globals'
import queryString from 'query-string'
import { useLocation } from 'react-router'
import { Spinner } from '../components'

const ProductContext = createContext()

const initialProduct = {
  data: null,
  product: null,
  breadcrumbs: null,
  settings: null,
  skus: null,
  productOptions: null,
  productBundle: null,
  attributeSets: null,
  productBundleBuildOnAccount: null,
  status: STATUS.IDLE,
}

const ProductContextProvider = ({ children, urlTitle }) => {
  const [product, setProduct] = useState(initialProduct)
  const [status, setStatus] = useState()
  const [, setErrors] = useState({})
  let location = useLocation()
  let params = queryString.parse(location.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  // fetch a user from a fake backend API field-courts-supply-company-hockey-goal-backstop
  useEffect(() => {
    let source = axios.CancelToken.source()

    setProduct({ ...initialProduct, status: STATUS.PENDING })
    // this would usually be your own backend, or localStorage
    // for example

    SlatwalApiService.general
      .getEntity({ urlTitle, entityName: 'product', includeAttributesMetadata: true, includeCategories: true, includeOptions: true, includeSkus: true, includeSettings: true, ...params }, {}, source)
      .then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) setErrors(response.success().errors)

        if (response.isSuccess() && response.success().data?.product) {
          let rawProductData = response.success().data.product
          rawProductData?.skus?.forEach(sku => {
            sku.slug = sku.options.map(opt => `${opt.optionGroupCode}=${opt.optionCode}`).join('&')
          })
          rawProductData?.optionGroups
            ?.map(group => {
              group?.options?.sort((a, b) => a.sortOrder - b.sortOrder)
              return group
            })
            ?.sort((a, b) => a.sortOrder - b.sortOrder)

          if (rawProductData?.defaultSku_skuID?.length && rawProductData?.skus?.length) {
            const defaultSku = rawProductData?.skus.filter(sku => sku.skuID === rawProductData?.defaultSku_skuID)
            if (defaultSku.length) {
              rawProductData.defaultSku_slug = defaultSku
                ?.at(0)
                .options.map(opt => `${opt.optionGroupCode}=${opt.optionCode}`)
                .join('&')
            }

            let payload = { product: rawProductData, breadcrumbs: rawProductData?.breadcrumbs, settings: rawProductData?.settings, skus: rawProductData?.skus, attributeSets: rawProductData?.attributeSets, productOptions: rawProductData?.optionGroups, productBundle: rawProductData?.productBundle, productBundleBuildOnAccount: rawProductData?.productBundleBuildOnAccount }
            if (payload?.product?.productBundle) delete payload.product.productBundle
            if (payload?.product?.productBundleBuildOnAccount) delete payload.product.productBundleBuildOnAccount
            if (payload?.product?.breadcrumbs) delete payload.product.breadcrumbs
            // if (payload?.product?.settings) delete payload.product.settings
            if (payload?.product?.skus) delete payload.product.skus
            if (payload?.product?.attributeSets) delete payload.product.attributeSets
            setProduct(payload)
            setStatus(STATUS.DONE)
          } else {
            setStatus(STATUS.ERROR)
            setProduct({ ...initialProduct })
          }
        }
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.log('Request Aborted')
          // We know it's been canceled!
        } else {
          setStatus(STATUS.ERROR)
          setProduct({ ...initialProduct })
          console.log('An error occured')
        }
      })

    return () => {
      source.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTitle])

  if (!product.product) return <ProductDetailLoading />
  if (status !== STATUS.DONE) return null
  if (!product?.product) return <p>Missing Product</p>
  return <ProductContext.Provider value={product}>{children}</ProductContext.Provider>
}

const ProductDetailLoading = () => {
  return (
    <div className="container mt-5">
      <Spinner />
      <div className="d-flex justify-content-end"></div>
      <div className="row">
        <div className="col-sm-6 col-md-4 mb-4 mb-md-0"></div>
        <div className="col-sm-6 col-md-6 offset-md-1">
          <div className="row mb-4">
            <div className="col-md-12"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const useProductContext = () => {
  // get the context
  const context = useContext(ProductContext)

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useProductContext was used outside of its Provider')
  }

  return context
}

const useProductAttributeSetsContext = () => {
  // get the context
  const context = useContext(ProductContext)

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useProductContext was used outside of its Provider')
  }

  return context.attributeSets
}

const useProductSkusContext = () => {
  // get the context
  const context = useContext(ProductContext)

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useProductContext was used outside of its Provider')
  }

  return context.skus
}
export { ProductContext, ProductContextProvider, useProductContext, useProductAttributeSetsContext, useProductSkusContext }
