import { BreadCrumb, Layout, RelatedProductsSlider, ProductPageHeader, ProductDetailGallery, ProductAdditionalInformation, ProductDetails, ProductPagePanels, SkuOptions, HeartButton, ProductForm, Spinner } from '../../components'
import { useGetEntityByUrlTitleAdvanced, useProductDetail } from '../../hooks'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { disableInteractionSelector, getProductTypeRoute } from '../../selectors'
import queryString from 'query-string'
import { useHistory, useLocation } from 'react-router'

const ProductDetail = () => {
  let location = useLocation()
  let history = useHistory()
  const productTypeRoute = useSelector(getProductTypeRoute)
  const productTypeBase = useSelector(state => state.configuration.filtering.productTypeBase)
  const cart = useSelector(disableInteractionSelector)
  const { filterSkusBySelectedOptions, calculateAvaliableOptions, calculateAdditionalParamters } = useProductDetail()
  // selection is an object of current paramters
  // optionGroupPairs is an array of current paramters key=value
  let params = queryString.parse(location.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  let optionGroupPairs = location.search
    .replace('?', '')
    .split('&')
    .filter(param => param.length)
  const urlTitle = location.pathname.split('/').reverse()
  let { isFetching, product, productOptions, skus, error, attributeSets } = useGetEntityByUrlTitleAdvanced(urlTitle[0])
  if (error.isError) return null
  const selectionToSku = (skus = [], params = []) => {
    let found = skus.filter(sku => {
      return (
        params.filter(code => {
          return sku.slug.includes(code)
        }).length === productOptions.length
      )
    })

    //check if product is of gift card type, if yes then return default sku from sku list (as it will not have options)
    if (product?.productType_productTypeIDPath && product?.defaultSku_skuID && product.productType_productTypeIDPath.includes('50cdfabbc57f7d103538d9e0e37f61e4')) {
      found = skus.filter(sku => sku.skuID === product.defaultSku_skuID)
    }

    return found.length === 1 ? found[0] : null
  }

  let selectedSKu = selectionToSku(skus, optionGroupPairs)
  if (params?.skuid) {
    // If we have a skuID we need to redirect to codes
    console.log('skuID found, waiting for skus', !product)
    const found = skus?.filter(sku => sku.skuID === params.skuid)
    if (!found?.length) return <ProductDetailLoading />
    if (found.length) {
      console.log('Redirect based on found sku')
      history.replace({
        pathname: location.pathname,
        search: found[0].slug,
      })
    }
  }

  if (optionGroupPairs.length === 0 && product.defaultSku_slug) {
    // This check is for no optionGroupPairs passed
    console.log('<------- product.defaultSku_slug', optionGroupPairs, product)
    history.replace({
      pathname: location.pathname,
      search: product.defaultSku_slug,
    })
  }
  //http://localhost:3006/product/demo-product

  const crumbs = product?.data?.breadcrumbs
    ?.map(crumb => {
      return { title: crumb.productTypeName, urlTitle: `/${productTypeRoute}/${crumb.urlTitle}` }
    })
    .filter(crumb => crumb.urlTitle !== `/${productTypeRoute}/${productTypeBase}`)

  const matchingSkus = filterSkusBySelectedOptions(skus, optionGroupPairs)
  const updatedProductOptions = calculateAvaliableOptions(productOptions, params, matchingSkus)
  let updateParams = calculateAdditionalParamters(optionGroupPairs, updatedProductOptions)

  if (updateParams.length) {
    // http://localhost:3006/product/test-product?soccerBallSize=5 ==>  soccerBallColor=green is added
    console.log('Add additional optionGroupPairs because of option matrix')
    history.replace({
      pathname: location.pathname,
      search: [...optionGroupPairs, updateParams].join('&'),
    })
  }
  const isDisabled = isFetching || cart.isFetching || !selectedSKu?.skuID
  return (
    <Layout>
      {product?.productID && (
        <ProductPageHeader title={product.productName}>
          <BreadCrumb crumbs={crumbs} />
        </ProductPageHeader>
      )}
      {product?.productID && <Helmet title={product.settings.productHTMLTitleString} />}

      <div className="container mt-5">
        {!product?.productID && <Spinner />}
        <>
          {selectedSKu && (
            <div className="d-flex justify-content-end">
              <HeartButton skuID={selectedSKu.skuID} className="btn-wishlist mr-0 flex-end" />
            </div>
          )}
          <div className="row">
            <div className="col-sm-6 col-md-4 mb-4 mb-md-0">
              <ProductDetailGallery productUrlTitle={urlTitle[0]} skuID={selectedSKu?.skuID} />
              {product?.productID && <ProductAdditionalInformation additionalInformation={product.additionalInformation} />}
            </div>
            <div className="col-sm-6 col-md-6 offset-md-1">
              {product?.productID && <ProductDetails sku={selectedSKu} product={product} />}
              {!isFetching && !cart.isFetching && skus?.length && <SkuOptions sku={selectedSKu} selection={params} productOptions={updatedProductOptions} skus={skus} />}

              {product?.productID && <ProductForm sku={selectedSKu} isDisabled={isDisabled} isLoading={isFetching || cart.isFetching} />}
              {product?.productID && (
                <div className="row mb-4">
                  <div className="col-md-12">
                    <ProductPagePanels product={product} attributeSets={attributeSets} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      </div>
      <RelatedProductsSlider productUrlTitle={urlTitle[0]} />
    </Layout>
  )
}

const ProductDetailLoading = () => {
  return (
    <Layout>
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
    </Layout>
  )
}

export default ProductDetail
