import { Helmet } from 'react-helmet'
import { Layout, PageHeader, ProductTypeList, ListingToolBar, ListingSidebar, ListingGrid, ListingPagination } from '../../components'
import { useListing, useSearch } from '../../hooks'
import queryString from 'query-string'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const DrillDownSearch = () => {
  const navigate = useNavigate()
  const { keyword, productTypeListRequest, productTypeData, params, pathname, crumbCalculator, productTypeUrl } = useSearch()
  const { t } = useTranslation()
  return (
    <Layout>
      <Helmet title={`Search - ${keyword}`} />

      <PageHeader title={productTypeData?.productTypeName} crumbs={crumbCalculator()} />

      <ProductTypeList
        isFetching={productTypeListRequest.isFetching || !productTypeListRequest.isLoaded}
        data={productTypeData}
        onSelect={urlTitle => {
          params['key'] = urlTitle
          navigate(`${pathname}?${queryString.stringify(params, { arrayFormat: 'comma' })}`)
        }}
      />
      {!productTypeListRequest.isFetching && productTypeListRequest.isLoaded && Object.keys(productTypeListRequest.data).length === 0 && (
        <div className="container bg-light box-shadow-lg rounded-lg p-5">
          <div className="row">
            <div className="alert alert-info" role="alert">
              {`${t('frontend.search.no_results')} ${params?.keyword}`}
            </div>
          </div>
        </div>
      )}

      {productTypeListRequest.isLoaded && productTypeData?.childProductTypes?.length === 0 && <DrillDownSearchListing preFilter={{ productType_slug: productTypeUrl }} hide={['productType']} />}
    </Layout>
  )
}

const DrillDownSearchListing = ({ productType }) => {
  const [hide] = useState('category')
  const [preFilter] = useState({
    productType_slug: productType,
  })
  const loc = useLocation()
  const { t } = useTranslation()
  const siteName = useSelector(state => state.configuration.site.siteName)
  const content = useSelector(state => state.content[loc.pathname.substring(1)])
  const { records, isFetching, potentialFilters, total, totalPages, setSort, updateAttribute, setPage, setKeyword, params } = useListing(preFilter)

  return (
    <Layout>
      <Helmet title={`${t('frontend.header.shop')} - ${siteName}`} />
      <div className="bg-lightgray py-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center">
            <h1 className="h3 text-dark mb-0 font-accent text-capitalize">{content?.title}</h1>
          </div>
        </div>
      </div>
      <div className="container product-listing mb-5">
        <ListingToolBar hide={hide} {...potentialFilters} removeFilter={updateAttribute} setSort={setSort} />
        <div className="row mt-3">
          <ListingSidebar isFetching={isFetching} hide={hide} filtering={potentialFilters} recordsCount={total} keyword={params['keyword']} setKeyword={setKeyword} updateAttribute={updateAttribute} />
          <ListingGrid isFetching={isFetching} pageRecords={records} />
        </div>
        <ListingPagination recordsCount={total} currentPage={params['currentPage']} totalPages={totalPages} setPage={setPage} />
      </div>
    </Layout>
  )
}

export default DrillDownSearch

// <div className="container pb-2 pt-5 border-bottom d-none">
// <div className="product-section mb-3">
//   <h2 className="h5">Keyblanks & Automotive</h2>
//   <div className="row">
//     <div className="col-xl-4 col-md-6 col-12 mb-3">
//       <div className="card bg-lightgray border-0">
//         <div className="card-body">
//           <h3 className="h5">
//             <button className="link-button">Electronic Hardware</button>
//           </h3>
//           <ul className="two-cols d-flex flex-wrap list-unstyled font-size-sm mb-0">
//             <li className="d-flex">
//               <button className="link-button nav-link-style">
//                 <i className="bi bi-chevron-circle-right pr-2"></i>Pushbutton Locks
//               </button>
//             </li>
//             <li className="d-flex">
//               <button className="link-button nav-link-style">
//                 <i className="bi bi-chevron-circle-right pr-2"></i>Pushbutton Parts &amp; Accessories
//               </button>
//             </li>
//             <li className="d-flex">
//               <button className="link-button nav-link-style">
//                 <i className="bi bi-chevron-circle-right pr-2"></i>Electronic Standalone
//               </button>
//             </li>
//             <li className="d-flex">
//               <button className="link-button nav-link-style">
//                 <i className="bi bi-chevron-circle-right pr-2"></i>Electronic Networked
//               </button>
//             </li>
//             <li className="d-flex">
//               <button className="link-button nav-link-style">
//                 <i className="bi bi-chevron-circle-right pr-2"></i>Access Control
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//     <div className="col-xl-4 col-md-6 col-12 mb-3">
//       <div className="card bg-lightgray border-0">
//         <div className="card-body">
//           <h3 className="h5">
//             <button className="link-button">Electronic Hardware</button>
//           </h3>
//           <ul className="two-cols d-flex flex-wrap list-unstyled font-size-sm mb-0">
//             <li className="d-flex">
//               <button className="link-button nav-link-style">
//                 <i className="bi bi-chevron-circle-right pr-2"></i>Pushbutton Locks
//               </button>
//             </li>
//             <li className="d-flex">
//               <button className="link-button nav-link-style">
//                 <i className="bi bi-chevron-circle-right pr-2"></i>Pushbutton Parts &amp; Accessories
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//     <div className="col-xl-4 col-md-6 col-12 mb-3">
//       <div className="card bg-lightgray border-0">
//         <div className="card-body">
//           <h3 className="h5">
//             <button className="link-button">Electronic Hardware</button>
//           </h3>
//           <ul className="two-cols d-flex flex-wrap list-unstyled font-size-sm mb-0">
//             <li className="d-flex">
//               <button className="link-button nav-link-style">
//                 <i className="bi bi-chevron-circle-right pr-2"></i>Pushbutton Locks
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

// <div className="product-section mb-3">
//   <h2 className="h5">Keyblanks & Automotive</h2>
//   <div className="row">
//     <div className="col-xl-4 col-md-6 col-12 mb-3">
//       <div className="card bg-lightgray border-0">
//         <div className="card-body">
//           <h3 className="h5">
//             <button className="link-button">Electronic Hardware</button>
//           </h3>
//           <ul className="two-cols d-flex flex-wrap list-unstyled font-size-sm mb-0">
//             <li className="d-flex">
//               <button className="link-button nav-link-style">
//                 <i className="bi bi-chevron-circle-right pr-2"></i>Pushbutton Locks
//               </button>
//             </li>
//             <li className="d-flex">
//               <button className="link-button nav-link-style">
//                 <i className="bi bi-chevron-circle-right pr-2"></i>Pushbutton Parts &amp; Accessories
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//     <div className="col-xl-4 col-md-6 col-12 mb-3">
//       <div className="card bg-lightgray border-0">
//         <div className="card-body">
//           <h3 className="h5">
//             <button className="link-button">Electronic Hardware</button>
//           </h3>
//           <ul className="two-cols d-flex flex-wrap list-unstyled font-size-sm mb-0">
//             <li className="d-flex">
//               <button className="link-button nav-link-style">
//                 <i className="bi bi-chevron-circle-right pr-2"></i>Pushbutton Locks
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// </div>
