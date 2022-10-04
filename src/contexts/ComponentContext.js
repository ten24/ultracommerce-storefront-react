import { createContext, useContext } from 'react'
import { ContentGrid, GoogleMap, Video, Row, Html, Ribbon, ContentBlock, DynamicProductListing, ListItemWithImage, ListItem, TabPanel, SimpleTabs, SignUpForm, Footer, MenuItem, MegaMenu, MultiSitePicker, LanguagePicker, MainNavBar, SearchBar, MiniCart, AccountBubble, Header, ContentSlider, BrandSlider, ContentColumns, Block, LatestNews, ActionBanner } from '../components'

const coreComponents = {
  cetContentSlider: ContentSlider,
  // cetSidebar: 'cetSidebar',
  // cetContentSlide: 'cetContentSlide',
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
  cetTab: TabPanel,
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
  cetRow: Row,
  cetLink: 'cetLink',
  cetSearchBox: SearchBar,
  cetRibbon: Ribbon,
  // cetProductTypeListing: 'cetProductTypeListing',
  // cetProductTypeListingWithConfig: ProductSliderWithConfig,
  cetBrandListing: BrandSlider,
  // cetCategoryListing: 'cetCategoryListing',
  cetBlogListing: LatestNews,
  cetProductListing: DynamicProductListing,
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
