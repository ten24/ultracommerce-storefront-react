import { useSelector } from 'react-redux'

const useFormatCurrency = ({ minimumFractionDigits = 2 }) => {
  const { currencies, currencyCode } = useSelector(state => state.configuration.site.hibachiConfig)
  const currency = currencies[currencyCode]
  const format = value => {
    return value ? `${currency.currencySymbol}${value?.toFixed(minimumFractionDigits)}${currency.formatMask}` : ''
  }
  return [format]
}
export default useFormatCurrency
