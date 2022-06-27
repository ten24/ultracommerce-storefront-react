import { useTranslation } from 'react-i18next'
import { useGiftCardPayment, useFormatCurrency } from '../../../hooks/'
import { SwRadioSelect } from '../../SwRadioSelect/SwRadioSelect'

const GiftCardPayment = ({ method }) => {
  const { t } = useTranslation()
  const { onSaveShippingAsBilling, setGiftCardNumber, giftCardNumber, giftCards } = useGiftCardPayment({ method })
  const [formatCurrency] = useFormatCurrency({})

  const getGiftCardOptions = () => {
    if (giftCards) {
      return giftCards.map(giftCard => ({
        name: `${giftCard.giftCardCode} - ${formatCurrency(Number(giftCard.calculatedBalanceAmount))}`,
        value: giftCard.giftCardCode
      }))
    }
    return []
  }

  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="giftCardNumber">{t('frontend.checkout.payment.giftCard.title')}</label>
            <input
              className="form-control"
              type="text"
              id="giftCardNumber"
              value={giftCardNumber}
              onChange={e => {
                e.preventDefault()
                setGiftCardNumber(e.target.value)
              }}
            />
          </div>
        </div>
        { giftCards && giftCards.length > 0 && (
          <div>
            <p>Account Gift Cards</p>
            <SwRadioSelect
              options={getGiftCardOptions()}
              selectedValue={giftCardNumber}
              onChange={v => setGiftCardNumber(v)}
            />
          </div>
        )}
      </div>

      { giftCardNumber.length > 0 &&
        <button className="btn btn-primary me-2" onClick={onSaveShippingAsBilling}>
          <span className="d-inline">{t('frontend.core.save')}</span>
        </button>
      }
    </>
  )
}
export { GiftCardPayment }
