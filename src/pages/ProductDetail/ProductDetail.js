import { RedirectWithReplace, BreadCrumb, SkuSelector, Layout, RelatedProductsSlider, ProductReview, ProductPageHeader, ProductDetailGallery, ProductAdditionalInformation, ProductDetails, ProductPagePanels, SkuOptions, HeartButton, ProductForm, Spinner, ProductTypeRadioList, ProductTypeQuote } from '../../components'
import { useGetEntityByUrlTitleAdvanced, useProductDetail, useReview } from '../../hooks'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { disableInteractionSelector, getProductTypeRoute } from '../../selectors'
import queryString from 'query-string'
import { useLocation } from 'react-router'

const ProductDetail = () => {
  let location = useLocation()
  const productTypeRoute = useSelector(getProductTypeRoute)
  const productTypeBase = useSelector(state => state.configuration.filtering.productTypeBase)
  const cart = useSelector(disableInteractionSelector)
  const { filterSkusBySelectedOptions, calculateAvaliableOptions, calculateAdditionalParamters, selectionToSku } = useProductDetail()
  // selection is an object of current paramters
  // optionGroupPairs is an array of current paramters key=value
  let params = queryString.parse(location.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  let optionGroupPairs = location.search
    .replace('?', '')
    .split('&')
    .filter(param => param.length)
  const urlTitle = location.pathname.split('/').reverse()
  const ratingData = useReview(urlTitle[0])
  let { isFetching, product, productOptions, skus, error, attributeSets } = useGetEntityByUrlTitleAdvanced(urlTitle[0])
  if (error.isError) return null

  let selectedSKu = selectionToSku(product, skus, optionGroupPairs, productOptions)
  if (params?.skuid && productOptions?.length) {
    // If we have a skuID we need to redirect to codes
    console.log('skuID found, waiting for skus', !product)
    const found = skus?.filter(sku => sku.skuID === params.skuid)
    if (!found?.length) return <ProductDetailLoading />
    if (found.length) {
      console.log('Redirect based on found sku')
      return <RedirectWithReplace pathname={location.pathname} search={found[0].slug} />
    }
  }
  if (!product) return <RedirectWithReplace pathname="/404" />
  if (optionGroupPairs.length === 0 && product.defaultSku_slug) {
    // This check is for no optionGroupPairs passed
    console.log('<------- product.defaultSku_slug', optionGroupPairs, product)
    return <RedirectWithReplace pathname={location.pathname} search={product.defaultSku_slug} />
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
    return <RedirectWithReplace pathname={location.pathname} search={[...optionGroupPairs, updateParams].join('&')} />
  }
  let isDisabled = isFetching || cart.isFetching || !selectedSKu?.skuID
  if (productOptions?.length === 0 && product.skus.length > 0) {
    console.log('This is a product with skus without option groups')
    if (params?.skuid) {
      selectedSKu = skus?.filter(sku => sku.skuID === params.skuid)?.at(0)
    } else {
      selectedSKu = skus?.filter(sku => sku.skuID === product.defaultSku_skuID)?.at(0)
    }
    isDisabled = false
  }

  if (!product?.productID) return <ProductDetailLoading />
  return (
    <Layout>
      {product?.productID && (
        <ProductPageHeader title={product.productName}>
          <BreadCrumb crumbs={crumbs} />
        </ProductPageHeader>
      )}
      {product?.productID && <Helmet title={product.settings.productHTMLTitleString} />}

      <div className="container mt-5">
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
            {product?.productID && <ProductDetails sku={selectedSKu} product={product} {...ratingData} />}
            {!isFetching && <SkuOptions sku={selectedSKu} selection={params} productOptions={updatedProductOptions} skus={skus} />}
            {!isFetching && product.skus.length > 1 && <SkuSelector sku={selectedSKu} selection={params} productOptions={updatedProductOptions} skus={skus} />}
            <ProductForm sku={selectedSKu} isDisabled={isDisabled} isLoading={isFetching || cart.isFetching} />
            <ProductTypeRadioList selectedSKu={selectedSKu} product={product} isDisabled={isDisabled} isLoading={isFetching || cart.isFetching} />
            <ProductTypeQuote selectedSKu={selectedSKu} product={product} />
            {product?.productID && (
              <div className="row mb-4">
                <div className="col-md-12">
                  <ProductPagePanels product={product} attributeSets={attributeSets} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <RelatedProductsSlider productUrlTitle={urlTitle[0]} />
      <ProductReview productUrlTitle={urlTitle[0]} {...ratingData} />
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
