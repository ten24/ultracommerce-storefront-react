import { AccountLayout, AccountContent } from '../..'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SlatwalApiService } from '../../../services'
import { useFormatCurrency } from '../../../hooks'
import { GiftCardTransactionTableRow } from './GiftCardTransactionTableRow'
import { Spinner } from '../../Spinner/Spinner'
import { toggleGiftCardStatus } from '../../../actions/userActions'

const GiftCardView = ({ id: giftCardID }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { giftCards } = useSelector(state => state.userReducer)

  const [transactions, setTransactions] = useState()
  const [giftCard, setGiftCard] = useState()

  const [formatCurrency] = useFormatCurrency({})

  useEffect(() => {
    SlatwalApiService.account.getGiftCardTransactions({giftCardID}).then(response => {
      if (response.isSuccess()) {
        setTransactions(response.success().giftCardTransactions.giftCardTransactions)
      }
    })
  }, [giftCardID])

  useEffect(() => {
    if (giftCards) {
      setGiftCard(giftCards.find(giftCard => giftCard.giftCardID === giftCardID))
    }
  }, [giftCards, giftCardID])

  const toggleActiveStatus = (status) => dispatch(toggleGiftCardStatus(giftCardID, !status))

  return (
    <AccountLayout>
      <AccountContent />

      { giftCard ?
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <td className="col-md-9">
                  <p className="text-uppercase">{t('frontend.account.giftCard.view.giftcard')}</p>
                  <h5>{giftCard.giftCardCode}</h5>
                </td>
                <td className="col-md-3">
                  <p>{t('frontend.account.giftCard.view.status')}</p>
                  <button
                    type="button"
                    onClick={() => toggleActiveStatus(giftCard.activeFlag)}
                    className="btn link-btn"
                    style={{padding: 0}}
                  >
                    {giftCard.activeFlag ? t('frontend.core.active') : t('frontend.core.inactive')}
                  </button>
                </td>
              </tr>
            </thead>
            <tbody className="table-light">
              <tr>
                <td colSpan={2}>{t('frontend.account.giftCard.view.currentbalance')}: {formatCurrency(Number(giftCard.calculatedBalanceAmount))} </td>
              </tr>
            </tbody>
          </table>

          <h4 style={{marginTop: '2rem'}}>{t('frontend.account.giftCard.transaction.title')}</h4>

          <table className="table">
            <thead>
              <tr>
                <th>{t('frontend.account.giftCard.transaction.type')}</th>
                <th>{t('frontend.account.giftCard.transaction.date')}</th>
                <th>{t('frontend.account.giftCard.transaction.info')}</th>
                <th>{t('frontend.account.giftCard.transaction.transaction')}</th>
                <th>{t('frontend.account.giftCard.transaction.balance')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions &&
                transactions.map(gc => {
                  return <GiftCardTransactionTableRow key={gc.giftCardTransactionID} {...gc} />
                })
              }
            </tbody>
          </table>
        </>
        :
        <>
          <Spinner/>
        </>
      }

    </AccountLayout>
  )
}

export { GiftCardView }
