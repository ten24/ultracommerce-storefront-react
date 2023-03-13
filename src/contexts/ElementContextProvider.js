import { createContext, useContext } from 'react'
// import OrderConfirmation from '../pages/OrderConfirmation/OrderConfirmation'
// import GuestOrderConfirmation from '../pages/OrderConfirmation/GuestOrderConfirmation'
// import Manufacturer from '../pages/Manufacturer/Manufacturer'
// import Blog from '../pages/Blog/Blog'
// import { BlogPost } from '../pages/Blog/Blogpost'
// import Cart from '../pages/Cart/Cart'
import { SkuRow, ProductRow } from '../components/Listing/SearchDisplayModes'
import { ProductCard, SkuCard } from '../components/ProductCard/ProductCard'
import { SearchPreFilter } from '../components/SearchListing/SearchPreFilter'
import { BrandSearchListing } from '../components/SearchListing/BrandSearchListing'
import { DefaultSearchListing } from '../components/SearchListing/DefaultSearchListing'
import { ProductTypeSearchListing } from '../components/SearchListing/ProductTypeSearchListing'
import { CategorySearchListing } from '../components/SearchListing/CategorySearchListing'
import { SearchListingStack } from '../components/SearchListing/SearchListingStack'
import { ListingBanner } from '../components/ListingBanner/ListingBanner'
import { ListingSidebar } from '../components/Listing/ListingSidebar'
import { FacetFilter } from '../components/Listing/Filters/FacetFilter'
import { RelatedProductsSlider } from '../components/RelatedProductsSlider/RelatedProductsSlider'
import { AccountLogin } from '../components/Account/AccountLogin/AccountLogin'
import { CheckoutSideBar } from '../components/Checkout/CheckoutSideBar'
import { StepsHeader } from '../components/Checkout/StepsHeader'
import { ShippingSlide } from '../components/Checkout/Fulfilment/Shipping'
import { PaymentSlide } from '../components/Checkout/Payment/Payment'
import { ReviewSlide } from '../components/Checkout/Review/Review'
import { CartLineItem } from '../components/Cart/CartLineItem'
import { CartPromoBox } from '../components/Cart/CartPromoBox'
import { OrderNotes } from '../components/Cart/OrderNotes'
import { PromotionalMessaging } from '../components/Cart/PromotionalMessaging'

import { OrderSummary } from '../components/Checkout/OrderSummary'

import { CreateGuestAccount } from '../components/Account/CreateGuestAccount/CreateGuestAccount'
import { CreateOrEditAccountAddress } from '../components/Account/AccountAddresses/CreateOrEditAccountAddress'
import { AccountAddresses } from '../components/Account/AccountAddresses/AccountAddresses'
import { AccountPaymentMethods } from '../components/Account/AccountPaymentMethods/AccountPaymentMethods'
import { CreateOrEditAccountPaymentMethod } from '../components/Account/AccountPaymentMethods/CreateOrEditAccountPaymentMethod'
import { AccountOrderHistory } from '../components/Account/AccountOrderHistory/AccountOrderHistory'
import { AccountOrderDetail } from '../components/Account/AccountOrderDetail/AccountOrderDetail'
import { AccountSubscriptionOrderDetail } from '../components/Account/AccountSubscriptionOrders/AccountSubscriptionOrderDetail'
import { AccountSubscriptionOrders } from '../components/Account/AccountSubscriptionOrders/AccountSubscriptionOrders'

import { AccountQuoteDetail } from '../components/Account/AccountQuotes/AccountQuoteDetail'
import { AccountQuotes } from '../components/Account/AccountQuotes/AccountQuotes'
import { CreateAccount } from '../components/Account/CreateAccount/CreateAccount'
import { ForgotPassword } from '../components/Account/ForgotPassword/ForgotPassword'
import { ForgotPasswordReset } from '../components/Account/ForgotPasswordReset/ForgotPasswordReset'

