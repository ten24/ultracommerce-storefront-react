import { Link } from 'react-router-dom'
import { AccountLayout, AccountContent } from '../../'
import { useTranslation } from 'react-i18next'
import { useFormatDateTime, useFormatCurrency, useQuotesList } from '../../../hooks/'
import { useState } from 'react'

const QuoteStatus = ({ type = 'info', text }) => {
  return <span className={`badge bg-${type} m-0`}>{text}</span>
}

const QuotesListItem = ({ quoteName, orderID, calculatedTotalItemQuantity, orderStatusType_typeName, createdDateTime, calculatedTotal }) => {
  const [formateDate] = useFormatDateTime()
  const [formatCurrency] = useFormatCurrency({})
  return (
    <tr>
      <th>
        <Link className="nav-link-style font-weight-medium font-size-sm" to={`/my-account/quote/${orderID}`}>
          {quoteName}
        </Link>
        <br />
      </th>

      <td>
        <QuoteStatus text={orderStatusType_typeName} />
      </td>
      <td>{formateDate(createdDateTime)}</td>
      <td>{calculatedTotalItemQuantity}</td>
      <td>{formatCurrency(calculatedTotal)}</td>
    </tr>
  )
}

const AccountQuotes = ({ crumbs, title, records }) => {
  const { t } = useTranslation()
  const { quotes } = useQuotesList()
  const [selectedFilter, setSelectedFilter] = useState('qstDraft')
  const quoteStatusArray = [
    {
      code: 'qstDraft',
      label: t('frontend.account.quote.status.draft'),
    },
    {
      code: 'qstPendingReview',
      label: t('frontend.account.quote.status.submitted'),
    },
    {
      code: 'qstRejected',
      label: t('frontend.account.quote.status.rejected'),
    },
    {
      code: 'qstApproved',
      label: t('frontend.account.quote.status.approved'),
    },
    {
      code: 'qstExpired',
      label: t('frontend.account.quote.status.expired'),
    },
  ]

  return (
    <>
      <AccountLayout title={t('frontend.account.quoteTitle')}>
        <AccountContent />
        <nav className="nav nav-pills nav-justified">
          {quoteStatusArray.map(({ code, label }) => {
            return (
              <button className={code === selectedFilter ? 'nav-item nav-link active ' : 'nav-item nav-link'} key={code} onClick={() => setSelectedFilter(code)}>
                {label}
              </button>
            )
          })}
        </nav>
        <br />
        <div className="table-responsive font-size-md">
          <table className="table table-striped table-bordered ">
            <thead>
              <tr>
                <th>{t('frontend.account.quote.name')}</th>
                <th>{t('frontend.account.quote.statusTitle')}</th>
                <th>{t('frontend.account.quote.createdDateTime')}</th>
                <th>{t('frontend.account.quote.noOfItems')}</th>
                <th>{t('frontend.account.quote.totalPrice')}</th>
              </tr>
            </thead>
            <tbody>
              {quotes
                ?.filter(quote => quote.orderStatusType_typeCode === selectedFilter)
                ?.map(quote => {
                  return <QuotesListItem key={quote.orderID} {...quote} />
                })}
            </tbody>
          </table>
        </div>
      </AccountLayout>
    </>
  )
}

export { AccountQuotes }
