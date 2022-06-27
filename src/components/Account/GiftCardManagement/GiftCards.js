import { AccountLayout, AccountContent } from '../..'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { GiftCardRedeemForm } from './GiftCardRedeemForm'
import { GiftCardTableRow } from './GiftCardTableRow'

const GiftCardList = () => {
  const { t } = useTranslation()
  const { giftCards } = useSelector(state => state.userReducer)

  return (
    <AccountLayout>
      <AccountContent />

      {giftCards && giftCards.length === 0 && (
        <div className="alert alert-info" role="alert">
          {t('frontend.account.giftCards.none')}
        </div>
      )}

      <GiftCardRedeemForm />

      <table className="table">
        <thead>
          <tr>
            <th>{t('frontend.account.giftCards.label.code')}</th>
            <th>{t('frontend.account.giftCards.label.issued')}</th>
            <th>{t('frontend.account.giftCards.label.status')}</th>
            <th>{t('frontend.account.giftCards.label.balance')}</th>
            <th>{t('frontend.account.giftCards.label.currency')}</th>
          </tr>
        </thead>
        <tbody>
          {giftCards &&
            giftCards.map((gc, index) => {
              return <GiftCardTableRow key={gc.giftCardID} {...gc} />
            })}
        </tbody>
      </table>

    </AccountLayout>
  )
}

export { GiftCardList }
