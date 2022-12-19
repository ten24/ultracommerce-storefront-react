import { useTranslation } from 'react-i18next'
import ContentLoader from 'react-content-loader'

import { useFilterFormater } from '../../hooks'
import { SearchBar } from '..'
import { useElementContext } from '../../contexts/ElementContextProvider'

const FilterLoader = props => (
  <ContentLoader speed={2} viewBox="0 0 400 200" className="listingSidebarLoader" {...props}>
    <rect x="25" y="15" rx="5" ry="5" width="350" height="20" />
    <rect x="25" y="45" rx="5" ry="5" width="350" height="10" />
    <rect x="25" y="60" rx="5" ry="5" width="350" height="10" />
    <rect x="26" y="75" rx="5" ry="5" width="350" height="10" />
    <rect x="27" y="107" rx="5" ry="5" width="350" height="20" />
    <rect x="26" y="135" rx="5" ry="5" width="350" height="10" />
    <rect x="26" y="150" rx="5" ry="5" width="350" height="10" />
    <rect x="27" y="165" rx="5" ry="5" width="350" height="10" />
  </ContentLoader>
)

const ListingSidebar = ({ config, isFetching, hide, filtering, updateAttribute, recordsCount }) => {
  const { t } = useTranslation()
  const { FacetFilter } = useElementContext()
  const { option, brand, attribute, category, priceRange, productType } = useFilterFormater({ ...filtering })
  if (recordsCount < 1 && !isFetching) return null
  return (
    <div className="col-lg-3">
      {isFetching && (
        <>
          <FilterLoader />
          <FilterLoader />
          <FilterLoader />
        </>
      )}

      {!isFetching && (
        <div className="filter-block p-4">
          <h4 className="border-bottom pb-2 mb-3">{t('frontend.product.filterBy')}</h4>
          <SearchBar redirectToSearchPage={false} />
          {config?.returnFacetListWithFilter?.split(',')?.map(facetKey => {
            return (
              <div key={facetKey}>
                {facetKey === 'productType' &&
                  productType?.options?.length > 0 &&
                  !hide.includes(productType.facetKey) &&
                  [productType].map(filter => {
                    return <FacetFilter config={config} filter={filter} facetIdentifier="slug" facetKey={`productType_slug`} key={`productType_slug`} updateAttribute={updateAttribute} />
                  })}
                {facetKey === 'brand' &&
                  brand &&
                  brand?.options?.length > 0 &&
                  !hide.includes(brand.facetKey) &&
                  [brand].map(filter => {
                    return <FacetFilter config={config} filter={filter} facetIdentifier="slug" facetKey={`brand_slug`} key={`brand`} updateAttribute={updateAttribute} />
                  })}
                {facetKey === 'category' &&
                  category?.options?.length > 0 &&
                  !hide.includes(category.facetKey) &&
                  [category].map(filter => {
                    return <FacetFilter config={config} filter={filter} facetIdentifier="slug" facetKey={`category_slug`} key={`category_slug`} updateAttribute={updateAttribute} />
                  })}
                {facetKey === 'priceRange' &&
                  priceRange?.options?.length > 0 &&
                  [priceRange].map(filter => {
                    return <FacetFilter config={config} filter={filter} facetIdentifier="value" facetKey={`priceRange`} key={`priceRange`} updateAttribute={updateAttribute} />
                  })}
                {facetKey === 'attribute' &&
                  attribute?.sortedSubFacets?.map(filter => {
                    return <FacetFilter config={config} filter={filter} facetIdentifier="name" facetKey={`attribute_${filter.subFacetKey}`} key={`attribute_${filter.subFacetKey}`} updateAttribute={updateAttribute} />
                  })}
                {facetKey === 'option' &&
                  option?.sortedSubFacets?.map(filter => {
                    return <FacetFilter config={config} filter={filter} facetIdentifier="name" facetKey={`option_${filter.subFacetKey}`} key={`option_${filter.subFacetKey}`} updateAttribute={updateAttribute} />
                  })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { ListingSidebar }
