import { useSelector } from 'react-redux'
import { getSiteConfig, getCurrencies } from '../selectors/configurationSelectors'

const useFormatCurrency = ({ minimumFractionDigits = 2 }) => {
  const { currencyCode } = useSelector(getSiteConfig)
  const currencies = useSelector(getCurrencies)
  const format = value => {
    const currency = currencies[currencyCode]
    return value ? `${currency?.currencySymbol}${value?.toFixed(minimumFractionDigits)}${currency?.formatMask}` : ''
  }
  return [format]
}
export { useFormatCurrency }
