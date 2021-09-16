import { Helmet } from 'react-helmet'
import { Listing, Layout, PageHeader, ProductTypeList } from '../../components'
import { useSearch } from '../../hooks'
import queryString from 'query-string'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'

const DrillDownSearch = () => {
  const history = useHistory()
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
          history.push(`${pathname}?${queryString.stringify(params, { arrayFormat: 'comma' })}`)
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

      {productTypeListRequest.isLoaded && productTypeData?.childProductTypes?.length === 0 && <Listing preFilter={{ productType_slug: productTypeUrl }} hide={['productType']} />}
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
