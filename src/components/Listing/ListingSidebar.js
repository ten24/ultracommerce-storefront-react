import { ListingFilter } from '../'
import { useTranslation } from 'react-i18next'
import queryString from 'query-string'
import ContentLoader from 'react-content-loader'

import { useFormatCurrency } from '../../hooks'

const getAppliedFilters = (params, facetKey) => {
  const qs = queryString.parse(params, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  if (qs[facetKey]) {
    return Array.isArray(qs[facetKey]) ? qs[facetKey] : [qs[facetKey]]
  }
  return []
}

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

const formatPriceRange = (priceRange, formatCurrency) => {
  const options = priceRange?.options.map(option => {
    const ranges = option.name.split('-')
    if (ranges.length !== 2) {
    }
    const name = formatCurrency(parseFloat(ranges[0])) + ' - ' + formatCurrency(parseFloat(ranges[1]))
    return { name, value: option.value, legacyName: option.name }
  })
  if (options) {
    return { ...priceRange, options }
  }
}

const ListingSidebar = ({ isFetching, qs, hide, option, brand, attribute, category, priceRange, productType, updateAttribute }) => {
  const { t } = useTranslation()
  const [formatCurrency] = useFormatCurrency({})
  const newPriceRange = formatPriceRange(priceRange, formatCurrency)
  return (
    <div className="col-lg-3">
      {isFetching && (
        <>
          <FilterLoader />
          <FilterLoader />
          <FilterLoader />
        </>
      )}
      {!isFetching &&
        category &&
        category.options &&
        category.options.length > 0 &&
        category.facetKey !== hide &&
        [category].map(filter => {
          return (
            <div key={category.facetKey} className="filter-block ">
              <ListingFilter {...filter} selectType="single" qs={qs} key={category.facetKey} index={category.facetKey} appliedFilters={getAppliedFilters(qs, 'category')} updateAttribute={updateAttribute} />
            </div>
          )
        })}

      <div className="filter-block">
        <h3>{t('frontend.product.filterBy')}</h3>
        {!isFetching &&
          newPriceRange &&
          newPriceRange !== {} &&
          [newPriceRange].map(filter => {
            return <ListingFilter {...filter} selectType="single" qs={qs} key={newPriceRange.facetKey} index={newPriceRange.facetKey} facetKey="priceRange" appliedFilters={getAppliedFilters(qs, 'priceRange')} updateAttribute={updateAttribute} />
          })}

        {!isFetching &&
          brand &&
          brand !== {} &&
          !hide.includes(brand.facetKey) &&
          [brand].map(filter => {
            return <ListingFilter {...filter} selectType="single" qs={qs} key="brand" index={brand.facetKey} facetKey="brand" appliedFilters={getAppliedFilters(qs, 'brand')} updateAttribute={updateAttribute} />
          })}

        {!isFetching &&
          productType &&
          productType.options &&
          productType.options.length > 0 &&
          !hide.includes(productType.facetKey) &&
          [productType].map(filter => {
            return <ListingFilter qs={qs} key={productType.facetKey} index={productType.facetKey} {...filter} appliedFilters={getAppliedFilters(qs, 'productType')} updateAttribute={updateAttribute} />
          })}
        {!isFetching &&
          option &&
          option.subFacets &&
          Object.keys(option.subFacets).map(facetKey => {
            return [option.subFacets[facetKey]].map(filter => {
              return <ListingFilter {...filter} selectType="single" qs={qs} key={facetKey} index={facetKey} facetKey={`option_${facetKey}`} appliedFilters={getAppliedFilters(qs, `option_${facetKey}`)} updateAttribute={updateAttribute} />
            })
          })}
        {!isFetching &&
          attribute &&
          attribute.subFacets &&
          Object.keys(attribute.subFacets).map(facetKey => {
            return [attribute.subFacets[facetKey]].map(filter => {
              return <ListingFilter {...filter} selectType="single" qs={qs} key={facetKey} index={facetKey} facetKey={`attribute_${facetKey}`} appliedFilters={getAppliedFilters(qs, `attribute_${facetKey}`)} updateAttribute={updateAttribute} />
            })
          })}
      </div>
    </div>
  )
}

export { ListingSidebar }
