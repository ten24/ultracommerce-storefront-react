import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { redeemGiftCard } from '../../../actions/userActions'

const GiftCardRedeemForm = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const giftCardRedeem = (event) => {
    event.preventDefault();
  
    const payload = {
      giftCardCode: event.target.giftCardCode.value, 
      giftCardPin: event.target.giftCardPin.value
    }
  
    dispatch(redeemGiftCard(payload)).then(() => {
      event.target.giftCardCode.value = ''
      event.target.giftCardPin.value = ''
    })
  }

  return (
    <form className="row g-3" onSubmit={giftCardRedeem}>
      <div className="col-auto input-group-sm">
        <label htmlFor="accountFirstName">{t('frontend.account.giftCards.label.code')}</label>
        <input className="form-control" type="text" id="accountFirstName" name="giftCardCode" required />
      </div>
      <div className="col-auto input-group-sm">
        <label htmlFor="accountLastName">{t('frontend.account.giftCards.label.pin')}</label>
        <input className="form-control" type="text" name="giftCardPin" required />
      </div>
      <div className="col-auto">
        <button className='btn btn-primary btn-sm' style={{'marginTop': '1.6rem'}} type="submit">{t('frontend.core.redeem')}</button>
      </div>
    </form>
  )
}

export { GiftCardRedeemForm }