import { useTranslation } from 'react-i18next'
import ContentLoader from 'react-content-loader'
import { FacetFilter } from './Filters/FacetFilter'

import { useFilterFormater } from '../../hooks'
import { SearchBar } from '..'

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

const ListingSidebar = ({ isFetching, hide, filtering, updateAttribute, recordsCount }) => {
  const { t } = useTranslation()

  const { option, brand, attribute, category, priceRange, productType } = useFilterFormater({ ...filtering })
  if (recordsCount < 1) return null

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
          <SearchBar />

          {productType &&
            productType.options &&
            productType.options.length > 0 &&
            !hide.includes(productType.facetKey) &&
            [productType].map(filter => {
              return <FacetFilter filter={filter} facetIdentifier="slug" facetKey={`productType_slug`} key={`productType_slug`} updateAttribute={updateAttribute} />
            })}

          {brand &&
            brand !== {} &&
            !hide.includes(brand.facetKey) &&
            [brand].map(filter => {
              return <FacetFilter filter={filter} facetIdentifier="slug" facetKey={`brand_slug`} key={`brand`} updateAttribute={updateAttribute} />
            })}

          {!isFetching &&
            category &&
            category.options &&
            category.options.length > 0 &&
            !hide.includes(category.facetKey) &&
            [category].map(filter => {
              return <FacetFilter filter={filter} facetIdentifier="slug" facetKey={`category_slug`} key={`category_slug`} updateAttribute={updateAttribute} />
            })}

          {priceRange &&
            priceRange !== {} &&
            [priceRange].map(filter => {
              return <FacetFilter filter={filter} facetIdentifier="value" facetKey={`priceRange`} key={`priceRange`} updateAttribute={updateAttribute} />
            })}

          {attribute &&
            attribute.subFacets &&
            Object.keys(attribute.subFacets).map(facetKey => {
              return [attribute.subFacets[facetKey]].map(filter => {
                return <FacetFilter filter={filter} facetIdentifier="name" facetKey={`attribute_${facetKey}`} key={`attribute_${facetKey}`} updateAttribute={updateAttribute} />
              })
            })}
          {option &&
            option.subFacets &&
            Object.keys(option.subFacets).map(facetKey => {
              return [option.subFacets[facetKey]].map(filter => {
                return <FacetFilter filter={filter} facetIdentifier="name" facetKey={`option_${facetKey}`} key={`option_${facetKey}`} updateAttribute={updateAttribute} />
              })
            })}
        </div>
      )}
    </div>
  )
}

export { ListingSidebar }
