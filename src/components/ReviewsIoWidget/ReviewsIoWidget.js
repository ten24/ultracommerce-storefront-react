import { useProductContext, ProductContext } from '../../contexts/ProductContext'
import { useContext } from 'react'
import useReviewsIoHook from './useReviewsIoHook'
import { useSelector } from 'react-redux'
import { getDataIntegrations } from '../../selectors'
import { isAuthenticated } from '../../utils'
/**
 * This widget expects reviews io sdk accepts following keys as part of options :
 * - store - maps with storeID from integration setting
 * - sku - to filter skus for review display
 * If future updates of reviews io sdk changes / removes these properties, it'll require adjustment in component
 */

const FilteredProductReview = ( { cetReviewsioOptionsObject, props } ) => {
  const { skus } = useProductContext()
  //override skus if it's a product review and sku received from context provider
  //This is required only when widget is displayed on product detail page - we want to limit the reviews to product skus only
  if (!cetReviewsioOptionsObject?.sku && skus.length ) {
    
    //prepare array of skuCodes
    const skuCodesArray = skus.reduce( (iterator, item )=>{
      iterator.push( item.skuCode )
      return iterator
    }, [] )
    
    //set sku codes array as list on options
    cetReviewsioOptionsObject.sku = skuCodesArray.join(",")
  }

  //call generic method
  return GenericReviewIoWidget( { optionsConfig: cetReviewsioOptionsObject, props : props })
}

const WriteReviewWidget = ( {cetReviewsioOptionsObject, props} ) => {  
  //populate account details
  const { firstName, lastName, primaryEmailAddress } = useSelector(state => state.userReducer)
  cetReviewsioOptionsObject.customer_name = firstName + " " + lastName
  cetReviewsioOptionsObject.customer_email = primaryEmailAddress.emailAddress
  //call generic method
  return GenericReviewIoWidget( { optionsConfig: cetReviewsioOptionsObject, props : props, widgetType : "write" })
}

const GenericReviewIoWidget = ( { optionsConfig, props, widgetType = "list" } ) => {
  return useReviewsIoHook( { optionsConfig: optionsConfig, props : props, widgetType: widgetType })
}

const isValidJson = ( str ) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

const ReviewsIoWidget = props => {
  //check if context is available for product page
  const context = useContext(ProductContext)

  //check reviewsio integration is active and configured
  const integrations = useSelector(getDataIntegrations)
  const reviewsIoIntegration = integrations.filter(integration => integration.key === 'reviewsio')
  
  if ( !reviewsIoIntegration.length ) {
    console.log("ReviewsIo integration is inactive")
    return null
  }
  
  //fetch widget options from props
  //we're using widget options to decide if we need to display company / product / write review
  let { cetReviewsioOptionsObject } = props
  //check if object is valid json - edge case of bad config
  if( !isValidJson( cetReviewsioOptionsObject ) ) {
    console.log("Reviews Io Component is not configured correctly")
    return null
  }
  cetReviewsioOptionsObject = JSON.parse(cetReviewsioOptionsObject)

  //check if reviews widget option contains option to render product reviews && it's displayed inside productContext so we can filter reviews based on product skus
  const includeFilteredProductReview = context !== undefined && cetReviewsioOptionsObject?.options?.general?.review_type.split(",").includes("product")
  //override store id from integration if one is not provided in config
  if (!cetReviewsioOptionsObject?.store) {
    //get store id from integration settings
    cetReviewsioOptionsObject.store = reviewsIoIntegration[0].settings.storeid
  }

  const isWriteReview = cetReviewsioOptionsObject?.order_id === "{{order.order_number}}"

  //if it includes product reviews - filter the products if it's displayed inside product context
  if( includeFilteredProductReview ) {
    return FilteredProductReview( { cetReviewsioOptionsObject: cetReviewsioOptionsObject, props : props } )
  } else if( isWriteReview ) {
    //check if user is authenticated
    if( !isAuthenticated() ) {
      console.log("Reviews Io Component : User needs to be loggedin to write review")
      return null
    }
    return WriteReviewWidget( { cetReviewsioOptionsObject: cetReviewsioOptionsObject, props : props } )
  } else {
    return GenericReviewIoWidget( { optionsConfig: cetReviewsioOptionsObject, props : props } )
  }
}

export { ReviewsIoWidget }
