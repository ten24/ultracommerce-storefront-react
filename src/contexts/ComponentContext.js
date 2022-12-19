import { createContext, useContext } from 'react'
import { ImageGallery, BasicSidebar, ProductDetailDisplay, SearchListing, DynamicForm, ContentGrid, GoogleMap, Video, Row, Html, Ribbon, ContentBlock, DynamicProductListing, ListItemWithImage, ListItem, SimpleTabs, SignUpForm, Footer, MenuItem, MegaMenu, MultiSitePicker, LanguagePicker, MainNavBar, SearchBar, MiniCart, AccountBubble, Header, ContentSlider, BrandSlider, ContentColumns, Block, ActionBanner, BulkOrder, ContentCard, ContentLayout, ImageSlider, ReviewsIoWidget, LatestNews } from '../components'

const coreComponents = {
  cetImageSlider: ImageSlider,
  cetContentCard: ContentCard,
  cetContentLayout: ContentLayout,
  cetContentSlider: ContentSlider,
  cetSidebar: BasicSidebar,
  cetBulkOrderListing: BulkOrder,
  cetProductDetail: ProductDetailDisplay,
  cetSearchListing: SearchListing,
  cetContentGrid: ContentGrid,
  cetMap: GoogleMap,
  cetCallToCaction: ActionBanner,
  cetMenu: MainNavBar,
  cetVideo: Video,
  cetMegaMenu: MegaMenu,
  cetMenuItem: MenuItem,
  cetColumns: ContentColumns,
  cetColumn: ContentBlock,
  cetBlock: Block,
  cetTabs: SimpleTabs,
  cetListItem: ListItem,
  cetHeader: Header,
  cetMailChimpForm: SignUpForm,
  cetFooter: Footer,
  cetListItemWithImage: ListItemWithImage,
  cetAccountLink: AccountBubble,
  cetCartLink: MiniCart,
  cetLanguageSelector: LanguagePicker,
  cetSiteSelector: MultiSitePicker,
  cetHTML: Html,
  cetHtml: Html,
  cetRow: Row,
  cetLink: 'cetLink',
  cetSearchBox: SearchBar,
  cetRibbon: Ribbon,
  cetForm: DynamicForm,
  cetReviewsioBlock: ReviewsIoWidget,
  // cetProductTypeListing: 'cetProductTypeListing',
  // cetProductTypeListingWithConfig: ProductSliderWithConfig,
  cetBrandListing: BrandSlider,
  // cetCategoryListing: 'cetCategoryListing',
  cetBlogListing: LatestNews,
  cetProductListing: DynamicProductListing,
  cetImageGallery: ImageGallery,
}
const ComponentContext = createContext()

const ComponentContextProvider = ({ children, customComponents = {} }) => {
  return <ComponentContext.Provider value={{ ...coreComponents, ...customComponents }}>{children}</ComponentContext.Provider>
}

const useComponentContext = () => {
  // get the context
  const context = useContext(ComponentContext)

  // if `undefined`, throw an error
  if (!context === undefined) {
    throw new Error('useComponentContext was used outside of its Provider')
  }

  return context
}

/*
 * we return ComponentContext because a user may want to bypass the API call if th
 * user got the Content data from another spot and wants to Hydrate Manually.
 */
export { ComponentContext, ComponentContextProvider, useComponentContext }
