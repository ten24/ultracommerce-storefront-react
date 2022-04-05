import React, { useEffect, useState } from 'react'
import { useUtilities } from '../../hooks'
import { useGetEntityByUrlTitleAdvanced, useProductDetail } from '../../hooks'
import { ProductDetailGallery, ProductDetailHeading, ProductPrice, ProductAttributes, SkuOptions, ProductForm } from '../../components'
import { disableInteractionSelector } from '../../selectors'
import { useSelector } from 'react-redux'

const modalSizes = {
  default: '',
  small: 'modal-sm',
  large: 'modal-lg',
  xLarge: 'modal-xl',
}

const Modal = ({ show = true, setShow, title = 'Modal Title', children, size = 'default', footer = false }) => {
  return (
    <div className="modal" tabIndex="-1" aria-modal="true" role="dialog" style={{ display: show ? 'inline' : 'none' }} onClick={() => setShow(false)}>
      <div className={'modal-dialog modal-dialog-centered ' + modalSizes[size]} onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShow(false)}></button>
          </div>
          <div className="modal-body">{children}</div>
          {footer && (
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShow(false)}>
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ProductModalHeading = ({ title, skuCode = '', setShow }) => {
  return (
    <div>
      <div className="modal-header">
        <h3 className="modal-title">Configuring: {title}</h3>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={() => {
            setShow(false)
          }}
        ></button>
      </div>
      <div className="modal-header">
        <h5 className="modal-title">SKU: {skuCode}</h5>
      </div>
    </div>
  )
}

const selectionSlugToObject = selectedOptions =>
  selectedOptions.reduce((acc, opt) => {
    opt = opt.split('=')
    acc[opt[0]] = opt[1]
    return acc
  }, {})

const selectionObjectPairs = selectedOptions => Object.keys(selectedOptions).map(key => `${key}=${selectedOptions[key]}`)

/*
    All
    sportingsockteamstripedsock-6: sockSize=adultLarge&colors=global-blue-navy  | 8ab1948a7fe401e9017fe6159a470286
    sportingsockteamstripedsock-5: sockSize=adultLarge&colors=global-yellow     | 2c91808b737220f00173814949cd002c
    sportingsockteamstripedsock-4: sockSize=youthLarge&colors=global-yellow     | 2c91808b737220f0017381491543002b
    sportingsockteamstripedsock-3: sockSize=youthMedium&colors=global-yellow    | 2c91808b737220f001738148e22f002a
    sportingsockteamstripedsock-2: sockSize=youthSmall&colors=global-yellow     | 2c91808b737220f0017381487d600029
    sportingsockteamstripedsock-1: colors=global-black&sockSize=youthSmall      | 2c91808b737220f00173813beace0027


    colors=global-yellow
    sportingsockteamstripedsock-5: sockSize=adultLarge&colors=global-yellow     | 2c91808b737220f00173814949cd002c
    sportingsockteamstripedsock-4: sockSize=youthLarge&colors=global-yellow     | 2c91808b737220f0017381491543002b
    sportingsockteamstripedsock-3: sockSize=youthMedium&colors=global-yellow    | 2c91808b737220f001738148e22f002a
    sportingsockteamstripedsock-2: sockSize=youthSmall&colors=global-yellow     | 2c91808b737220f0017381487d600029

    colors=global-black
    sportingsockteamstripedsock-1: colors=global-black&sockSize=youthSmall      | 2c91808b737220f00173813beace0027

    colors=global-blue-navy
    sportingsockteamstripedsock-6: sockSize=adultLarge&colors=global-blue-navy  | 8ab1948a7fe401e9017fe6159a470286
  */

const updateSkusForBetterOptions = product => {
  product?.skus?.forEach(sku => {
    sku.slug = sku.options.map(opt => `${opt.optionGroupCode}=${opt.optionCode}`).join('&')
    sku.queryParams = sku.options?.reduce((acc, opt) => {
      acc[opt.optionGroupCode] = opt.optionCode
      return acc
    }, {})
    sku.paramsList = sku.options?.map(opt => {
      return {
        [opt.optionGroupCode]: opt.optionCode,
      }
    })
    sku.optionsList = sku.options?.map(opt => {
      return `${opt.optionGroupCode}=${opt.optionCode}`
    })
  })
  return product
}
const ProductModal = ({ show = true, setShow, product = {}, size = 'xLarge', footer = false, addToCart = () => {} }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  let { attributeSets, product: productWithAttributes } = useGetEntityByUrlTitleAdvanced(product.urlTitle, { includeAttributesMetadata: true, includeCategories: false, includeOptions: false, includeSkus: false, includeSettings: false })
  const { filterSkusBySelectedOptions, calculateAvaliableOptions, calculateAdditionalParamters, selectionToSku } = useProductDetail()
  // const [selectedOptions, setSelectedOptions] = useState([])
  const [optionSelection, setOptionSelection] = useState([])
  const selectedOptions = selectionObjectPairs(optionSelection)
  const cart = useSelector(disableInteractionSelector)
  updateSkusForBetterOptions(product)

  let selectedSKu = selectionToSku(product, product.skus, selectedOptions, product.optionGroups)
  const matchingSkus = filterSkusBySelectedOptions(product.skus, selectedOptions)
  const updatedProductOptions = calculateAvaliableOptions(product.optionGroups, selectedOptions, matchingSkus)
  let updateParams = calculateAdditionalParamters(product.optionGroups, updatedProductOptions)

  if (updateParams.length) {
    // http://localhost:3006/product/test-product?soccerBallSize=5 ==>  soccerBallColor=green is added
    console.log('Add additional optionGroupPairs because of option matrix', updateParams)
    setOptionSelection(selectionSlugToObject(updateParams))
  }

  const triggerSelectedOption = (optionGroupCode, optionCode) => {
    const newPossibleSelection = { ...optionSelection, [optionGroupCode]: optionCode }
    const newPossibleSelectionOptions = selectionObjectPairs(newPossibleSelection)
    //  console.log('<----- newPossibleSelectionOptions', newPossibleSelectionOptions)

    let selectedSKu = selectionToSku(product, product.skus, newPossibleSelectionOptions, product.optionGroups)
    // console.log('<----- selectedSKu', selectedSKu)
    if (selectedSKu) {
      // found a direct hit.
      setOptionSelection(newPossibleSelection)
      return
    }
    setOptionSelection({ [optionGroupCode]: optionCode })
  }

  useEffect(() => {
    if (!selectedOptions.length && product.skus.length) {
      const defaultsku = product?.skus?.filter(sku => sku.skuID === product.skuID)
      setOptionSelection(selectionSlugToObject(defaultsku[0]?.optionsList))
      // set default options because no options selected yet but product has options
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isDisabled = cart.isFetching || !selectedSKu?.skuID
  return (
    <div className="modal" tabIndex="-1" aria-modal="true" role="dialog" style={{ display: show ? 'inline' : 'none' }} onClick={() => setShow(false)}>
      <div className={'modal-dialog modal-dialog-centered ' + modalSizes[size]} onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <ProductModalHeading title={product.product_productName} skuCode={selectedSKu?.skuCode} setShow={setShow} />
          <div className="modal-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-3">{product?.productID && <ProductDetailGallery productUrlTitle={product?.urlTitle} />}</div>
                <div className="col-md-5">
                  <ProductDetailHeading product={product} />
                  <div
                    className="pt-4"
                    onClick={eventHandlerForWSIWYG}
                    dangerouslySetInnerHTML={{
                      __html: productWithAttributes?.productDescription,
                    }}
                  />
                </div>
                <div className="col-md-4">
                  <div className="my-4">{selectedSKu && <ProductPrice salePrice={selectedSKu.salePrice} listPrice={selectedSKu.listPrice} className="d-flex" showloginRequired={false} />}</div>
                  {!cart.isFetching && product?.skus?.length && <SkuOptions sku={selectedSKu} selection={optionSelection} productOptions={updatedProductOptions} skus={product?.skus} selectedOptionInModel={triggerSelectedOption} />}

                  {product?.productID && <ProductForm sku={selectedSKu} isDisabled={isDisabled} isLoading={cart.isFetching} />}
                </div>
              </div>
              <div className="row">
                <ProductAttributes product={productWithAttributes} attributeSets={attributeSets} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { modalSizes, ProductModal, Modal }
