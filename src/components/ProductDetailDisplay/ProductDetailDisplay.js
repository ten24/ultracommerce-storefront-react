import { RedirectWithReplace, BreadCrumb, SkuSelector, ProductReview, ProductPageHeader, ProductDetailGallery, ProductDetails, ProductPagePanels, SkuOptions, HeartButton, ProductForm, ProductTypeRadioList, ProductBundle, ProductTypeQuote } from '..'
import { useProductDetail, useReview } from '../../hooks'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { disableInteractionSelector, getProductTypeRoute } from '../../selectors'
import queryString from 'query-string'
import { useLocation, useNavigate } from 'react-router'
import { ProductOutOfStock, validateProductOutOfStock } from '..'
import { useState } from 'react'
import { useElementContext } from '../../contexts/ElementContextProvider'
import { ProductContextProvider, useProductContext } from '../../contexts/ProductContext'
import { SkuContextProvider } from '../../contexts/SkuContext'

const ProductDetailDisplay = props => {
  let location = useLocation()
  const urlTitle = location.pathname.split('/').reverse()

  return (
    <ProductContextProvider urlTitle={urlTitle[0]}>
      <ProductDetailDisplayDetail {...props} />
    </ProductContextProvider>
  )
}

const ProductDetailDisplayDetail = props => {
  const { productPageDisplayConfiguration = '{}' } = props
  const displayConfig = JSON.parse(productPageDisplayConfiguration)
  const [lastSelection, setLastSelection] = useState({ optionGroupCode: '', optionCode: '' })
  let location = useLocation()
  const { RelatedProductsSlider } = useElementContext()
  const navigate = useNavigate()
  const productTypeRoute = useSelector(getProductTypeRoute)
  const productTypeBase = useSelector(state => state.configuration.filtering.productTypeBase)
  const cart = useSelector(disableInteractionSelector)
  const { calculateAvaliableOptions, calculateAdditionalParamters, selectionToSku } = useProductDetail()
  // selection is an object of current paramters
  // optionGroupPairs is an array of current paramters key=value
  let params = queryString.parse(location.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  let optionGroupPairs = location.search
    .replace('?', '')
    .split('&')
    .filter(param => param.length)
  const urlTitle = location.pathname.split('/').reverse()
  const ratingData = useReview(urlTitle?.at(0))
  const [quantity, setQuantity] = useState(1)
  let { product, productOptions, skus, attributeSets, productBundle, productBundleBuildOnAccount, settings } = useProductContext()

  let selectedSKu = selectionToSku(product, skus, optionGroupPairs, productOptions)
  if (params?.skuid && productOptions?.length) {
    // If we have a skuID we need to redirect to codes
    console.log('skuID found, waiting for skus', !product)
    const found = skus?.filter(sku => sku.skuID === params.skuid)
    if (found.length) {
      return navigate(
        {
          pathname: location.pathname,
          search: found?.at(0).slug,
        },
        { replace: true }
      )
    }
  }
  if (!product) return <RedirectWithReplace pathname="/404" />
  if (optionGroupPairs.length === 0 && product.defaultSku_slug) {
    // This check is for no optionGroupPairs passed
    console.log('<------- product.defaultSku_slug', optionGroupPairs, product)

    return <RedirectWithReplace pathname={location.pathname} search={product.defaultSku_slug} />
  }
  //http://localhost:3006/product/demo-product

  const crumbs = product?.breadcrumbs
    ?.map(crumb => {
      return { title: crumb.productTypeName, urlTitle: `/${productTypeRoute}/${crumb.urlTitle}` }
    })
    .filter(crumb => crumb.urlTitle !== `/${productTypeRoute}/${productTypeBase}`)

  // const matchingSkus = filterSkusBySelectedOptions(skus, optionGroupPairs)
  let updatedProductOptions = calculateAvaliableOptions(productOptions, lastSelection, skus)
  let updateParams = calculateAdditionalParamters(optionGroupPairs, updatedProductOptions)

  if (updateParams.length) {
    // http://localhost:3006/product/test-product?soccerBallSize=5 ==>  soccerBallColor=green is added
    console.log('Add additional optionGroupPairs because of option matrix')

    return <RedirectWithReplace pathname={location.pathname} search={[...optionGroupPairs, updateParams].join('&')} />
  }
  let isDisabled = cart.isFetching || !selectedSKu?.skuID
  if (productOptions?.length === 0 && skus.length > 0) {
    console.log('This is a product with skus without option groups')

    if (params?.skuid) {
      selectedSKu = skus?.filter(sku => sku.skuID === params.skuid)?.at(0)
    } else {
      selectedSKu = skus?.filter(sku => sku.skuID === product.defaultSku_skuID)?.at(0)
    }
    isDisabled = false
  }

  //set out of stock flag if loading is completed and calculatedQATS of selected sku is not valid
  const isOutOfStock = !cart.isFetching && validateProductOutOfStock(selectedSKu)

  return (
    <SkuContextProvider sku={selectedSKu}>
      <ProductPageHeader title={product.productName}>
        <BreadCrumb crumbs={crumbs} />
      </ProductPageHeader>
      <Helmet title={settings.productHTMLTitleString} />
      <div className="container mt-5">
        {selectedSKu && displayConfig?.enableFavorites && (
          <div className="d-flex justify-content-end">
            <HeartButton skuID={selectedSKu.skuID} className="btn-wishlist mr-0 flex-end" />
          </div>
        )}
        <div className="row">
          <div className="col-sm-6 col-md-4 mb-4 mb-md-0">
            <ProductDetailGallery productUrlTitle={urlTitle?.at(0)} skuID={selectedSKu?.skuID} />
          </div>
          <div className="col-sm-6 col-md-6 offset-md-1">
            <ProductDetails sku={selectedSKu} product={product} {...ratingData} />

            <SkuOptions setLastSelection={setLastSelection} sku={selectedSKu} selection={params} productOptions={updatedProductOptions} skus={skus} />
            {skus.length > 1 && <SkuSelector sku={selectedSKu} selection={params} productOptions={updatedProductOptions} skus={skus} />}
            <ProductOutOfStock isFetching={false} sku={selectedSKu} />
            {!isOutOfStock && (
              <>
                <ProductForm sku={selectedSKu} quantity={quantity} setQuantity={setQuantity} isDisabled={isDisabled} isLoading={cart.isFetching} />
                <ProductTypeRadioList selectedSKu={selectedSKu} product={product} isDisabled={isDisabled} isLoading={cart.isFetching} />
                <ProductTypeQuote selectedSKu={selectedSKu} product={product} quantity={quantity} />
              </>
            )}
            <div className="row mb-4">
              <div className="col-md-12">
                <ProductPagePanels product={product} attributeSets={attributeSets} />
              </div>
            </div>
          </div>
        </div>
        <ProductBundle productBundle={productBundle} productBundleBuildOnAccount={productBundleBuildOnAccount} productID={product?.productID} />
      </div>
      {displayConfig?.showRelatedProducts && <RelatedProductsSlider productUrlTitle={urlTitle?.at(0)} />}
      {displayConfig?.showReviews && <ProductReview productUrlTitle={urlTitle?.at(0)} {...ratingData} />}
      {props.children}
    </SkuContextProvider>
  )
}

export { ProductDetailDisplay }
