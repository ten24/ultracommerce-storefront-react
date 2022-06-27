import { useFormatCurrency, useFormatDate } from '../../../hooks'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const GiftCardTableRow = ({ activeFlag, calculatedBalanceAmount, currencyCode, giftCardCode, giftCardID, issuedDate }) => {
  const { t } = useTranslation()
  const [formatCurrency] = useFormatCurrency({})
  const [formateDate] = useFormatDate()

  return (
    <tr>
      <td>
        {giftCardID && (
          <Link className="nav-link-style font-weight-medium font-size-sm" to={`/my-account/gift-cards/${giftCardID}`}>
            {giftCardCode}
          </Link>
        )}
      </td>
      <td>{formateDate(issuedDate)}</td>
      <td>{activeFlag ? t('frontend.core.active') : t('frontend.core.inactive')}</td>
      <td>{formatCurrency(Number(calculatedBalanceAmount))}</td>
      <td>{currencyCode}</td>
    </tr>
  )
}

export { GiftCardTableRow }