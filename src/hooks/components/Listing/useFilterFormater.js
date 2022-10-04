import { useFormatCurrency } from '../../'

const useFilterFormater = ({ option, brand, attribute, category, priceRange, productType }) => {
  const [formatCurrency] = useFormatCurrency({})

  if (category && category.options) {
    category.options = category.options.map(option => {
      return { ...option, displayName: option.name }
    })
  }
  if (productType && productType.options) {
    productType.options = productType.options.map(option => {
      return { ...option, displayName: option.name }
    })
  }
  if (brand && brand.options) {
    brand.options = brand.options
      .map(option => {
        return { ...option, displayName: option.name }
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
  }

  if (priceRange && priceRange.options) {
    priceRange.options = priceRange.options.map(option => {
      const ranges = option.name.split('-')
      if (ranges.length !== 2) {
        return { ...option, displayName: option.name }
      }
      const name = formatCurrency(parseFloat(ranges?.at(0))) + ' - ' + formatCurrency(parseFloat(ranges[1]))
      return { displayName: name, name: option.name, value: option.value, legacyName: option.name }
    })
  }

  if (option && option.subFacets) {
    Object.keys(option.subFacets).map(subFact => {
      option.subFacets[subFact].options = option.subFacets[subFact].options.map(option => {
        return { ...option, displayName: option.name }
      })
      return option.subFacets[subFact]
    })
  }

  if (attribute && attribute.subFacets) {
    Object.keys(attribute.subFacets).map(subFact => {
      attribute.subFacets[subFact].options = attribute.subFacets[subFact].options.map(option => {
        return { ...option, displayName: option.name }
      })
      return attribute.subFacets[subFact]
    })
  }

  return { option, brand, attribute, category, priceRange, productType }
}

export { useFilterFormater }