import { GiftCardView } from '../components/Account/GiftCardManagement/GiftCardView'
import { GiftCardList } from '../components/Account/GiftCardManagement/GiftCards'
import { AccountProfile } from '../components/Account/AccountProfile/AccountProfile'
import { AccountCarts } from '../components/Account/AccountCarts/AccountCarts'
import { AccountOverview } from '../components/Account/AccountOverview/AccountOverview'
import { AccountFavorites } from '../components/Account/AccountFavorites/AccountFavorites'
import { UpdatePassword } from '../components/Account/UpdatePassword/UpdatePassword'
import { AccountImpersonation } from '../components/Account/AccountImpersonation/AccountImpersonation'

import { BreadCrumb } from '../components/BreadCrumb/BreadCrumb'
import { BlogListBody } from '../components/Blog/BlogListBody'
import { BlogPostBody } from '../components/Blog/BlogPostBody'
import { BlogPostHeader } from '../components/Blog/BlogPostHeader'
import { BlogSidebar } from '../components/Blog/BlogSideBar'
import { LatestNews } from '../components/Blog/LatestNews'
import { RecentBlogs } from '../components/Blog/RecentBlogs'
import { ListingPagination } from '../components/Listing/ListingPagination'
import { BasicCard, OverlayCard, HorizontalCard } from '../components/CMS/ContentCard/ContentCardTypes'
// import LoadDataTrackingScript from '../../components/ActivityMonitorScripts/LoadDataTrackingScript'
const coreComponents = () => ({
  // Pages
  // Manufacturer,
  // Blog,
  // BlogPost,
  // Cart,
  // OrderConfirmation,
  // GuestOrderConfirmation,
  // Blog
  BlogListBody,
  BlogPostBody,
  BlogPostHeader,
  BlogSidebar,
  LatestNews,
  RecentBlogs,
  // Account
  CreateGuestAccount,
  AccountLogin,
  CreateOrEditAccountAddress,
  AccountAddresses,
  AccountPaymentMethods,
  CreateOrEditAccountPaymentMethod,
  AccountOrderHistory,
  AccountOverview,
  AccountOrderDetail,
  AccountSubscriptionOrderDetail,
  AccountSubscriptionOrders,
  AccountQuoteDetail,
  AccountQuotes,
  GiftCardView,
  GiftCardList,
  AccountProfile,
  AccountCarts,
  AccountFavorites,
  UpdatePassword,
  AccountImpersonation,
  CreateAccount,
  ForgotPassword,
  ForgotPasswordReset,

  // Cart
  CartPromoBox,
  CartLineItem,
  OrderSummary,
  OrderNotes,
  PromotionalMessaging,
  // Checkout
  ShippingSlide,
  PaymentSlide,
  ReviewSlide,
  CheckoutSideBar,
  StepsHeader,
  // product
  SkuCard,
  SkuRow,
  ProductCard,
  ProductRow,

  RelatedProductsSlider,
  SearchPreFilter,
  BrandSearchListing,
  DefaultSearchListing,
  ProductTypeSearchListing,
  CategorySearchListing,
  ListingBanner,
  SearchListingStack,
  ListingSidebar,
  FacetFilter,
  // Listing
  ListingPagination,
  // General
  BreadCrumb,
  BasicCard,
  OverlayCard,
  HorizontalCard,
})

const UndefinedComponent = ({ name }) => {
  console.error('Caught initialization of undefined component ', name)
  return <div></div>
}
const ElementContext = createContext()

const ElementContextProvider = ({ children, customComponents = {} }) => {
  return <ElementContext.Provider value={{ ...coreComponents(), ...customComponents }}>{children}</ElementContext.Provider>
}

const useElementContext = () => {
  // get the context
  const context = useContext(ElementContext)
  // if `undefined`, throw an error
  if (!context === undefined) {
    throw new Error('useElementContext was used outside of its Provider')
  }

  // return proxy to context to prevent hard errors from being thrown if an element is missing from the context
  return new Proxy(context, {
    get(target, prop, receiver) {
      if (target[prop]) return Reflect.get(...arguments)
      return () => <UndefinedComponent name={prop} />
    },
  })
}

/*
 * we return ElementContext because a user may want to bypass the API call if th
 * user got the Content data from another spot and wants to Hydrate Manually.
 */
export { ElementContext, ElementContextProvider, useElementContext }
