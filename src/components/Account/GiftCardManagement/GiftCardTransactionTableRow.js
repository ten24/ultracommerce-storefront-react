import { useTranslation } from 'react-i18next'
import { useFormatCurrency, useFormatDate } from '../../../hooks'

  const GiftCardTransactionTableRow = ({ debitAmount, creditAmount, giftCardTransactionID, orderPayment_order_orderNumber, createdDateTime, balanceAmount,
    orderPayment_order_orderOpenDateTime, expirationDate, orderPayment_order_orderID, currencyCode, reasonForAdjustment }) => {

      const { t } = useTranslation()
      const [formatCurrency] = useFormatCurrency({})
      const [formateDate] = useFormatDate()

      debitAmount = Number(debitAmount)
      creditAmount = Number(creditAmount)
      balanceAmount = Number(balanceAmount)
      const type = debitAmount > 0 ? 'Debit' : 'Credit'
      const typeLabel = type === 'Debit' ? t('frontend.core.debit') : t('frontend.core.credit')
      const transaction = type === 'Debit' ? debitAmount : creditAmount
      let info;

      if (orderPayment_order_orderID) {
        info = `${t('frontend.core.order')} #${orderPayment_order_orderID}`
      }

    return (
      <tr>
        <td>{typeLabel}</td>
        <td>{formateDate(createdDateTime)}</td>
        <td>{info}</td>
        <td>{type === 'Debit' ? '-' : '+'} {formatCurrency(transaction)}</td>
        <td>{formatCurrency(balanceAmount)}</td>
      </tr>
    )
  }

  export { GiftCardTransactionTableRow }